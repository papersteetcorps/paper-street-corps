"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useVoiceInput() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const cbRef = useRef<((t: string) => void) | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(!!navigator.mediaDevices?.getUserMedia);
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    if (wsRef.current && wsRef.current.readyState <= WebSocket.OPEN) {
      try { wsRef.current.send(JSON.stringify({ type: "Terminate" })); } catch { /* */ }
      wsRef.current.close();
    }
    wsRef.current = null;
    setListening(false);
  }, []);

  const start = useCallback(async (onResult: (text: string) => void) => {
    stop();
    setError(null);
    cbRef.current = onResult;
    transcriptRef.current = "";

    try {
      const tokenRes = await fetch("/api/speech-token", { method: "POST" });
      const tokenData = await tokenRes.json();
      if (!tokenData.token) { setError("Voice service not configured"); return; }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const params = new URLSearchParams({ token: tokenData.token, sample_rate: "16000", speech_model: "u3-rt-pro" });
      const ws = new WebSocket(`wss://streaming.assemblyai.com/v3/ws?${params}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setListening(true);
        const audioCtx = new AudioContext({ sampleRate: 16000 });
        ctxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const float32 = e.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(float32.length);
          for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          ws.send(int16.buffer);
        };

        source.connect(processor);
        processor.connect(audioCtx.destination);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "Turn" && msg.transcript) {
            if (msg.end_of_turn) {
              transcriptRef.current += (transcriptRef.current ? " " : "") + msg.transcript;
              cbRef.current?.(transcriptRef.current);
            } else {
              cbRef.current?.(transcriptRef.current + (transcriptRef.current ? " " : "") + msg.transcript);
            }
          }
        } catch { /* */ }
      };

      ws.onerror = () => {
        setError("Voice connection error");
        stop();
      };

      ws.onclose = () => {
        setListening(false);
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Microphone access denied";
      setError(msg);
      stop();
    }
  }, [stop]);

  return { listening, supported, start, stop, error };
}
