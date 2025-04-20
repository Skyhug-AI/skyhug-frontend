
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
        "relative w-16 h-16 rounded-full overflow-hidden transition-all duration-500",
        "bg-orb-gradient shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        isRecording && isSpeaking ? [
          "animate-[morphing_2s_ease-in-out_infinite]",
          "after:content-[''] after:absolute after:inset-0",
          "after:bg-orb-gradient after:opacity-50",
          "after:animate-[pulse_1s_ease-in-out_infinite]",
          "before:content-[''] before:absolute before:inset-[-2px]",
          "before:bg-orb-gradient before:opacity-30",
          "before:animate-[pulse_1.5s_ease-in-out_infinite]",
          "shadow-lg shadow-orb-periwinkle/50",
          "scale-110",
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
    />
  );
};

export default PulsatingMicButton;
