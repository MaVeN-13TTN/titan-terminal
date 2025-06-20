
import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { TerminalLine } from './TerminalLine';
import { CommandHandler } from '../utils/commandHandler';
import { asciiArt } from '../data/asciiArt';
import { MatrixRain } from './MatrixRain';
import { CoffeeAnimation } from './CoffeeAnimation';
import { TerminalInput } from './TerminalInput';
import { TerminalHistory } from './TerminalHistory';
import { TerminalAnimations } from './TerminalAnimations';
import { ExitModal } from './ExitModal';
import { MobileControls } from './MobileControls';
import { useMobile } from '../hooks/use-mobile';

export const Terminal = () => {
  const [history, setHistory] = useState<Array<{ type: 'command' | 'output', content: string, timestamp?: string }>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [fontSize, setFontSize] = useState('text-base'); // For responsive font sizing
  const [showMobileControls, setShowMobileControls] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const commandHandler = useMemo(() => new CommandHandler(), []);
  const isMobile = useMobile();

  useEffect(() => {
    // Initial welcome message
    const welcomeMessages = [
      asciiArt.banner,
      '',
      'Welcome to Ndung\'u\'s Portfolio Terminal!',
      'Ubuntu 22.04.3 LTS (GNU/Linux)',
      '',
      'Last login: ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
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
  }, [currentInput, commandHandler]);

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

    // Handle clear command specially - clear screen but preserve command history
    if (command.trim().toLowerCase() === 'clear') {
      setHistory([]);
      setIsTyping(false);
      return;
    }

    // Handle exit command specially - show exit modal
    if (command.trim().toLowerCase() === 'exit' || command.trim().toLowerCase() === 'quit') {
      setShowExitModal(true);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    try {
      const response = await commandHandler.executeCommand(command);
      
      // Handle special responses
      if (response === 'CLEAR_TERMINAL') {
        // This is now handled above in the clear command check
        setHistory([]);
        setIsTyping(false);
        return;
      }
      
      if (response === 'RESTART_TERMINAL') {
        // Show restart message then reload page
        setHistory(prev => [...prev, { type: 'output', content: 'Restarting terminal...' }]);
        setTimeout(() => {
          window.location.reload();
        }, 500);
        setIsTyping(false);
        return;
      }
      
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
    return 'ndungukinyanjui@portfolio:~$';
  };

  // Effect for mobile-first responsive design
  useEffect(() => {
    const handleResize = () => {
      // Mobile-first breakpoints
      if (window.innerWidth < 480) {
        // Extra small mobile devices
        setFontSize('text-xs');
        setShowMobileControls(true);
      } else if (window.innerWidth < 768) {
        // Small tablets and large mobile devices
        setFontSize('text-sm');
        setShowMobileControls(true);
      } else if (window.innerWidth < 1024) {
        // Tablets and small laptops
        setFontSize('text-base');
        setShowMobileControls(false);
      } else {
        // Desktop and large screens
        setFontSize('text-lg');
        setShowMobileControls(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-black text-green-400 
                     p-2 sm:p-3 md:p-4 lg:p-6 
                     ${fontSize}
                     font-mono leading-relaxed`}>
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
        isMobile={isMobile}
      />
      
      <div className={`text-[10px] sm:text-xs md:text-sm 
                       text-gray-500 mt-1 sm:mt-2 
                       mb-16 sm:mb-12 md:mb-8
                       px-1 sm:px-0`}>
        {isMobile ? 
          'Tap twice for suggestions • Use mobile controls below' : 
          'Tab: auto-complete • ↑↓: history • Ctrl+L/clear: clear screen'}
      </div>

      {showMobileControls && (
        <MobileControls onCommand={handleCommand} />
      )}

      <ExitModal 
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
      />
    </div>
  );
};
