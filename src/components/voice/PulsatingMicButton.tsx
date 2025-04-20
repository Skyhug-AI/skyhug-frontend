
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
  const [cleanupFunction, setCleanupFunction] = useState<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    if (isRecording) {
      const { initVoiceDetection } = useVoiceDetection((speaking) => {
        setIsSpeaking(speaking);
      });
      
      // Handle the promise properly
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
    }

    // Cleanup function
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
        isRecording && isSpeaking ? [
          "after:content-[''] after:absolute after:inset-[-8px]",
          "after:bg-orb-gradient after:opacity-40 after:rounded-full",
          "after:animate-[pulse-ring_1.2s_ease-out_infinite]",
          "before:content-[''] before:absolute before:inset-[-16px]",
          "before:bg-orb-gradient before:opacity-30 before:rounded-full",
          "before:animate-[pulse-ring_1.6s_ease-out_infinite]",
          "[&>div:nth-child(1)]:content-[''] [&>div:nth-child(1)]:absolute [&>div:nth-child(1)]:inset-[-24px]",
          "[&>div:nth-child(1)]:bg-orb-gradient [&>div:nth-child(1)]:opacity-20 [&>div:nth-child(1)]:rounded-full",
          "[&>div:nth-child(1)]:animate-[pulse-ring_2s_ease-out_infinite]",
          "[&>div:nth-child(2)]:content-[''] [&>div:nth-child(2)]:absolute [&>div:nth-child(2)]:inset-[-32px]",
          "[&>div:nth-child(2)]:bg-orb-gradient [&>div:nth-child(2)]:opacity-10 [&>div:nth-child(2)]:rounded-full",
          "[&>div:nth-child(2)]:animate-[pulse-ring_2.4s_ease-out_infinite]",
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
