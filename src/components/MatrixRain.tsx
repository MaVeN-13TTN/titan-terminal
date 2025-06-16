import React, { useState, useEffect } from 'react';

interface MatrixRainProps {
  onComplete: () => void;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [columns, setColumns] = useState<string[][]>([]);

  useEffect(() => {
    // Initialize columns to cover full screen with better calculations
    const updateDimensions = () => {
      const numColumns = Math.floor(window.innerWidth / 14); // Optimized char width for perfect coverage
      const numRows = Math.floor(window.innerHeight / 18); // Optimized row height for perfect coverage
      
      // Matrix-style characters for more authentic effect
      const matrixChars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'];
      
      const initialColumns = Array.from({ length: numColumns }, () => 
        Array.from({ length: numRows }, () => matrixChars[Math.floor(Math.random() * matrixChars.length)])
      );
      setColumns(initialColumns);
    };

    updateDimensions();
    
    // Handle window resize to maintain full coverage
    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);

    // Return cleanup function to remove event listener
    const cleanup = () => {
      window.removeEventListener('resize', handleResize);
    };

    // Enhanced animation interval with varied speeds
    const animationInterval = setInterval(() => {
      const matrixChars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'];
      
      setColumns(prevColumns => 
        prevColumns.map((column, colIndex) => {
          // Some columns fall faster than others for more realistic effect
          const shouldUpdate = Math.random() > (colIndex % 3 === 0 ? 0.3 : 0.1);
          if (!shouldUpdate) return column;
          
          // Shift column down and add new character at top
          const newColumn = [...column];
          newColumn.pop();
          newColumn.unshift(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
          return newColumn;
        })
      );
    }, 80); // Slightly faster animation

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
      cleanup();
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      <div className="absolute inset-0 flex flex-wrap" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
        {columns.map((column, colIndex) => (
          <div 
            key={colIndex} 
            className="flex flex-col"
            style={{ 
              width: '14px',
              height: '100vh',
              margin: 0,
              padding: 0,
              flex: 'none'
            }}
          >
            {column.map((char, charIndex) => (
              <div
                key={charIndex}
                className={`text-green-400 text-xs font-mono leading-none transition-opacity duration-100 ${
                  charIndex < 3 ? 'text-green-100' : 
                  charIndex < 6 ? 'text-green-300' : 'text-green-600'
                }`}
                style={{ 
                  opacity: charIndex < 3 ? 1 : charIndex < 10 ? 0.8 : 0.4,
                  textShadow: charIndex < 3 ? '0 0 10px #00ff00' : 'none',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  padding: 0
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
      
      {/* Matrix quote overlay with enhanced styling */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-green-400 text-center font-mono bg-black bg-opacity-70 p-8 rounded-lg border border-green-400">
          <div className="text-3xl mb-4 animate-pulse" style={{ textShadow: '0 0 20px #00ff00' }}>
            Welcome to the Matrix
          </div>
          <div className="text-lg" style={{ textShadow: '0 0 10px #00ff00' }}>
            Reality is merely an illusion
          </div>
          <div className="text-sm mt-4 text-green-300">
            — Ndung'u Kinyanjui's Terminal —
          </div>
        </div>
      </div>
    </div>
  );
};
