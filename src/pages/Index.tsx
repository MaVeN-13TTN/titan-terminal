
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useMobile } from '../hooks/use-mobile';

// Lazy load the Terminal component for better performance
const Terminal = lazy(() => import('../components/Terminal').then(module => ({ default: module.Terminal })));

const Index = () => {
  const isMobile = useMobile();
  
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading terminal...</div>}>
        <Terminal />
      </Suspense>
      
      {/* Mobile instruction overlay */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 text-xs text-center">
          <p>Rotate device for better experience or tap here for mobile tips</p>
        </div>
      )}
    </div>
  );
};

export default Index;
