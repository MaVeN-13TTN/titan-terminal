import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine } from './TerminalLine';
import { CommandHandler } from '../utils/commandHandler';
import { asciiArt } from '../data/asciiArt';
import { MatrixRain } from './MatrixRain';
import { CoffeeAnimation } from './CoffeeAnimation';

export const Terminal = () => {
  const [history, setHistory] = useState<Array<{ type: 'command' | 'output', content: string, timestamp?: string }>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const commandHandler = new CommandHandler();

  useEffect(() => {
    // Initial welcome message
    const welcomeMessages = [
      asciiArt.banner,
      '',
      'Welcome to my DevSecOps Portfolio Terminal!',
      'Type "help" to see available commands.',
      'Use Tab for auto-completion and arrow keys for command history.',
      ''
    ];
    
    welcomeMessages.forEach((msg, index) => {
      setTimeout(() => {
        setHistory(prev => [...prev, { type: 'output', content: msg }]);
      }, index * 100);
    });

    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Update suggestions based on current input
    if (currentInput.trim()) {
      const availableCommands = commandHandler.getAvailableCommands();
      const filtered = availableCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(currentInput.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [currentInput]);

  const handleCommand = async (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    
    // Add command to history
    setHistory(prev => [...prev, { 
      type: 'command', 
      content: command,
      timestamp 
    }]);

    if (command.trim()) {
      setCommandHistory(prev => [command, ...prev.slice(0, 49)]); // Keep last 50 commands
    }

    setIsTyping(true);

    try {
      const response = await commandHandler.executeCommand(command);
      
      // Check if response is an animation
      if (typeof response === 'object' && response.type === 'animation') {
        setActiveAnimation(response.component);
        setIsTyping(false);
        return;
      }

      // Simulate typing delay for realism
      setTimeout(() => {
        if (Array.isArray(response)) {
          response.forEach((line, index) => {
            setTimeout(() => {
              setHistory(prev => [...prev, { type: 'output', content: line }]);
            }, index * 50);
          });
        } else {
          setHistory(prev => [...prev, { type: 'output', content: response }]);
        }
        setIsTyping(false);
      }, 100);
    } catch (error) {
      setHistory(prev => [...prev, { type: 'output', content: `Error: ${error}` }]);
      setIsTyping(false);
    }
  };

  const handleAnimationComplete = () => {
    setActiveAnimation(null);
    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (currentInput.trim()) {
          handleCommand(currentInput);
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

  const getCurrentPrompt = () => {
    return 'devsecops@portfolio:~$';
  };

  return (
    <div className="h-screen flex flex-col bg-black text-green-400 p-4">
      {/* Animation overlays */}
      {activeAnimation === 'matrix' && (
        <MatrixRain onComplete={handleAnimationComplete} />
      )}
      {activeAnimation === 'coffee' && (
        <CoffeeAnimation onComplete={handleAnimationComplete} />
      )}

      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-green-600"
      >
        <div className="space-y-1">
          {history.map((entry, index) => (
            <TerminalLine 
              key={index}
              type={entry.type}
              content={entry.content}
              prompt={entry.type === 'command' ? getCurrentPrompt() : undefined}
              timestamp={entry.timestamp}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-center">
              <span className="text-green-500 mr-2">Processing</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
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
      
      <div className="text-xs text-gray-500 mt-2">
        Hint: Use Tab for auto-completion, ↑↓ for history, Ctrl+L to clear
      </div>
    </div>
  );
};
