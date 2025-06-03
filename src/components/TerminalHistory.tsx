
import React from 'react';
import { TerminalLine } from './TerminalLine';

interface TerminalHistoryProps {
  history: Array<{ type: 'command' | 'output', content: string, timestamp?: string }>;
  isTyping: boolean;
  getCurrentPrompt: () => string;
  terminalRef: React.RefObject<HTMLDivElement>;
}

export const TerminalHistory: React.FC<TerminalHistoryProps> = ({
  history,
  isTyping,
  getCurrentPrompt,
  terminalRef
}) => {
  return (
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
  );
};
