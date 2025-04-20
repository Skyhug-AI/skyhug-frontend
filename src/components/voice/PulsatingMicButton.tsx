
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
    const volumeBoost = volumeLevel * 0.2;
    const maxScale = baseScale + 0.1;
    const calculatedScale = baseScale + volumeBoost;
    return `${Math.min(calculatedScale, maxScale)}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-16 h-16 rounded-full overflow-visible transition-all duration-500",
        "bg-orb-gradient shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        [
          "after:content-[''] after:absolute after:inset-[-3px]",
          "after:bg-orb-gradient after:opacity-30 after:rounded-full",
          `after:animate-[${isRecording && isSpeaking ? 'morphing-pulse' : 'pulse-ring'}_2s_ease-out_infinite] after:scale-[${isRecording && isSpeaking ? getScaleStyle(1.04) : '1.04'}]`,
          "before:content-[''] before:absolute before:inset-[-6px]",
          "before:bg-orb-gradient before:opacity-20 before:rounded-full",
          `before:animate-[${isRecording && isSpeaking ? 'morphing-pulse' : 'pulse-ring'}_2.4s_ease-out_infinite] before:scale-[${isRecording && isSpeaking ? getScaleStyle(1.08) : '1.08'}]`,
          "[&>div:nth-child(1)]:content-[''] [&>div:nth-child(1)]:absolute [&>div:nth-child(1)]:inset-[-9px]",
          "[&>div:nth-child(1)]:bg-orb-gradient [&>div:nth-child(1)]:opacity-15 [&>div:nth-child(1)]:rounded-full",
          `[&>div:nth-child(1)]:animate-[${isRecording && isSpeaking ? 'morphing-pulse' : 'pulse-ring'}_2.8s_ease-out_infinite] [&>div:nth-child(1)]:scale-[${isRecording && isSpeaking ? getScaleStyle(1.12) : '1.12'}]`,
          "[&>div:nth-child(2)]:content-[''] [&>div:nth-child(2)]:absolute [&>div:nth-child(2)]:inset-[-12px]",
          "[&>div:nth-child(2)]:bg-orb-gradient [&>div:nth-child(2)]:opacity-10 [&>div:nth-child(2)]:rounded-full",
          `[&>div:nth-child(2)]:animate-[${isRecording && isSpeaking ? 'morphing-pulse' : 'pulse-ring'}_3.2s_ease-out_infinite] [&>div:nth-child(2)]:scale-[${isRecording && isSpeaking ? getScaleStyle(1.16) : '1.16'}]`,
          "shadow-lg shadow-orb-periwinkle/50",
          isRecording && isSpeaking ? "scale-105" : "scale-100",
          "transition-transform duration-300"
        ],
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      <div />
      <div />
    </button>
  );
};

export default PulsatingMicButton;
