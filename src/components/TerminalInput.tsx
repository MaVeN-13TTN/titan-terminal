import React from 'react';

interface TerminalInputProps {
  currentInput: string;
  setCurrentInput: (value: string) => void;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
  commandHistory: string[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  setHistory: React.Dispatch<React.SetStateAction<Array<{ type: 'command' | 'output', content: string, timestamp?: string }>>>;
  onCommand: (command: string) => void;
  getCurrentPrompt: () => string;
  inputRef: React.RefObject<HTMLInputElement>;
  isMobile?: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  currentInput,
  setCurrentInput,
  suggestions,
  setSuggestions,
  commandHistory,
  historyIndex,
  setHistoryIndex,
  setHistory,
  onCommand,
  getCurrentPrompt,
  inputRef,
  isMobile = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (currentInput.trim()) {
          onCommand(currentInput);
        }
        setCurrentInput('');
        setHistoryIndex(-1);
        setSuggestions([]);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex] || '');
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex] || '');
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentInput('');
        }
        break;
        
      case 'Tab':
        e.preventDefault();
        if (suggestions.length === 1) {
          setCurrentInput(suggestions[0]);
          setSuggestions([]);
        } else if (suggestions.length > 1) {
          // Show all suggestions
          setHistory(prev => [...prev, 
            { type: 'output', content: suggestions.join('  ') }
          ]);
        }
        break;
        
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          // Clear screen but preserve command history
          onCommand('clear');
        }
        break;
    }
  };

  // Mobile-specific touch handlers
  const handleTouchSuggestion = () => {
    if (suggestions.length > 0) {
      setCurrentInput(suggestions[0]);
      setSuggestions([]);
    }
  };

  const handleDoubleTap = () => {
    if (isMobile) {
      // Show command suggestions on double tap for mobile
      setHistory(prev => [...prev, 
        { type: 'output', content: 'Available commands: help, about, skills, projects, certs, contact' }
      ]);
    }
  };

  return (
    <>
      {suggestions.length > 0 && (
        <div className="text-yellow-400 text-xs sm:text-sm mb-1 sm:mb-2 
                        px-1 sm:px-0 overflow-x-auto whitespace-nowrap">
          <span className="text-gray-400">Suggestions: </span>
          {suggestions.join('  ')}
        </div>
      )}
      
      <div className="flex items-center w-full">
        <div className="flex-shrink-0">
          <span className="text-xs sm:text-sm md:text-base">
            <span className="text-green-400">ndungukinyanjui</span>
            <span className="text-white">@</span>
            <span className="text-yellow-400">portfolio</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$ </span>
          </span>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onTouchEnd={handleTouchSuggestion}
          onDoubleClick={handleDoubleTap}
          className="flex-1 bg-transparent border-none outline-none 
                     text-green-400 font-mono caret-green-400
                     text-xs sm:text-sm md:text-base
                     min-w-0 px-1 sm:px-0
                     touch-manipulation"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="none"
          autoCorrect="off"
          placeholder={isMobile ? "Type command..." : ""}
        />
        
        <span className="text-green-400 animate-pulse text-xs sm:text-sm md:text-base 
                         flex-shrink-0 ml-1">█</span>
      </div>
    </>
  );
};