
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
        "bg-gradient-to-r from-blue-400 to-purple-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        isRecording && isSpeaking ? [
          "animate-soft-pulse",
          "shadow-lg shadow-blue-300/50",
          "ring-4 ring-blue-300/30 ring-opacity-60"
        ] : isRecording ? [
          "shadow-md shadow-blue-300/30",
          "ring-2 ring-blue-200/50"
        ] : [
          "hover:shadow-lg hover:scale-[1.02] transition-transform",
          "shadow-md shadow-blue-200/20",
        ],
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      <span className="flex items-center justify-center h-full text-white text-2xl">
        🎙️
      </span>
    </button>
  );
};

export default PulsatingMicButton;
