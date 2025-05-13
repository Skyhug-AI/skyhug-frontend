
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
        "shadow-[0_0_20px_rgba(255,220,100,0.7)]",
        "transition-transform duration-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {/* Core orb with gradient */}
      <div className={cn(
        "absolute inset-0 rounded-full overflow-hidden",
        "bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-200",
        isRecording ? "animate-gradient-flow bg-gradient-size" : ""
      )}
        style={{
          transform: isRecording && isSpeaking ? `scale(${1 + volumeLevel * 0.15})` : 'scale(1)'
        }}
      />
      
      {/* Sun rays */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "absolute bg-gradient-to-r from-yellow-300/80 to-orange-300/60 h-2 w-8 origin-left rounded-full",
            isRecording && isSpeaking ? "" : "opacity-60"
          )}
          style={{ 
            left: '50%', 
            top: '50%',
            transformOrigin: 'center',
            transform: `rotate(${i * 30}deg) translateX(${isRecording && isSpeaking ? 14 + volumeLevel * 12 : 14}px)`,
            opacity: isRecording && isSpeaking ? 0.7 + volumeLevel * 0.3 : 0.6,
            transition: 'all 0.5s ease-out'
          }}
        />
      ))}

      {/* Subtle glow layers - reduced flashing by removing animation from some layers */}
      <div className={cn(
        "absolute inset-[-8px] rounded-full",
        isRecording && isSpeaking ? "bg-gradient-to-r from-yellow-400/20 to-orange-300/20" : "bg-yellow-300/20"
      )}
        style={{
          transform: isRecording && isSpeaking ? `scale(${1.1 + volumeLevel * 0.2})` : 'scale(1.05)'
        }}
      />
      
      <div className={cn(
        "absolute inset-[-16px] rounded-full",
        isRecording && isSpeaking ? "bg-gradient-to-r from-yellow-400/10 to-orange-300/10" : "bg-yellow-300/10"
      )}
        style={{
          transform: isRecording && isSpeaking ? `scale(${1.15 + volumeLevel * 0.25})` : 'scale(1.1)'
        }}
      />
      
      <div className={cn(
        "absolute inset-[-24px] rounded-full",
        isRecording && isSpeaking ? "bg-gradient-to-r from-yellow-400/5 to-orange-300/5" : "bg-yellow-300/5",
        isRecording && isSpeaking ? "animate-[pulse-slow_4s_ease-in-out_infinite_1s]" : ""
      )}
        style={{
          transform: isRecording && isSpeaking ? `scale(${1.2 + volumeLevel * 0.3})` : 'scale(1.15)'
        }}
      />
    </button>
  );
};

export default PulsatingMicButton;
