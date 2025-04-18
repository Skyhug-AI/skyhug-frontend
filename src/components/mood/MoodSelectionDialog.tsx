
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MoodSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoodSelect: () => void;
}

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😫', label: 'Stressed' },
];

const MoodSelectionDialog = ({ open, onOpenChange, onMoodSelect }: MoodSelectionDialogProps) => {
  const handleMoodSelect = (mood: { emoji: string; label: string }) => {
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
          <DialogTitle>How are you feeling?</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-4 py-6">
          {moods.map((mood) => (
            <Button
              key={mood.label}
              variant="outline"
              className="text-2xl h-12 w-12 p-0 hover:bg-skyhug-50"
              onClick={() => handleMoodSelect(mood)}
            >
              {mood.emoji}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodSelectionDialog;
