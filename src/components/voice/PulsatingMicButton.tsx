
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
        "relative w-16 h-16 rounded-full overflow-visible transition-all duration-300",
        "bg-gradient-to-br from-amber-100 via-amber-300 to-orange-400",
        [
          "after:content-[''] after:absolute after:inset-[-4px]",
          "after:bg-gradient-to-br after:from-amber-200 after:via-amber-300 after:to-orange-400 after:opacity-30 after:rounded-full",
          `after:animate-[${isRecording ? (isSpeaking ? 'morphing-pulse-fast' : 'pulse-ring')} 1.6s ease-out infinite] after:scale-[${isRecording ? getScaleStyle(1.08, volumeLevel) : '1.05'}]`,
          "before:content-[''] before:absolute before:inset-[-7px]",
          isRecording && isSpeaking ? 
            "before:bg-gradient-to-br before:from-yellow-200 before:via-amber-400 before:to-orange-500" : 
            "before:bg-gradient-to-br before:from-amber-200 before:via-amber-300 before:to-orange-400",
          "before:opacity-20 before:rounded-full",
          `before:animate-[${isRecording ? (isSpeaking ? 'morphing-pulse-fast' : 'pulse-ring')} 1.8s ease-out infinite] before:scale-[${isRecording ? getScaleStyle(1.12, volumeLevel) : '1.09'}]`,
          "[&>div:nth-child(1)]:content-[''] [&>div:nth-child(1)]:absolute [&>div:nth-child(1)]:inset-[-10px]",
          isRecording && isSpeaking ? 
            "[&>div:nth-child(1)]:bg-gradient-to-br [&>div:nth-child(1)]:from-yellow-300 [&>div:nth-child(1)]:via-amber-400 [&>div:nth-child(1)]:to-orange-500" : 
            "[&>div:nth-child(1)]:bg-gradient-to-br [&>div:nth-child(1)]:from-amber-200 [&>div:nth-child(1)]:via-amber-300 [&>div:nth-child(1)]:to-orange-400",
          "[&>div:nth-child(1)]:opacity-15 [&>div:nth-child(1)]:rounded-full",
          `[&>div:nth-child(1)]:animate-[${isRecording ? (isSpeaking ? 'morphing-pulse-fast' : 'pulse-ring')} 2s ease-out infinite] [&>div:nth-child(1)]:scale-[${isRecording ? getScaleStyle(1.15, volumeLevel) : '1.13'}]`,
          "[&>div:nth-child(2)]:content-[''] [&>div:nth-child(2)]:absolute [&>div:nth-child(2)]:inset-[-13px]",
          isRecording && isSpeaking ? 
            "[&>div:nth-child(2)]:bg-gradient-to-br [&>div:nth-child(2)]:from-yellow-400 [&>div:nth-child(2)]:via-amber-500 [&>div:nth-child(2)]:to-orange-600" : 
            "[&>div:nth-child(2)]:bg-gradient-to-br [&>div:nth-child(2)]:from-amber-200 [&>div:nth-child(2)]:via-amber-300 [&>div:nth-child(2)]:to-orange-400",
          "[&>div:nth-child(2)]:opacity-10 [&>div:nth-child(2)]:rounded-full",
          `[&>div:nth-child(2)]:animate-[${isRecording ? (isSpeaking ? 'morphing-pulse-fast' : 'pulse-ring')} 2.2s ease-out infinite] [&>div:nth-child(2)]:scale-[${isRecording ? getScaleStyle(1.18, volumeLevel) : '1.17'}]`,
          "shadow-lg shadow-amber-400/30",
          isRecording && isSpeaking ? "scale-110" : "scale-100",
          "transition-all duration-300",
          isRecording && isSpeaking && "animate-[color-shift_2s_linear_infinite]"
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

