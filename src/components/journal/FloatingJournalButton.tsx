
import React, { useState } from 'react';
import { BookText, Cloud, Sun, Repeat, Brain, Target, FileText, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const prompts = [
  { icon: <Cloud className="w-4 h-4" />, text: "What felt heavy today?", emoji: "🌥️" },
  { icon: <Sun className="w-4 h-4" />, text: "What made you smile?", emoji: "🌞" },
  { icon: <Repeat className="w-4 h-4" />, text: "What's a pattern you're noticing in yourself?", emoji: "🔄" },
  { icon: <Brain className="w-4 h-4" />, text: "What thought do you want to let go of?", emoji: "🧠" },
  { icon: <Target className="w-4 h-4" />, text: "What's one thing you're proud of?", emoji: "🎯" },
];

const templates = [
  {
    title: "Gratitude Entry",
    icon: "🙏",
    text: "Today I am grateful for:\n1.\n2.\n3.\n\nOne small joy I experienced:"
  },
  {
    title: "Daily Reflection",
    icon: "✨",
    text: "Morning mood:\nTop priority today:\nHighlight of my day:\nWhat I learned:"
  },
  {
    title: "Stress Release",
    icon: "🌬️",
    text: "What's on my mind:\nWhat I can control:\nWhat I need to let go:\nOne small step I can take:"
  }
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
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [journalContent, setJournalContent] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [moodTag, setMoodTag] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  const handlePromptSelect = (promptText: string) => {
    setSelectedPrompt(promptText);
    setJournalContent("");
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setJournalContent(template);
    setSelectedPrompt("");
  };

  const handleSaveEntry = () => {
    setShowEncouragement(true);
    toast({
      title: "+30 Calm Points",
      description: "That was brave. Every word you write is part of your healing.",
      className: "animate-fade-in-up",
    });

    setTimeout(() => {
      setIsOpen(false);
      setShowEncouragement(false);
      setSelectedPrompt("");
      setSelectedMood("");
      setMoodTag("");
      setJournalContent("");
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
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-medium tracking-tight text-gray-900">Add Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-[1fr,1.5fr] gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Choose your writing style:</p>
                <Select onValueChange={(value) => handleTemplateSelect(templates.find(t => t.title === value)?.text || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.title} value={template.title}>
                        <span className="inline-flex items-center gap-2">
                          <span>{template.icon}</span>
                          <span>{template.title}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">Or choose a prompt:</p>
                {prompts.map((prompt) => (
                  <Button
                    key={prompt.text}
                    variant="outline"
                    className={`w-full justify-start text-left h-auto p-3 border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50 ${
                      selectedPrompt === prompt.text ? 'bg-gray-50/80 border-gray-300' : ''
                    }`}
                    onClick={() => handlePromptSelect(prompt.text)}
                  >
                    <span className="mr-2 text-lg">{prompt.emoji}</span>
                    <span className="text-sm font-normal">{prompt.text}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Start writing here..."
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                className="min-h-[300px] resize-none rounded-xl border-gray-200/80 focus:border-gray-300 focus:ring focus:ring-gray-200/50 text-base"
              />
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600">How are you feeling?</p>
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50/50 rounded-xl">
                  {moods.map((mood) => (
                    <button
                      key={mood.emoji}
                      onClick={() => setSelectedMood(mood.emoji)}
                      className={`flex flex-col items-center transition-all ${
                        selectedMood === mood.emoji 
                          ? 'transform scale-110 text-gray-900' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-xs font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showEncouragement ? (
            <div className="text-center space-y-3 animate-fade-in py-4">
              <Badge variant="secondary" className="animate-scale-in">
                +30 Calm Points
              </Badge>
              <p className="text-skyhug-600 font-medium">
                That was brave. Every word you write is part of your healing.
              </p>
            </div>
          ) : (
            <Button 
              onClick={handleSaveEntry} 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-2.5"
            >
              Save Entry
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FloatingJournalButton;
