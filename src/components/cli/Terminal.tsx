"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { Home } from "./content/Home";
import { Help } from "./content/Help";
import { About } from "./content/About";
import { Works } from "./content/Works";
import { Contact } from "./content/Contact";
import { NotFound } from "./content/NotFound";
import { Theme } from "./content/Theme";
import { trackEvent } from "@/lib/analytics";

const COMMAND_LIST = [
  { cmd: "home", desc: "Go to the home page." },
  { cmd: "about", desc: "Learn more about me." },
  { cmd: "works", desc: "View my projects." },
  { cmd: "contact", desc: "Get my contact information." },
  { cmd: "help", desc: "Display the help message." },
  { cmd: "clear", desc: "Clear the terminal screen." },
  { cmd: "whoami", desc: "Alias for about." },
  { cmd: "projects", desc: "Alias for works." },
  { cmd: "socials", desc: "Alias for contact." },
  { cmd: "theme", desc: "Change the color theme." },
];

const THEME_ARGS = [
  { cmd: "theme light", desc: "Switch to the light theme." },
  { cmd: "theme dark", desc: "Switch to the dark theme." },
  { cmd: "theme system", desc: "Follow the system theme." },
];

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Commands matching what has been typed so far.
  const suggestions = useMemo(() => {
    const value = input.toLowerCase();
    if (!value.trim()) return [];

    // "theme <arg>" gets its own argument completions.
    if (/^theme\s+\S*$/.test(value)) {
      const arg = value.split(/\s+/)[1] ?? "";
      return THEME_ARGS.filter(
        (t) => t.cmd.startsWith(`theme ${arg}`) && t.cmd !== value
      );
    }

    if (value.includes(" ")) return [];
    return COMMAND_LIST.filter((c) => c.cmd.startsWith(value) && c.cmd !== value);
  }, [input]);

  const visibleSuggestions = showSuggestions ? suggestions : [];

  // Inline "ghost" completion rendered under the caret.
  const ghost = useMemo(() => {
    if (!visibleSuggestions.length) return "";
    const active = visibleSuggestions[suggestionIndex >= 0 ? suggestionIndex : 0];
    return active.cmd.slice(input.length);
  }, [visibleSuggestions, suggestionIndex, input]);

  const processCommand = useCallback(
    (commandStr: string) => {
      const [command, ...args] = commandStr.trim().toLowerCase().split(" ");

      trackEvent("command_executed", {
        command,
        args: args.join(" "),
      });

      if (command === "clear") {
        trackEvent("terminal_cleared");
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
        trackEvent("theme_changed", { theme: themeArg });
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

      if (!COMMANDS[command as keyof typeof COMMANDS]) {
        trackEvent("command_error", { command });
      }

      if (COMMANDS[command as keyof typeof COMMANDS]) {
        trackEvent("section_viewed", { section: command });
      }

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

  const runCommand = useCallback(
    (commandStr: string) => {
      processCommand(commandStr);
      setCommandHistory((prev) => [commandStr, ...prev].slice(0, 50));
      setInput("");
      setHistoryIndex(-1);
      setSuggestionIndex(-1);
      setShowSuggestions(true);
    },
    [processCommand]
  );

  // Fill (but don't run) the prompt — used by the suggestion list and the menu.
  const fillInput = useCallback((value: string) => {
    setInput(value);
    setSuggestionIndex(-1);
    setShowSuggestions(true);
    inputRef.current?.focus();
  }, []);

  const acceptSuggestion = useCallback(() => {
    if (!visibleSuggestions.length) return false;
    const active = visibleSuggestions[suggestionIndex >= 0 ? suggestionIndex : 0];
    setInput(active.cmd);
    setSuggestionIndex(-1);
    return true;
  }, [visibleSuggestions, suggestionIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      acceptSuggestion();
      return;
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setSuggestionIndex(-1);
      return;
    }

    if (e.key === "Enter") {
      // A highlighted suggestion wins over the raw text.
      if (suggestionIndex >= 0 && visibleSuggestions[suggestionIndex]) {
        runCommand(visibleSuggestions[suggestionIndex].cmd);
        return;
      }

      const currentInput = input.trim();

      if (currentInput) {
        runCommand(currentInput);
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
        setInput("");
        setHistoryIndex(-1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // Navigate the suggestion list when it is open, otherwise the command history.
      if (visibleSuggestions.length) {
        setSuggestionIndex((i) => (i <= 0 ? visibleSuggestions.length - 1 : i - 1));
        return;
      }
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
        setShowSuggestions(false);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (visibleSuggestions.length) {
        setSuggestionIndex((i) => (i >= visibleSuggestions.length - 1 ? 0 : i + 1));
        return;
      }
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "ArrowRight") {
      // Right arrow at the end of the line accepts the ghost completion.
      const el = e.currentTarget;
      if (ghost && el.selectionStart === input.length && el.selectionEnd === input.length) {
        e.preventDefault();
        acceptSuggestion();
      }
    }
  };

  const commandCount = useRef(0);
  commandCount.current += 1;
  if (commandCount.current === 3) {
    trackEvent("engaged_user");
  }

  // Initial welcome
  useEffect(() => {
    trackEvent("terminal_session_started");
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
    const handleKey = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      // Don't steal focus if the user is already in an input field (like the chatbot).
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      focusInput();
    };
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
    <div className="w-full h-[90vh] max-w-5xl bg-background rounded-lg border-2 border-border shadow-2xl backdrop-blur-sm font-code text-base flex flex-col">

      {/* Header */}
      <div className="relative bg-secondary p-3 flex items-center gap-2 border-b-2 border-primary rounded-t-md shrink-0">
        <div className="flex gap-2">
          <span className="h-4 w-4 rounded-full bg-red-500" />
          <span className="h-4 w-4 rounded-full bg-yellow-500" />
          <span className="h-4 w-4 rounded-full bg-green-500" />
        </div>
        <div className="text-center flex-grow text-sm text-muted-foreground">
          ahmad.bat
        </div>

        {/* Command menu — tap-friendly shortcut to every command */}
        <button
          type="button"
          aria-label="Toggle command menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          {menuOpen ? "✕" : "☰"} menu
        </button>
      </div>

      {/* Menu panel */}
      {menuOpen && (
        <div className="bg-secondary/60 border-b-2 border-border px-3 py-3 shrink-0">
          <p className="text-xs text-muted-foreground mb-2">
            Tap a command to drop it into the prompt.
          </p>
          <div className="flex flex-wrap gap-2">
            {[...COMMAND_LIST, ...THEME_ARGS].map(({ cmd, desc }) => (
              <button
                key={cmd}
                type="button"
                title={desc}
                onClick={() => {
                  trackEvent("menu_command_selected", { command: cmd });
                  fillInput(cmd);
                  setMenuOpen(false);
                }}
                className="text-sm px-2 py-1 rounded bg-accent text-accent-foreground hover:opacity-80 active:opacity-60 transition-opacity"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Body (scroll + inline input) */}
      <div className="p-4 overflow-y-auto flex-1 min-h-0">
        {/* History */}
        <div className="flex flex-col gap-4">{history}</div>

        {/* Input line (inside scroll area) */}
        <div className="flex items-center gap-2 mt-4 relative">
          <p>
            <span className="text-accent font-bold">AHMAD@cli</span>:
            <span className="text-blue-500">~</span>$
          </p>

          <div className="relative flex-1">
            {/* Ghost completion sitting under the caret */}
            {ghost && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full whitespace-pre overflow-hidden text-muted-foreground/60"
              >
                <span className="invisible">{input}</span>
                {ghost}
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setSuggestionIndex(-1);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              className="relative bg-transparent border-none focus:ring-0 outline-none w-full text-foreground"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Autocomplete suggestions */}
        {visibleSuggestions.length > 0 && (
          <ul className="mt-2 sm:ml-28 flex flex-col rounded border border-border bg-secondary/80 overflow-hidden max-h-56 overflow-y-auto">
            {visibleSuggestions.map(({ cmd, desc }, i) => (
              <li key={cmd}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => fillInput(cmd)}
                  className={`w-full text-left px-2 py-1 flex items-baseline gap-2 text-sm transition-colors ${
                    i === suggestionIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/40"
                  }`}
                >
                  <span className="font-bold whitespace-nowrap">{cmd}</span>
                  <span className="text-muted-foreground truncate">{desc}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Cursor OUTSIDE layout to prevent scroll jumps */}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
