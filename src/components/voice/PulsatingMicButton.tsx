
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

  useEffect(() => {
    if (isRecording) {
      const { initVoiceDetection } = useVoiceDetection((speaking) => {
        setIsSpeaking(speaking);
      });
      
      const cleanup = initVoiceDetection();
      return () => {
        cleanup?.();
      };
    } else {
      setIsSpeaking(false);
    }
  }, [isRecording]);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-16 h-16 rounded-full overflow-hidden transition-all duration-500",
        "bg-orb-gradient shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        isRecording && isSpeaking ? [
          "animate-soft-pulse",
          "shadow-lg shadow-orb-periwinkle/30",
        ] : isRecording ? [
          "shadow-md shadow-orb-periwinkle/20",
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
