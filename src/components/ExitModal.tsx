import React, { useState } from 'react';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({ isOpen, onClose }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showCounter, setShowCounter] = useState(false);
  const [showGoodbye, setShowGoodbye] = useState(false);

  if (!isOpen) return null;

  const handleYesClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    setShowCounter(true);

    if (newCount >= 3) {
      setShowGoodbye(true);
      setTimeout(() => {
        // Close the page/tab
        window.close();
        // Fallback for browsers that don't allow window.close()
        if (!window.closed) {
          window.location.href = 'about:blank';
        }
      }, 2000);
    }
  };

  const handleNoClick = () => {
    onClose();
    // Reset state when modal closes
    setClickCount(0);
    setShowCounter(false);
    setShowGoodbye(false);
  };

  if (showGoodbye) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
        <div className="bg-gray-900 border border-green-400 rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="text-green-400 font-mono text-2xl mb-4 animate-pulse">
            Good Bye!!! &lt;3
          </div>
          <div className="text-green-300 font-mono text-sm">
            Thank you for visiting! 🚀
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-green-400 rounded-lg p-6 max-w-md mx-4">
        <div className="text-green-400 font-mono text-lg mb-4 text-center">
          ⚠️ Exit Confirmation
        </div>
        
        <div className="text-green-300 font-mono text-sm mb-6 text-center">
          Are you sure you want to exit Ndung'u's Terminal?
        </div>

        {showCounter && (
          <div className="text-yellow-400 font-mono text-sm mb-4 text-center animate-pulse">
            Clicks: {clickCount}/3
            {clickCount < 3 && (
              <div className="text-xs text-gray-400 mt-1">
                {3 - clickCount} more click{3 - clickCount > 1 ? 's' : ''} required
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleYesClick}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-sm rounded border border-red-500 transition-colors"
          >
            Yes {showCounter && `(${clickCount}/3)`}
          </button>
          <button
            onClick={handleNoClick}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-mono text-sm rounded border border-green-500 transition-colors"
          >
            No
          </button>
        </div>

        <div className="text-green-600 font-mono text-xs mt-4 text-center">
          Terminal security protocol: Triple confirmation required
        </div>
      </div>
    </div>
  );
};
