
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
  inputRef
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
          setHistory([]);
        }
        break;
    }
  };

  return (
    <>
      {suggestions.length > 0 && (
        <div className="text-yellow-400 text-sm mb-2">
          Suggestions: {suggestions.join('  ')}
        </div>
      )}
      
      <div className="flex items-center">
        <span className="text-green-500 mr-2">{getCurrentPrompt()}</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
          autoComplete="off"
          spellCheck="false"
        />
        <span className="text-green-400 animate-pulse">█</span>
      </div>
    </>
  );
};
