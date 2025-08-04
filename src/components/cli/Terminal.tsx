"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Home } from './content/Home';
import { Help } from './content/Help';
import { About } from './content/About';
import { Works } from './content/Works';
import { Contact } from './content/Contact';
import { NotFound } from './content/NotFound';

export function Terminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const COMMANDS = React.useMemo(() => ({
        help: <Help />,
        home: <Home />,
        about: <About />,
        works: <Works />,
        projects: <Works />,
        contact: <Contact />,
        socials: <Contact />,
        whoami: <About />,
        clear: null,
    }), []);

    const processCommand = useCallback((commandStr: string) => {
        const trimmedCommand = commandStr.trim().toLowerCase();
        if (trimmedCommand === 'clear') {
            setHistory([]);
            return;
        }

        const commandOutput = COMMANDS[trimmedCommand as keyof typeof COMMANDS] ?? <NotFound command={commandStr} />;

        const newEntry = (
            <div key={history.length}>
                <div className="flex items-center gap-2">
                    <p><span className="text-accent font-bold">user@cli-portfolio</span>:<span className="text-blue-500">~</span>$</p>
                    <p className="flex-1">{commandStr}</p>
                </div>
                <div className="leading-relaxed mt-1">{commandOutput}</div>
            </div>
        );

        setHistory(prev => [...prev, newEntry]);
    }, [COMMANDS, history.length]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const currentInput = input.trim();
            if (currentInput) {
                processCommand(currentInput);
                setCommandHistory(prev => [currentInput, ...prev].slice(0, 50));
            } else {
                 setHistory(prev => [...prev, <div key={prev.length}><p><span className="text-accent font-bold">user@cli-portfolio</span>:<span className="text-blue-500">~</span>$</p></div>]);
            }
            setInput('');
            setHistoryIndex(-1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };
    
    // Initial welcome message
    useEffect(() => {
        setHistory([<Home key="home-initial" />]);
    }, []);

    useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    return (
        <div 
            className="w-full h-[90vh] max-w-5xl bg-background rounded-lg border-2 border-border shadow-2xl backdrop-blur-sm font-code text-base"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="bg-secondary p-3 flex items-center gap-2 border-b-2 border-primary rounded-t-md">
                <div className="flex gap-2">
                    <span className="h-4 w-4 rounded-full bg-red-500"></span>
                    <span className="h-4 w-4 rounded-full bg-yellow-500"></span>
                    <span className="h-4 w-4 rounded-full bg-green-500"></span>
                </div>
                <div className="text-center flex-grow text-sm text-muted-foreground">
                    CLI Portfolio
                </div>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(90vh-52px)]" >
                <div className="flex flex-col gap-4">
                    {history}
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <p><span className="text-accent font-bold">user@cli-portfolio</span>:<span className="text-blue-500">~</span>$</p>
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
                         <span className="absolute left-0 top-0 pointer-events-none" style={{width: `${input.length}ch`}}></span>
                         <span className="bg-primary h-[1.2em] w-[0.5em] inline-block -mb-1 animate-blink absolute" style={{ left: `${input.length}ch`}}></span>
                    </div>
                </div>
                <div ref={scrollRef} />
            </div>
        </div>
    );
}
