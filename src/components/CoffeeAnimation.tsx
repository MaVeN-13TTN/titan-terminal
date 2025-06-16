
import React, { useState, useEffect } from 'react';

interface CoffeeAnimationProps {
  onComplete: () => void;
}

export const CoffeeAnimation: React.FC<CoffeeAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'brewing' | 'pouring' | 'complete'>('brewing');
  const [steam, setSteam] = useState(false);
  const [pourProgress, setPourProgress] = useState(0);
  const [steamAnimation, setSteamAnimation] = useState(0);

  useEffect(() => {
    // Enhanced steam animation
    const steamTimer = setInterval(() => {
      setSteamAnimation(prev => (prev + 1) % 4);
    }, 300);

    // Stage 1: Enhanced brewing (3 seconds with better effects)
    const brewTimer = setTimeout(() => {
      setSteam(true);
    }, 300);

    const pourTimer = setTimeout(() => {
      setStage('pouring');
      // Slower, more realistic pouring animation
      let progress = 0;
      const pourInterval = setInterval(() => {
        progress += 2; // Much slower filling (was 5)
        setPourProgress(progress);
        if (progress >= 100) {
          clearInterval(pourInterval);
          setStage('complete');
          // Show complete for longer
          setTimeout(onComplete, 2000);
        }
      }, 150); // Slower timing (was 80ms)
    }, 3000);

    return () => {
      clearTimeout(brewTimer);
      clearTimeout(pourTimer);
      clearInterval(steamTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-green-400 font-mono text-center">
        {/* Enhanced Coffee Maker ASCII */}
        <div className="mb-8 text-lg leading-tight">
          <div className="text-yellow-400">╔══════════════════╗</div>
          <div className="text-yellow-400">║   ☕ TITAN BREW  ║</div>
          <div className="text-yellow-400">╚════════╤═════════╝</div>
          <div className="text-gray-300">         │</div>
          {stage === 'pouring' && (
            <div className="animate-bounce">
              <div className="text-yellow-600">         ║</div>
              <div className="text-yellow-700">         ║ ☕</div>
              <div className="text-yellow-600">         ║</div>
            </div>
          )}
          <div className="mt-4" style={{ position: 'relative', display: 'inline-block' }}>
            {/* Enhanced Mug with 3D effect - Fixed container */}
            <div className="text-gray-300" style={{ position: 'relative', width: 'max-content' }}>
              <div>      ╭─────────╮</div>
              <div>      │         │</div>
              <div style={{ height: '80px', position: 'relative', overflow: 'hidden' }}>
                {/* Enhanced Coffee filling - Positioned to fill entire mug interior */}
                <div 
                  className="absolute bottom-0 transition-all duration-300 ease-in-out"
                  style={{ 
                    height: `${pourProgress}%`, 
                    left: '0.5ch',
                    width: '10ch',
                    background: pourProgress > 0 ? 'linear-gradient(to top, #8B4513, #D2691E, #CD853F)' : 'transparent',
                    borderRadius: '0 0 4px 4px'
                  }}
                />
                {/* Text layer with fixed positioning - completely separate from coffee filling */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' }}>
                  <div>      │         │</div>
                  <div>      │         │</div>
                  <div>      │         │</div>
                  <div>      │         │</div>
                  <div>      ╰─────────╯</div>
                  <div className="text-gray-400">        └──┘</div>
                </div>
              </div>
            </div>
            
            {/* Lucky number 13 displayed below the mug - completely isolated */}
            {stage === 'complete' && (
              <div className="text-yellow-400 font-bold text-lg mt-2 animate-pulse" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                🍀 13 🍀
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Steam animation */}
        {steam && stage === 'brewing' && (
          <div className="mb-4">
            <div className="text-gray-400 animate-pulse">
              {steamAnimation === 0 && '~ ~ ~ ~ ~'}
              {steamAnimation === 1 && ' ~ ~ ~ ~ '}
              {steamAnimation === 2 && '  ~ ~ ~  '}
              {steamAnimation === 3 && ' ~ ~ ~ ~ '}
            </div>
            <div className="text-gray-500 animate-pulse">
              {steamAnimation % 2 === 0 ? '~ ~ ~ ~' : ' ~ ~ ~ '}
            </div>
            <div className="text-gray-600 animate-pulse">
              {steamAnimation % 3 === 0 ? '~ ~ ~' : ' ~ ~ '}
            </div>
          </div>
        )}

        {/* Enhanced Status text */}
        <div className="text-xl mb-2">
          {stage === 'brewing' && '☕ Brewing TITAN coffee...'}
          {stage === 'pouring' && '☕ Pouring into lucky #13 mug...'}
          {stage === 'complete' && '☕ Coffee ready! Lucky 13 fuel prepared.'}
        </div>

        {/* Enhanced Progress indicator */}
        <div className="text-sm text-gray-400">
          {stage === 'brewing' && 'Optimizing caffeine levels for maximum productivity...'}
          {stage === 'pouring' && `Filling: ${pourProgress}% | Brewing perfection...`}
          {stage === 'complete' && 'Quality check: Premium grade detected. Ready to deploy! 🚀'}
        </div>

        {/* Additional visual flair */}
        {stage === 'complete' && (
          <div className="mt-4 text-yellow-400 animate-pulse">
            ✨ Lucky Number 13 Activated ✨
          </div>
        )}
      </div>
    </div>
  );
};
