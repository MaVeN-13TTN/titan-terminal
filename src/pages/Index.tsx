
import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from '../components/Terminal';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <Terminal />
    </div>
  );
};

export default Index;
