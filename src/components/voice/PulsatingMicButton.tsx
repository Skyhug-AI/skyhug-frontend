import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';
import { getScaleStyle } from '@/utils/voiceAnimation';

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

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-16 h-16 rounded-full overflow-visible transition-all duration-500",
        "bg-orb-gradient shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        [
          "after:content-[''] after:absolute after:inset-[-4px]",
          "after:bg-orb-gradient after:opacity-30 after:rounded-full",
          `after:animate-[${isRecording && isSpeaking ? 'morphing-pulse' : 'pulse-ring'}_2.4s_ease-out_infinite] after:scale-[${isRecording && isSpeaking ? getScaleStyle(1.05, volumeLevel) : '1.05'}]`,
          "before:content-[''] before:absolute before:inset-[-7px]",
          isRecording && isSpeaking ? "before:bg-sky-gradient" : "before:bg-orb-gradient",
          "before:opacity-20 before:rounded-full",
          `before:animate-[${isRecording && isSpeaking ? 'morphing-pulse' : 'pulse-ring'}_2.8s_ease-out_infinite] before:scale-[${isRecording && isSpeaking ? getScaleStyle(1.09, volumeLevel) : '1.09'}]`,
          "[&>div:nth-child(1)]:content-[''] [&>div:nth-child(1)]:absolute [&>div:nth-child(1)]:inset-[-10px]",
          isRecording && isSpeaking ? "[&>div:nth-child(1)]:bg-sky-gradient" : "[&>div:nth-child(1)]:bg-orb-gradient",
          "[&>div:nth-child(1)]:opacity-15 [&>div:nth-child(1)]:rounded-full",
          `[&>div:nth-child(1)]:animate-[${isRecording && isSpeaking ? 'morphing-pulse' : 'pulse-ring'}_3.2s_ease-out_infinite] [&>div:nth-child(1)]:scale-[${isRecording && isSpeaking ? getScaleStyle(1.13, volumeLevel) : '1.13'}]`,
          "[&>div:nth-child(2)]:content-[''] [&>div:nth-child(2)]:absolute [&>div:nth-child(2)]:inset-[-13px]",
          isRecording && isSpeaking ? "[&>div:nth-child(2)]:bg-sky-gradient" : "[&>div:nth-child(2)]:bg-orb-gradient",
          "[&>div:nth-child(2)]:opacity-10 [&>div:nth-child(2)]:rounded-full",
          `[&>div:nth-child(2)]:animate-[${isRecording && isSpeaking ? 'morphing-pulse' : 'pulse-ring'}_3.6s_ease-out_infinite] [&>div:nth-child(2)]:scale-[${isRecording && isSpeaking ? getScaleStyle(1.17, volumeLevel) : '1.17'}]`,
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
