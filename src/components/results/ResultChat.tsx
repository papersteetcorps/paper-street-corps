"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { logEvent } from "@/lib/logger";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ResultChatProps {
  testType: string;
  result: Record<string, unknown>;
  accentColor?: string;
}

const SUGGESTED: Record<string, string[]> = {
  temperaments:      ["What does this blend mean day-to-day?", "How does it affect my relationships?", "What careers suit this?"],
  "moral-alignment": ["Why am I placed here on the grid?", "What does my Structure axis mean?", "Can alignment change?"],
  cjte:              ["Challenge this result", "What is my inferior function doing?", "How do I develop my auxiliary?"],
  socionics:         ["What is my PoLR?", "Which types are most compatible?", "What does my quadra value?"],
  potentiology:      ["How do I recover from a crash?", "What drains my 1st function?", "How is my burnout different from stress?"],
  enneagram:         ["Why this type and not my other pick?", "How does my fixation show up over time?", "What is my trap doing to me?"],
};

export default function ResultChat({ testType, result, accentColor = "var(--color-accent-blue)" }: ResultChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = SUGGESTED[testType] ?? SUGGESTED.cjte;

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        text: "Need help making sense of your results?",
      }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType, result, messages: nextMessages }),
      });

      if (!res.ok) throw new Error("Service unavailable");
      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", text: accumulated };
          return updated;
        });
      }

      // Log the user-AI exchange (fire-and-forget)
      logEvent("result_chat_exchange", {
        testType,
        payload: { user: userMsg.text, assistant: accumulated },
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: "Can't connect right now. Try again in a bit." };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }, [messages, streaming, testType, result]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl border border-surface-700"
            style={{ background: "var(--color-surface-800)" }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-surface-700"
              style={{ background: "var(--color-surface-900, #0d0d0d)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: accentColor }}
                />
                <span className="text-sm font-semibold text-foreground">Ask about your result</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-400 hover:text-foreground hover:bg-surface-700 transition-colors"
                aria-label="Close chat"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="1" y1="1" x2="11" y2="11" />
                  <line x1="11" y1="1" x2="1" y2="11" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent-blue/15 text-foreground"
                        : "bg-surface-700 text-surface-200"
                    }`}
                  >
                    {msg.text}
                    {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                      <span className="inline-block w-0.5 h-3.5 bg-surface-400 ml-0.5 animate-pulse align-middle" />
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={streaming}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-600 text-surface-400 hover:text-foreground hover:border-surface-500 transition-colors disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="border-t border-surface-700 px-3 py-2.5 flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                disabled={streaming}
                className="flex-1 bg-surface-700 border border-surface-600 rounded-xl px-3 py-2 text-sm text-foreground placeholder-surface-500 focus:outline-none focus:border-surface-500 resize-none disabled:opacity-50 leading-relaxed"
                style={{ minHeight: "36px", maxHeight: "100px" }}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = `${Math.min(t.scrollHeight, 100)}px`;
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={streaming || !input.trim()}
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40"
                style={{ background: accentColor }}
                aria-label="Send message"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22,2 15,22 11,13 2,9" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-surface-600 pb-2.5">
              Enter to send &middot; Shift+Enter for new line
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ background: accentColor }}
        aria-label={open ? "Close chat" : "Open chat"}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
              width="18"
              height="18"
              viewBox="0 0 12 12"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
