"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  temperaments: ["What does this blend mean practically?", "How does my temperament affect relationships?", "What careers suit this temperament?"],
  "moral-alignment": ["Why am I placed here on the grid?", "What does my Structure axis score mean?", "Can alignment change over time?"],
  cjte:         ["Defend this result against my doubts", "What is my inferior function doing?", "How do I develop my auxiliary?"],
  socionics:    ["What is my PoLR and how does it affect me?", "Which sociotypes are most compatible with mine?", "What does my quadra value mean?"],
  potentiology: ["When will I crash and how do I recover?", "What environments drain my 1st function?", "How is my burnout pattern different from stress?"],
  enneagram:    ["Why this type and not the other one I selected?", "How does my fixation show up in my life phases?", "What is my trap doing to me?"],
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
        text: `Your result is loaded. Ask me anything about it — I can defend the typing, explain what it means in practice, or explore what specific scores reveal about you.`,
      }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    // placeholder for streaming model response
    setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType, result, messages: nextMessages }),
      });

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
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: "Something went wrong. Please try again." };
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="border border-surface-800 rounded-2xl overflow-hidden"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-900/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            💬
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Ask about your result</p>
            <p className="text-xs text-surface-500">Challenge it, explore it, understand it deeper</p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-surface-500 text-xs"
        >
          ▼
        </motion.span>
      </button>

      {/* Chat body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-surface-800">
              {/* Messages */}
              <div className="h-72 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-accent-blue/15 text-foreground"
                          : "bg-surface-800 text-surface-200"
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

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={streaming}
                      className="text-xs px-3 py-1.5 rounded-lg border border-surface-700 text-surface-400 hover:text-foreground hover:border-surface-500 transition-colors disabled:opacity-40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="border-t border-surface-800 px-4 py-3 flex gap-3 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your result…"
                  rows={1}
                  disabled={streaming}
                  className="flex-1 bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 text-sm text-foreground placeholder-surface-500 focus:outline-none focus:border-surface-500 resize-none disabled:opacity-50 leading-relaxed"
                  style={{ minHeight: "36px", maxHeight: "120px" }}
                  onInput={(e) => {
                    const t = e.currentTarget;
                    t.style.height = "auto";
                    t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                  }}
                />
                <button
                  onClick={() => send(input)}
                  disabled={streaming || !input.trim()}
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
                  style={{ background: accentColor }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22,2 15,22 11,13 2,9"/>
                  </svg>
                </button>
              </div>
              <p className="text-center text-xs text-surface-600 pb-3">
                Enter to send &middot; Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
