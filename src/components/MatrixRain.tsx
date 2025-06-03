
import React, { useState, useEffect } from 'react';

interface MatrixRainProps {
  onComplete: () => void;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [columns, setColumns] = useState<string[][]>([]);

  useEffect(() => {
    // Initialize columns with random binary
    const numColumns = Math.floor(window.innerWidth / 20);
    const initialColumns = Array.from({ length: numColumns }, () => 
      Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0')
    );
    setColumns(initialColumns);

    // Animation interval
    const animationInterval = setInterval(() => {
      setColumns(prevColumns => 
        prevColumns.map(column => {
          // Shift column down and add new character at top
          const newColumn = [...column];
          newColumn.pop();
          newColumn.unshift(Math.random() > 0.5 ? '1' : '0');
          return newColumn;
        })
      );
    }, 100);

    // Timer countdown
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(animationInterval);
          clearInterval(timerInterval);
          setTimeout(onComplete, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(animationInterval);
      clearInterval(timerInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      <div className="grid grid-cols-auto gap-0 h-full" style={{ gridTemplateColumns: `repeat(${columns.length}, 20px)` }}>
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((char, charIndex) => (
              <div
                key={charIndex}
                className={`text-green-400 text-sm font-mono leading-tight transition-opacity duration-100 ${
                  charIndex < 3 ? 'text-green-100' : 
                  charIndex < 6 ? 'text-green-300' : 'text-green-600'
                }`}
                style={{ 
                  opacity: charIndex < 3 ? 1 : charIndex < 10 ? 0.8 : 0.4,
                  textShadow: charIndex < 3 ? '0 0 10px #00ff00' : 'none'
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Timer in bottom left */}
      <div className="fixed bottom-4 left-4 text-green-400 text-xl font-mono bg-black bg-opacity-50 px-3 py-2 rounded border border-green-400">
        {timeLeft}s
      </div>
      
      {/* Matrix quote overlay */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-green-400 text-center font-mono">
          <div className="text-2xl mb-4 animate-pulse">Welcome to the Matrix</div>
          <div className="text-lg">Reality is merely an illusion</div>
        </div>
      </div>
    </div>
  );
};
