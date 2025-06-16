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
    { name: 'clear', color: 'bg-red-900' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 border-t border-gray-800">
      <div className="flex justify-center space-x-2 overflow-x-auto pb-1">
        {commonCommands.map((cmd) => (
          <button
            key={cmd.name}
            onClick={() => onCommand(cmd.name)}
            className={`${cmd.color} text-xs px-3 py-1 rounded text-white whitespace-nowrap`}
          >
            {cmd.name}
          </button>
        ))}
      </div>
    </div>
  );
};