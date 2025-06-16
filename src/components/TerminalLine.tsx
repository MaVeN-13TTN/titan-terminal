
import React, { useState, useEffect } from 'react';

interface TerminalLineProps {
  type: 'command' | 'output';
  content: string;
  prompt?: string;
  timestamp?: string;
}

export const TerminalLine: React.FC<TerminalLineProps> = ({ 
  type, 
  content, 
  prompt, 
  timestamp 
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (type === 'output' && content.length > 50) {
      // Typing animation for longer outputs
      setIsTyping(true);
      setDisplayedContent('');
      
      let index = 0;
      const timer = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 10);

      return () => clearInterval(timer);
    } else {
      setDisplayedContent(content);
    }
  }, [content, type]);

  const formatContent = (text: string) => {
    // Handle color codes and special formatting
    if (text.includes('[green]')) {
      return text.replace(/\[green\](.*?)\[\/green\]/g, '<span class="text-green-400">$1</span>');
    }
    if (text.includes('[yellow]')) {
      return text.replace(/\[yellow\](.*?)\[\/yellow\]/g, '<span class="text-yellow-400">$1</span>');
    }
    if (text.includes('[blue]')) {
      return text.replace(/\[blue\](.*?)\[\/blue\]/g, '<span class="text-blue-400">$1</span>');
    }
    if (text.includes('[red]')) {
      return text.replace(/\[red\](.*?)\[\/red\]/g, '<span class="text-red-400">$1</span>');
    }
    return text;
  };

  return (
    <div className="flex items-start space-x-2 leading-relaxed">
      {type === 'command' && (
        <>
          <span className="flex-shrink-0">
            <span className="text-green-400">ndungukinyanjui</span>
            <span className="text-white">@</span>
            <span className="text-yellow-400">portfolio</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$ </span>
          </span>
          <span className="text-white">{displayedContent}</span>
          {timestamp && (
            <span className="text-gray-500 text-xs ml-auto">{timestamp}</span>
          )}
        </>
      )}
      
      {type === 'output' && (
        <div 
          className="text-green-400 whitespace-pre-wrap flex-1"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(displayedContent) 
          }}
        />
      )}
      
      {isTyping && (
        <span className="text-green-400 animate-pulse">█</span>
      )}
    </div>
  );
};
