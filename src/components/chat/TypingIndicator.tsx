
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-8 w-8 rounded-full bg-serenity-100 flex items-center justify-center">
        <span className="text-serenity-600 text-sm font-semibold">S</span>
      </div>
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl rounded-tl-none border border-serenity-100 shadow-sm">
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-2 rounded-full bg-serenity-400 animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
