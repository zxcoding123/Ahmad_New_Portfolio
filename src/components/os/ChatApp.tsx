"use client";

import React, { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "ai"; content: string };

const GREETING: Message = { role: "ai", content: "Hello! I'm Ahmad's AI assistant. How can I help you today?" };

const SUGGESTIONS = [
  "What is Ahmad's tech stack?",
  "Show me Ahmad's projects",
  "How can I contact Ahmad?",
];

const FALLBACK = "Sorry, I'm having trouble connecting right now.";

/** Ahmad's AI assistant, drawn inside a desktop window. */
export function ChatApp() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json().catch(() => ({}));
      // The route returns a friendly `error` for rate limits and bad input.
      const reply = res.ok ? data.text : data.error ?? FALLBACK;
      setMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch (error) {
      console.error("Frontend Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: FALLBACK }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-2 rounded-lg text-sm max-w-[80%] whitespace-pre-wrap ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2 mt-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSend(s)}
                className="text-left text-xs p-2 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {isLoading && <div className="text-xs text-muted-foreground">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-border shrink-0">
        <input
          ref={inputRef}
          className="w-full border border-border bg-secondary p-2 rounded text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
          aria-label="Message Ahmad's AI assistant"
          maxLength={500}
        />
      </form>
    </div>
  );
}
