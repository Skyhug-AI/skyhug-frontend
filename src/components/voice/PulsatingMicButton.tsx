
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

  // Calculate ring scales based on volume with reduced sensitivity
  const getScaleStyle = (baseScale: number) => {
    // Reduce multiplier to decrease sensitivity
    const volumeBoost = volumeLevel * 0.3; 
    // Apply a max cap to prevent rings from getting too large
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
        "bg-orb-gradient shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        isRecording && isSpeaking ? [
          "after:content-[''] after:absolute after:inset-[-6px]", // Made smaller
          "after:bg-orb-gradient after:opacity-40 after:rounded-full",
          `after:animate-[pulse-ring_1.2s_ease-out_infinite] after:scale-[${getScaleStyle(1.1)}]`,
          "before:content-[''] before:absolute before:inset-[-12px]", // Made smaller
          "before:bg-orb-gradient before:opacity-30 before:rounded-full",
          `before:animate-[pulse-ring_1.6s_ease-out_infinite] before:scale-[${getScaleStyle(1.2)}]`,
          "[&>div:nth-child(1)]:content-[''] [&>div:nth-child(1)]:absolute [&>div:nth-child(1)]:inset-[-18px]", // Made smaller
          "[&>div:nth-child(1)]:bg-orb-gradient [&>div:nth-child(1)]:opacity-20 [&>div:nth-child(1)]:rounded-full",
          `[&>div:nth-child(1)]:animate-[pulse-ring_2s_ease-out_infinite] [&>div:nth-child(1)]:scale-[${getScaleStyle(1.3)}]`,
          "[&>div:nth-child(2)]:content-[''] [&>div:nth-child(2)]:absolute [&>div:nth-child(2)]:inset-[-24px]", // Made smaller
          "[&>div:nth-child(2)]:bg-orb-gradient [&>div:nth-child(2)]:opacity-10 [&>div:nth-child(2)]:rounded-full",
          `[&>div:nth-child(2)]:animate-[pulse-ring_2.4s_ease-out_infinite] [&>div:nth-child(2)]:scale-[${getScaleStyle(1.4)}]`,
          "shadow-lg shadow-orb-periwinkle/50",
          "scale-110 animate-[soft-pulse_1.5s_ease-out_infinite]",
        ] : isRecording ? [
          "shadow-md shadow-orb-periwinkle/20",
          "animate-pulse",
        ] : [
          "hover:shadow-lg hover:scale-[1.02] transition-transform",
          "shadow-md shadow-orb-periwinkle/20",
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
