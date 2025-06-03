
import React, { useState, useEffect } from 'react';

interface CoffeeAnimationProps {
  onComplete: () => void;
}

export const CoffeeAnimation: React.FC<CoffeeAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'brewing' | 'pouring' | 'complete'>('brewing');
  const [steam, setSteam] = useState(false);
  const [pourProgress, setPourProgress] = useState(0);

  useEffect(() => {
    // Stage 1: Brewing (2 seconds)
    const brewTimer = setTimeout(() => {
      setSteam(true);
    }, 500);

    const pourTimer = setTimeout(() => {
      setStage('pouring');
      // Animate pouring
      let progress = 0;
      const pourInterval = setInterval(() => {
        progress += 10;
        setPourProgress(progress);
        if (progress >= 100) {
          clearInterval(pourInterval);
          setStage('complete');
          // Show complete for 1 second then exit
          setTimeout(onComplete, 1000);
        }
      }, 100);
    }, 2000);

    return () => {
      clearTimeout(brewTimer);
      clearTimeout(pourTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-green-400 font-mono text-center">
        {/* Coffee Maker ASCII */}
        <div className="mb-8 text-lg leading-tight">
          <div>╔══════════════════╗</div>
          <div>║    COFFEE MAKER   ║</div>
          <div>╚════════╤═════════╝</div>
          <div>         │</div>
          {stage === 'pouring' && (
            <div className="animate-pulse">
              <div>         │</div>
              <div>         │ ☕</div>
              <div>         │</div>
            </div>
          )}
          <div className="mt-4">
            {/* Mug */}
            <div>      ╭─────────╮</div>
            <div>      │         │</div>
            <div style={{ height: '60px', position: 'relative' }}>
              {/* Coffee filling up */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-800 to-yellow-600 transition-all duration-300"
                style={{ height: `${pourProgress}%`, margin: '0 6ch' }}
              />
              <div className="relative z-10">
                <div>      │         │</div>
                <div>      │    {stage === 'complete' ? 'TOP' : '   '}   │</div>
                <div>      │    {stage === 'complete' ? ' G ' : '   '}   │</div>
                <div>      ╰─────────╯</div>
              </div>
            </div>
          </div>
        </div>

        {/* Steam animation */}
        {steam && stage === 'brewing' && (
          <div className="mb-4 animate-pulse">
            <div className="text-gray-400">
              ~ ~ ~ ~ ~
            </div>
            <div className="text-gray-500">
              ~ ~ ~ ~
            </div>
          </div>
        )}

        {/* Status text */}
        <div className="text-xl mb-2">
          {stage === 'brewing' && '☕ Brewing coffee...'}
          {stage === 'pouring' && '☕ Pouring into TOP G mug...'}
          {stage === 'complete' && '☕ Coffee ready! TOP G fuel prepared.'}
        </div>

        {/* Progress indicator */}
        <div className="text-sm text-gray-400">
          {stage === 'brewing' && 'Optimized for late-night deployments...'}
          {stage === 'pouring' && `Filling: ${pourProgress}%`}
          {stage === 'complete' && 'Vulnerability scan: No known security issues detected.'}
        </div>
      </div>
    </div>
  );
};
