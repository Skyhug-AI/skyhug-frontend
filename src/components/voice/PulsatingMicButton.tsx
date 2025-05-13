
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';

interface PulsatingMicButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const PulsatingMicButton = ({ isRecording, onClick, disabled }: PulsatingMicButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [cleanupFunction, setCleanupFunction] = useState<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    if (isRecording) {
      const { initVoiceDetection } = useVoiceDetection((speaking, volume = 0) => {
        setIsSpeaking(speaking);
        setVolumeLevel(volume);
      });
      
      initVoiceDetection()
        .then(cleanup => {
          if (isMounted && cleanup) {
            setCleanupFunction(() => cleanup);
          }
        })
        .catch(error => {
          console.error('Error initializing voice detection:', error);
        });
    } else {
      setIsSpeaking(false);
      setVolumeLevel(0);
    }

    return () => {
      isMounted = false;
      if (cleanupFunction) {
        cleanupFunction();
      }
    };
  }, [isRecording]);

  const getScaleStyle = (baseScale: number) => {
    const volumeBoost = volumeLevel * 0.3;
    const maxScale = baseScale + 0.2;
    const calculatedScale = baseScale + volumeBoost;
    return `${Math.min(calculatedScale, maxScale)}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-16 h-16 rounded-full overflow-visible transition-all duration-500",
        isRecording && isSpeaking ? "scale-110" : "scale-100",
        {
          "bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-gradient-flow bg-gradient-size": !isRecording,
          "bg-gradient-to-r from-yellow-300 via-red-400 to-orange-300 animate-gradient-flow bg-gradient-size": isRecording
        },
        "shadow-[0_0_15px_rgba(255,204,0,0.6)]",
        "transition-transform duration-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {/* Sun rays */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "absolute bg-yellow-300/60 h-2 w-8 origin-left",
            isRecording && isSpeaking && "animate-pulse-slow",
            "transition-all duration-300"
          )}
          style={{ 
            left: '50%', 
            top: '50%',
            transformOrigin: 'center',
            transform: `rotate(${i * 30}deg) translateX(${isRecording && isSpeaking ? 14 + volumeLevel * 10 : 14}px)`,
            opacity: isRecording && isSpeaking ? 0.7 + volumeLevel * 0.3 : 0.6
          }}
        />
      ))}

      {/* Pulsating circles */}
      <div className={cn(
        "absolute inset-[-8px] rounded-full",
        isRecording && isSpeaking ? "bg-yellow-400/30" : "bg-yellow-300/20",
        "animate-pulse-slow"
      )}
        style={{
          transform: isRecording && isSpeaking ? `scale(${1.1 + volumeLevel * 0.2})` : 'scale(1.05)'
        }}
      />
      
      <div className={cn(
        "absolute inset-[-12px] rounded-full",
        isRecording && isSpeaking ? "bg-yellow-400/20" : "bg-yellow-300/10",
        "animate-[pulse-slow_3s_ease-in-out_infinite_0.5s]"
      )}
        style={{
          transform: isRecording && isSpeaking ? `scale(${1.15 + volumeLevel * 0.25})` : 'scale(1.1)'
        }}
      />
      
      <div className={cn(
        "absolute inset-[-16px] rounded-full",
        isRecording && isSpeaking ? "bg-yellow-400/10" : "bg-yellow-300/5",
        "animate-[pulse-slow_3.5s_ease-in-out_infinite_1s]"
      )}
        style={{
          transform: isRecording && isSpeaking ? `scale(${1.2 + volumeLevel * 0.3})` : 'scale(1.15)'
        }}
      />
      
      {/* Inner sun core with mic icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-6 w-6 text-white">
          {/* Simplified microphone icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
      </div>
    </button>
  );
};

export default PulsatingMicButton;
