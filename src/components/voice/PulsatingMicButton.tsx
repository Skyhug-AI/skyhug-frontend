
import React from 'react';
import { cn } from '@/lib/utils';

interface PulsatingMicButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const PulsatingMicButton = ({ isRecording, onClick, disabled }: PulsatingMicButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-16 h-16 rounded-full overflow-hidden transition-all duration-500",
        "bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600",
        isRecording ? [
          "animate-spin-slow hover:shadow-xl",
          "shadow-lg shadow-sky-500/20",
        ] : [
          "animate-pulse-gentle hover:shadow-lg",
          "shadow-md shadow-sky-500/10",
        ],
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    />
  );
};

export default PulsatingMicButton;
