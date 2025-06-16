import React from 'react';

interface MobileControlsProps {
  onCommand: (command: string) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onCommand }) => {
  const commonCommands = [
    { name: 'help', color: 'bg-green-900' },
    { name: 'about', color: 'bg-blue-900' },
    { name: 'skills', color: 'bg-purple-900' },
    { name: 'projects', color: 'bg-yellow-900' },
    { name: 'clear', color: 'bg-gray-900' },
    { name: 'restart', color: 'bg-red-900' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 
                    bg-black bg-opacity-95 backdrop-blur-sm
                    p-2 sm:p-3 
                    border-t border-gray-800 
                    safe-area-inset-bottom">
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 
                      overflow-x-auto scrollbar-hide pb-1">
        {commonCommands.map((cmd) => (
          <button
            key={cmd.name}
            onClick={() => onCommand(cmd.name)}
            className={`${cmd.color} hover:opacity-80 active:scale-95 
                       text-xs sm:text-sm 
                       px-2 sm:px-3 py-1 sm:py-2 
                       rounded-md transition-all duration-150
                       text-white font-medium whitespace-nowrap 
                       min-w-0 flex-shrink-0
                       touch-manipulation`}
          >
            {cmd.name}
          </button>
        ))}
      </div>
      
      {/* Mobile-specific games row */}
      <div className="flex justify-center space-x-1 mt-1 sm:mt-2">
        <button
          onClick={() => onCommand('snake')}
          className="bg-green-800 hover:opacity-80 active:scale-95
                     text-xs px-2 py-1 rounded-md transition-all duration-150
                     text-white font-medium touch-manipulation"
        >
          🐍 Snake
        </button>
        <button
          onClick={() => onCommand('matrix')}
          className="bg-emerald-800 hover:opacity-80 active:scale-95
                     text-xs px-2 py-1 rounded-md transition-all duration-150
                     text-white font-medium touch-manipulation"
        >
          🔮 Matrix
        </button>
        <button
          onClick={() => onCommand('coffee')}
          className="bg-amber-800 hover:opacity-80 active:scale-95
                     text-xs px-2 py-1 rounded-md transition-all duration-150
                     text-white font-medium touch-manipulation"
        >
          ☕ Coffee
        </button>
      </div>
      
      {/* Subtle indicator for swipe */}
      <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-2 opacity-50"></div>
    </div>
  );
};