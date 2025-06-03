
import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine } from './TerminalLine';
import { CommandHandler } from '../utils/commandHandler';
import { asciiArt } from '../data/asciiArt';
import { MatrixRain } from './MatrixRain';
import { CoffeeAnimation } from './CoffeeAnimation';
import { TerminalInput } from './TerminalInput';
import { TerminalHistory } from './TerminalHistory';
import { TerminalAnimations } from './TerminalAnimations';

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
      if (typeof response === 'object' && 'type' in response && response.type === 'animation') {
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
          setHistory(prev => [...prev, { type: 'output', content: response as string }]);
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

  const getCurrentPrompt = () => {
    return 'devsecops@portfolio:~$';
  };

  return (
    <div className="h-screen flex flex-col bg-black text-green-400 p-4">
      <TerminalAnimations 
        activeAnimation={activeAnimation}
        onAnimationComplete={handleAnimationComplete}
      />

      <TerminalHistory 
        history={history}
        isTyping={isTyping}
        getCurrentPrompt={getCurrentPrompt}
        terminalRef={terminalRef}
      />
      
      <TerminalInput
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        commandHistory={commandHistory}
        historyIndex={historyIndex}
        setHistoryIndex={setHistoryIndex}
        setHistory={setHistory}
        onCommand={handleCommand}
        getCurrentPrompt={getCurrentPrompt}
        inputRef={inputRef}
      />
      
      <div className="text-xs text-gray-500 mt-2">
        Hint: Use Tab for auto-completion, ↑↓ for history, Ctrl+L to clear
      </div>
    </div>
  );
};
