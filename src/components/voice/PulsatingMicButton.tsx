
import React from 'react';
import { Mic } from 'lucide-react';
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
        "before:absolute before:inset-0 before:z-0",
        "before:bg-gradient-to-r before:from-sky-400 before:via-sky-500 before:to-sky-600",
        isRecording ? [
          "before:animate-spin-slow hover:shadow-xl",
          "shadow-lg shadow-sky-500/20",
        ] : [
          "before:animate-pulse-gentle hover:shadow-lg",
          "shadow-md shadow-sky-500/10",
        ],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="absolute inset-0.5 bg-white rounded-full z-10">
        <div className={cn(
          "flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-sky-50 to-white",
          isRecording ? "animate-pulse" : "animate-none"
        )}>
          <Mic 
            className={cn(
              "w-6 h-6 transition-colors duration-200",
              isRecording ? "text-sky-600" : "text-sky-500"
            )} 
          />
        </div>
      </div>
    </button>
  );
};

export default PulsatingMicButton;
