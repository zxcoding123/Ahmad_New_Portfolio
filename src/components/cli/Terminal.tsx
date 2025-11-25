"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { Home } from "./content/Home";
import { Help } from "./content/Help";
import { About } from "./content/About";
import { Works } from "./content/Works";
import { Contact } from "./content/Contact";
import { NotFound } from "./content/NotFound";
import { Theme } from "./content/Theme";

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();

  const COMMANDS = React.useMemo(
    () => ({
      help: <Help />,
      home: <Home />,
      about: <About />,
      works: <Works />,
      projects: <Works />,
      contact: <Contact />,
      socials: <Contact />,
      whoami: <About />,
      clear: null,
      theme: <Theme />,
    }),
    []
  );

  const processCommand = useCallback(
    (commandStr: string) => {
      const [command, ...args] = commandStr.trim().toLowerCase().split(" ");

      if (command === "clear") {
        setHistory([]);
        return;
      }

      if (command === "theme") {
        const themeArg = args[0];
        const valid = ["light", "dark", "system"];

        const output = valid.includes(themeArg)
          ? `Theme changed to ${themeArg}.`
          : <Theme />;

        if (valid.includes(themeArg)) setTheme(themeArg);

        setHistory((prev) => [
          ...prev,
          <div key={prev.length} className="animate-fade-in">
            <div className="flex items-center gap-2">
              <p>
                <span className="text-accent font-bold">AHMAD@cli</span>:
                <span className="text-blue-500">~</span>$
              </p>
              <p className="flex-1">{commandStr}</p>
            </div>
            <div className="leading-relaxed mt-1">{output}</div>
          </div>,
        ]);
        return;
      }

      const commandOutput =
        COMMANDS[command as keyof typeof COMMANDS] ?? <NotFound command={commandStr} />;

      setHistory((prev) => [
        ...prev,
        <div key={prev.length} className="animate-fade-in">
          <div className="flex items-center gap-2">
            <p>
              <span className="text-accent font-bold">AHMAD@cli</span>:
              <span className="text-blue-500">~</span>$
            </p>
            <p className="flex-1">{commandStr}</p>
          </div>
          <div className="leading-relaxed mt-1">{commandOutput}</div>
        </div>,
      ]);
    },
    [COMMANDS, setTheme]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentInput = input.trim();

      if (currentInput) {
        processCommand(currentInput);
        setCommandHistory((prev) => [currentInput, ...prev].slice(0, 50));
      } else {
        setHistory((prev) => [
          ...prev,
          <div key={prev.length} className="animate-fade-in">
            <p>
              <span className="text-accent font-bold">AHMAD@cli</span>:
              <span className="text-blue-500">~</span>$
            </p>
          </div>,
        ]);
      }

      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  // Initial welcome
  useEffect(() => {
    setHistory([
      <div key="home-initial" className="animate-fade-in">
        <Home />
        <div className="mt-4">
          <p>
            <span className="font-bold text-primary">Languages:</span> HTML, CSS,
            JavaScript, jQuery, Python, TypeScript, Flutter, PHP
          </p>
        </div>
      </div>,
    ]);
  }, []);

  const focusInput = () => inputRef.current?.focus();

  // Focus input on any key pressed anywhere
  useEffect(() => {
    const handleKey = () => focusInput();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Auto-scroll only when new history added
  const prevLen = useRef(0);
  useEffect(() => {
    if (history.length > prevLen.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLen.current = history.length;
  }, [history]);

  return (
    <div className="w-full h-[90vh] max-w-5xl bg-background rounded-lg border-2 border-border shadow-2xl backdrop-blur-sm font-code text-base">

      {/* Header */}
      <div className="relative bg-secondary p-3 flex items-center gap-2 border-b-2 border-primary rounded-t-md">
        <div className="flex gap-2">
          <span className="h-4 w-4 rounded-full bg-red-500" />
          <span className="h-4 w-4 rounded-full bg-yellow-500" />
          <span className="h-4 w-4 rounded-full bg-green-500" />
        </div>
        <div className="text-center flex-grow text-sm text-muted-foreground">
          ahmad.bat
        </div>
      </div>

      {/* Terminal Body (scroll + inline input) */}
      <div className="p-4 overflow-y-auto h-[calc(90vh-52px)]">
        {/* History */}
        <div className="flex flex-col gap-4">{history}</div>

        {/* Input line (inside scroll area) */}
        <div className="flex items-center gap-2 mt-4 relative">
          <p>
            <span className="text-accent font-bold">AHMAD@cli</span>:
            <span className="text-blue-500">~</span>$
          </p>

          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none focus:ring-0 outline-none w-full text-foreground"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Cursor OUTSIDE layout to prevent scroll jumps */}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
