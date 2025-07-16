import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface MoodSliderProps {
  onMoodChange?: (mood: number) => void;
  className?: string;
}

const MoodSlider: React.FC<MoodSliderProps> = ({ onMoodChange, className }) => {
  const [mood, setMood] = useState([50]);

  const handleMoodChange = (value: number[]) => {
    setMood(value);
    onMoodChange?.(value[0]);
  };

  const getMoodLabel = (value: number) => {
    if (value < 20) return "Very Low";
    if (value < 40) return "Low"; 
    if (value < 60) return "Neutral";
    if (value < 80) return "Good";
    return "Excellent";
  };

  return (
    <div className={cn("w-full max-w-md p-4 rounded-lg bg-background border", className)}>
      <div className="mb-3">
        <h3 className="text-sm font-medium text-foreground mb-1">MOOD</h3>
        <p className="text-xs text-muted-foreground">
          Current: {getMoodLabel(mood[0])} ({mood[0]}/100)
        </p>
      </div>
      <div className="px-2">
        <Slider
          value={mood}
          onValueChange={handleMoodChange}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default MoodSlider;