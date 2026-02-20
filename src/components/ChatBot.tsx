'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Hello! I'm Ahmad's AI assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "What is Ahmad's tech stack?",
    "Show me Ahmad's projects",
    "How can I contact Ahmad?",
    "Tell me more about Ahnad."
  ];

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // CRITICAL: Don't miss this!
        },
        body: JSON.stringify({ prompt: text }), // Matches 'prompt' in the backend
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', content: data.text }]);
    } catch (error) {
      console.error("Frontend Error:", error);
      setMessages((prev) => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-black  p-3 rounded-full shadow-lg text-white z-50 transition-transform hover:scale-110"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      <div className={`fixed bottom-20 right-4 w-80 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg shadow-2xl flex flex-col h-[450px] z-50 transition-all duration-300 ease-in-out transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          <div className="bg-black dark:bg-zinc-950 p-4 text-white font-bold rounded-t-lg flex justify-between items-center">
            <span>Ahmad's AI</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg text-sm max-w-[80%] ${m.role === 'user' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : 'bg-gray-100 text-black dark:bg-zinc-800 dark:text-zinc-100'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {messages.length === 1 && (
              <div className="grid grid-cols-1 gap-2 mt-4">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(s)}
                    className="text-left text-xs p-2 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {isLoading && <div className="text-xs text-gray-400">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t dark:border-zinc-700">
            <input 
              ref={inputRef}
              className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
            />
          </form>
        </div>
    </>
  );
}