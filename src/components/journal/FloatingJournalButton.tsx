
import React, { useState } from 'react';
import { BookText, Cloud, Sun, Repeat, Brain, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const prompts = [
  { icon: <Cloud className="w-4 h-4" />, text: "What felt heavy today?", emoji: "🌥️" },
  { icon: <Sun className="w-4 h-4" />, text: "What made you smile?", emoji: "🌞" },
  { icon: <Repeat className="w-4 h-4" />, text: "What's a pattern you're noticing in yourself?", emoji: "🔄" },
  { icon: <Brain className="w-4 h-4" />, text: "What thought do you want to let go of?", emoji: "🧠" },
  { icon: <Target className="w-4 h-4" />, text: "What's one thing you're proud of?", emoji: "🎯" },
];

const moods = [
  { emoji: "😔", label: "Sad" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "🙂", label: "Content" },
  { emoji: "😄", label: "Happy" },
  { emoji: "🌟", label: "Excited" }
];

const FloatingJournalButton = () => {
  const { toast } = useToast();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [moodTag, setMoodTag] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  const handlePromptSelect = (promptText: string) => {
    setSelectedPrompt(promptText);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSaveEntry = () => {
    setShowEncouragement(true);
    
    // Show points animation
    toast({
      title: "+30 Calm Points",
      description: "That was brave. Every word you write is part of your healing.",
      className: "animate-fade-in-up",
    });

    // Delay modal close
    setTimeout(() => {
      setIsOpen(false);
      setShowEncouragement(false);
      setSelectedPrompt("");
      setSelectedMood("");
      setMoodTag("");
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed right-6 top-20 z-50 h-12 w-12 rounded-full shadow-lg bg-white hover:bg-skyhug-50 border-skyhug-200"
        >
          <BookText className="h-6 w-6 text-skyhug-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Not sure what to write? Try one of these prompts:</p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <Button
                  key={prompt.text}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1.5 ${
                    selectedPrompt === prompt.text ? 'bg-skyhug-50 border-skyhug-200' : ''
                  }`}
                  onClick={() => handlePromptSelect(prompt.text)}
                >
                  {prompt.icon}
                  <span className="mr-1">{prompt.emoji}</span>
                  {prompt.text}
                </Button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder={selectedPrompt || "Write your thoughts here..."}
            className="min-h-[200px] resize-none"
          />
          
          <div className="space-y-3">
            <p className="text-sm font-medium">What emotion best describes this entry?</p>
            <div className="flex gap-2 flex-wrap">
              {moods.map((mood) => (
                <Button
                  key={mood.emoji}
                  variant="outline"
                  size="sm"
                  className={`text-lg ${
                    selectedMood === mood.emoji ? 'bg-skyhug-50 border-skyhug-200' : ''
                  }`}
                  onClick={() => handleMoodSelect(mood.emoji)}
                >
                  {mood.emoji}
                </Button>
              ))}
            </div>
            
            <div className="pt-2">
              <input
                type="text"
                placeholder="Add a mood tag (e.g., overwhelm, connection)"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={moodTag}
                onChange={(e) => setMoodTag(e.target.value)}
              />
            </div>
          </div>

          {showEncouragement ? (
            <div className="text-center space-y-4 animate-fade-in py-4">
              <Badge variant="secondary" className="animate-scale-in">
                +30 Calm Points
              </Badge>
              <p className="text-skyhug-600 font-medium">
                That was brave. Every word you write is part of your healing.
              </p>
            </div>
          ) : (
            <Button onClick={handleSaveEntry} className="w-full">Save Entry</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FloatingJournalButton;
