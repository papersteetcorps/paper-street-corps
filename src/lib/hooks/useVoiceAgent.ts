"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const RATE = 24_000;

export type ToolCall = { call_id: string; name: string; arguments: Record<string, unknown> };

export interface VoiceAgentConfig {
  systemPrompt: string;
  greeting?: string;
  voice?: string;
  tools?: Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }>;
  onTranscriptUser?: (text: string) => void;
  onTranscriptAgent?: (text: string, interrupted: boolean) => void;
  onToolCall?: (call: ToolCall) => Promise<unknown> | unknown;
  onError?: (msg: string) => void;
  onReady?: () => void;
}

const WORKLET_URL = "/voice-agent-worklet.js";

export function useVoiceAgent() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const playTimeRef = useRef(0);
  const cfgRef = useRef<VoiceAgentConfig | null>(null);
  const startingRef = useRef(false);

  const stop = useCallback(() => {
    startingRef.current = false;
    try { wsRef.current?.close(); } catch { /* */ }
    wsRef.current = null;
    micRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    playTimeRef.current = 0;
    setConnected(false);
    setConnecting(false);
    setUserSpeaking(false);
    setAgentSpeaking(false);
  }, []);

  const start = useCallback(async (config: VoiceAgentConfig) => {
    if (startingRef.current) return;
    startingRef.current = true;
    stop();
    startingRef.current = true; // re-set after stop()
    cfgRef.current = config;
    setConnecting(true);

    try {
      // 1. Get token
      const tokenRes = await fetch("/api/voice-agent-token", { method: "POST" });
      const tokenData = await tokenRes.json();
      if (!tokenData.token) {
        config.onError?.("Voice agent not configured");
        setConnecting(false);
        startingRef.current = false;
        return;
      }

      // 2. Mic + audio context
      const ctx = new AudioContext({ sampleRate: RATE });
      ctxRef.current = ctx;
      await ctx.resume();
      try {
        await ctx.audioWorklet.addModule(WORKLET_URL);
      } catch (workletErr) {
        const msg = workletErr instanceof Error ? workletErr.message : "Unable to load worklet";
        config.onError?.(`Voice setup failed: ${msg}`);
        startingRef.current = false;
        stop();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      micRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(ctx, "pcm");

      // 3. WebSocket
      const url = new URL("wss://agents.assemblyai.com/v1/ws");
      url.searchParams.set("token", tokenData.token);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      let ready = false;

      worklet.port.onmessage = ({ data }: MessageEvent<ArrayBuffer>) => {
        if (!ready || ws.readyState !== WebSocket.OPEN) return;
        const b = new Uint8Array(data);
        let s = "";
        for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
        ws.send(JSON.stringify({ type: "input.audio", audio: btoa(s) }));
      };

      source.connect(worklet).connect(ctx.destination);

      ws.onopen = () => {
        const session: Record<string, unknown> = {
          system_prompt: config.systemPrompt,
        };
        if (config.greeting) session.greeting = config.greeting;
        if (config.voice) session.output = { voice: config.voice };
        if (config.tools && config.tools.length) session.tools = config.tools;

        ws.send(JSON.stringify({ type: "session.update", session }));
      };

      ws.onmessage = async ({ data }) => {
        try {
          const m = JSON.parse(data) as Record<string, unknown>;
          switch (m.type) {
            case "session.ready":
              ready = true;
              startingRef.current = false;
              setConnecting(false);
              setConnected(true);
              config.onReady?.();
              break;

            case "input.speech.started":
              setUserSpeaking(true);
              break;
            case "input.speech.stopped":
              setUserSpeaking(false);
              break;

            case "reply.started":
              setAgentSpeaking(true);
              break;

            case "reply.audio": {
              const raw = atob(m.data as string);
              const pcm = new Int16Array(raw.length / 2);
              for (let i = 0; i < pcm.length; i++)
                pcm[i] = raw.charCodeAt(i * 2) | (raw.charCodeAt(i * 2 + 1) << 8);
              const f32 = new Float32Array(pcm.length);
              for (let i = 0; i < pcm.length; i++) f32[i] = pcm[i] / 32768;
              const buf = ctx.createBuffer(1, f32.length, RATE);
              buf.getChannelData(0).set(f32);
              const src = ctx.createBufferSource();
              src.buffer = buf;
              src.connect(ctx.destination);
              playTimeRef.current = Math.max(playTimeRef.current, ctx.currentTime);
              src.start(playTimeRef.current);
              playTimeRef.current += buf.duration;
              break;
            }

            case "reply.done":
              setAgentSpeaking(false);
              if (m.status === "interrupted") playTimeRef.current = ctx.currentTime;
              break;

            case "transcript.user":
              config.onTranscriptUser?.(m.text as string);
              break;

            case "transcript.agent":
              config.onTranscriptAgent?.(m.text as string, !!m.interrupted);
              break;

            case "tool.call": {
              const call = {
                call_id: m.call_id as string,
                name: m.name as string,
                arguments: (m.arguments as Record<string, unknown>) ?? {},
              };
              const result = config.onToolCall ? await config.onToolCall(call) : null;
              ws.send(JSON.stringify({
                type: "tool.result",
                call_id: call.call_id,
                result: result ?? "ok",
              }));
              break;
            }

            case "session.error":
              config.onError?.(String(m.message ?? "Session error"));
              break;
          }
        } catch (e) {
          // ignore parse errors
          void e;
        }
      };

      ws.onerror = () => {
        config.onError?.("Connection failed");
        stop();
      };
      ws.onclose = () => {
        setConnected(false);
        setConnecting(false);
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Microphone access denied";
      config.onError?.(msg);
      startingRef.current = false;
      stop();
    }
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop, connecting, connected, userSpeaking, agentSpeaking };
}
