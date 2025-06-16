import React, { lazy, Suspense } from 'react';
import { MatrixRain } from './MatrixRain';
import { CoffeeAnimation } from './CoffeeAnimation';

// Lazy load game components for better performance
const SnakeGame = lazy(() => import('./games/SnakeGame'));

interface TerminalAnimationsProps {
  activeAnimation: string | null;
  onAnimationComplete: () => void;
}

export const TerminalAnimations: React.FC<TerminalAnimationsProps> = ({
  activeAnimation,
  onAnimationComplete
}) => {
  if (!activeAnimation) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      {activeAnimation === 'matrix' && (
        <div className="h-full w-full">
          <MatrixRain onComplete={onAnimationComplete} />
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
            Click anywhere to exit
          </div>
        </div>
      )}
      
      {activeAnimation === 'coffee' && (
        <div className="h-full w-full">
          <CoffeeAnimation onComplete={onAnimationComplete} />
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
            Click anywhere to exit
          </div>
        </div>
      )}
      
      {activeAnimation === 'snake' && (
        <Suspense fallback={<div className="flex items-center justify-center h-full text-green-400">Loading Snake...</div>}>
          <SnakeGame onExit={onAnimationComplete} />
        </Suspense>
      )}
    </div>
  );
};