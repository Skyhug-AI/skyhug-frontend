
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MoodSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoodSelect: () => void;
}

const moods = [
  { emoji: '😄', label: 'Happy', value: 5 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😔', label: 'Sad', value: 2 },
  { emoji: '😫', label: 'Stressed', value: 1 },
];

const MoodSelectionDialog = ({ open, onOpenChange, onMoodSelect }: MoodSelectionDialogProps) => {
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(null);

  const handleMoodSelect = (index: number) => {
    setSelectedMoodIndex(index);
    const mood = moods[index];
    
    toast({
      title: "Mood logged successfully!",
      description: `You're feeling ${mood.label.toLowerCase()} ${mood.emoji}`,
    });
    
    onMoodSelect();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">How are you feeling today?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          <div className="flex justify-center gap-4 mb-6">
            {moods.map((mood, index) => (
              <Button
                key={mood.label}
                variant="outline"
                className={`text-3xl h-16 w-16 p-0 transition-all ${
                  selectedMoodIndex === index ? 'bg-skyhug-50 border-skyhug-300 scale-110' : ''
                }`}
                onClick={() => handleMoodSelect(index)}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 text-sm text-gray-500">
            {moods.map((mood) => (
              <div key={`label-${mood.label}`} className="w-16 text-center">
                {mood.label}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodSelectionDialog;
