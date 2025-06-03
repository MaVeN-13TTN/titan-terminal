
import React from 'react';
import { MatrixRain } from './MatrixRain';
import { CoffeeAnimation } from './CoffeeAnimation';

interface TerminalAnimationsProps {
  activeAnimation: string | null;
  onAnimationComplete: () => void;
}

export const TerminalAnimations: React.FC<TerminalAnimationsProps> = ({
  activeAnimation,
  onAnimationComplete
}) => {
  return (
    <>
      {activeAnimation === 'matrix' && (
        <MatrixRain onComplete={onAnimationComplete} />
      )}
      {activeAnimation === 'coffee' && (
        <CoffeeAnimation onComplete={onAnimationComplete} />
      )}
    </>
  );
};
