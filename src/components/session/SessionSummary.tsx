
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Heart, Home, BookText, Clock, Sun, Cloud, Moon, Coffee, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Types for the data
interface SessionSummaryProps {
  summary?: {
    points: Array<{
      id: string;
      time: string;
      text: string;
    }>;
    emotions: Array<{
      id: string;
      name: string;
    }>;
    suggestions: string[];
  };
  onClose: () => void;
}

// Mock data for demonstration
const mockSummary = {
  points: [
    { id: '1', time: '00:52', text: 'Discussed feeling overwhelmed with work responsibilities' },
    { id: '2', time: '03:14', text: 'Explored strategies for better work-life balance' },
    { id: '3', time: '05:36', text: 'Identified sources of anxiety in daily routine' },
    { id: '4', time: '08:21', text: 'Discussed possible mindfulness exercises to try' },
    { id: '5', time: '10:42', text: 'Noted improvement in sleep patterns since last session' },
  ],
  emotions: [
    { id: '1', name: 'Anxious' },
    { id: '2', name: 'Hopeful' },
    { id: '3', name: 'Tired' },
    { id: '4', name: 'Reflective' },
  ],
  suggestions: [
    'Try the 5-minute breathing exercise we discussed before bedtime',
    'Consider journaling about work stressors to identify patterns',
    'Schedule short breaks during your workday to reset',
  ],
};

// Mood options with improved visuals
const moodOptions = [
  { value: 'terrible', emoji: '🫠', label: 'Terrible' },
  { value: 'bad', emoji: '😟', label: 'Bad' }, 
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'great', emoji: '😁', label: 'Great' },
];

// Emotion icons mapping
const emotionIcons: Record<string, string> = {
  'Anxious': '😟',
  'Hopeful': '🌈',
  'Tired': '😴',
  'Reflective': '🪞',
  'Happy': '😊',
  'Sad': '😢',
  'Angry': '😠',
  'Calm': '😌',
  'Confused': '😕',
  'Excited': '😃'
};

// Suggestion icons mapping
const suggestionIcons: Record<number, React.ReactNode> = {
  0: <Moon className="h-5 w-5 text-indigo-400" />,
  1: <BookText className="h-5 w-5 text-emerald-500" />,
  2: <Clock className="h-5 w-5 text-amber-500" />
};

const SessionSummary: React.FC<SessionSummaryProps> = ({ summary = mockSummary, onClose }) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { toast } = useToast();

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalEntry(e.target.value);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleScheduleNext = () => {
    toast({
      title: "Session scheduled",
      description: "Your next session has been scheduled for tomorrow at 3:00 PM",
      duration: 3000,
    });
    // Navigate to home or scheduling page
    onClose();
  };

  const handleGoHome = () => {
    onClose();
  };

  const handleSaveJournal = () => {
    if (journalEntry.trim()) {
      toast({
        title: "Journal saved",
        description: "Your reflection has been saved to your journal",
        duration: 3000,
      });
    }
  };

  // Helper function to determine the icon for each summary point
  const getSummaryIcon = (text: string, id: number) => {
    if (text.toLowerCase().includes('mindful') || text.toLowerCase().includes('meditat')) {
      return <Coffee className="h-4 w-4 text-purple-500" />;
    } else if (text.toLowerCase().includes('sleep')) {
      return <Moon className="h-4 w-4 text-blue-400" />;
    } else if (text.toLowerCase().includes('work')) {
      return <BookText className="h-4 w-4 text-amber-500" />;
    } else {
      // Alternate between icons for other points
      const icons = [
        <Heart className="h-4 w-4 text-rose-400" />,
        <CheckCircle2 className="h-4 w-4 text-green-500" />,
        <Cloud className="h-4 w-4 text-sky-400" />
      ];
      return icons[id % icons.length];
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center font-['Poppins',sans-serif]">
      <Card className="w-full max-w-3xl shadow-lg border-skyhug-200 animate-fade-in rounded-2xl bg-white/90 backdrop-blur">
        <CardHeader className="pb-4 border-b border-skyhug-100 space-y-3">
          <CardTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Sun className="h-8 w-8 text-amber-400 animate-pulse-slow" /> 
            Here's what we talked about today
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-muted-foreground text-lg">
            <Clock className="h-5 w-5" /> Session completed on {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 space-y-8">
          <div className="space-y-8">
            {/* AI-Generated Summary */}
            <div>
              <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                <BookText className="h-6 w-6 text-skyhug-500" /> 
                Session Summary
              </h3>
              <ScrollArea className="h-48 rounded-xl border-0 shadow-inner bg-serenity-50 p-4">
                <ul className="space-y-4">
                  {summary.points.map((point, index) => (
                    <li key={point.id} className="flex gap-3 items-start p-2 transition-all hover:bg-white/50 rounded-lg">
                      <div className="bg-white rounded-full p-1.5 shadow-sm flex-shrink-0">
                        {getSummaryIcon(point.text, index)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="text-xs bg-skyhug-100 text-skyhug-700 px-2 py-1 rounded-full font-mono">
                            {point.time}
                          </span>
                        </div>
                        <p className="text-sm">{point.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            
            {/* Emotions */}
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-3">Key emotions detected:</h3>
              <div className="flex flex-wrap gap-3">
                {summary.emotions.map((emotion) => (
                  <Badge 
                    key={emotion.id} 
                    variant="secondary" 
                    className="bg-serenity-100 hover:bg-serenity-200 transition-all px-3 py-1.5 text-base flex items-center gap-1.5 animate-pulse-gentle"
                  >
                    <span>{emotionIcons[emotion.name] || '😊'}</span> {emotion.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Suggested next steps */}
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-3">Suggested next steps:</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {summary.suggestions.map((suggestion, i) => (
                  <Card key={i} className="bg-white shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {suggestionIcons[i]}
                        </div>
                        <div>
                          <p className="text-sm text-slate-700">{suggestion}</p>
                          <Button variant="outline" size="sm" className="mt-3">
                            Add to Plan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Journal Prompt */}
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <BookText className="h-5 w-5 text-emerald-500" />
                Would you like to reflect on today's session?
              </h3>
              <div className="bg-white/80 rounded-xl border p-5 shadow-sm">
                <Textarea 
                  placeholder="Let it out... what did you learn or feel today?"
                  className="min-h-[120px] resize-none bg-white/70 border-serenity-100 focus-visible:ring-serenity-300"
                  value={journalEntry}
                  onChange={handleJournalChange}
                />
                <div className="flex justify-end mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveJournal}
                    disabled={!journalEntry.trim()}
                    className="flex items-center gap-1.5 hover:bg-serenity-100"
                  >
                    <BookText className="h-4 w-4" />
                    Save to Journal
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Mood Selection */}
            <div className="pt-4">
              <h3 className="text-xl font-medium mb-4">How are you feeling after this session?</h3>
              <div className="flex justify-between items-center bg-white/80 rounded-xl px-6 py-4 shadow-sm">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`flex flex-col items-center transition-all ${
                      selectedMood === mood.value 
                        ? 'transform scale-110 text-skyhug-600' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-4xl mb-2 transition-transform hover:animate-pulse-gentle">{mood.emoji}</span>
                    <span className={`text-sm font-medium ${selectedMood === mood.value ? 'text-skyhug-600' : ''}`}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 border-t mt-6 pb-6">
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="gap-2 hover:bg-serenity-100 px-5 rounded-full"
          >
            <Home className="h-4 w-4" /> Go Home
          </Button>
          <Button
            onClick={handleScheduleNext}
            className="bg-gradient-to-r from-skyhug-500 to-serenity-500 hover:from-skyhug-600 hover:to-serenity-600 gap-2 px-8 py-6 rounded-full transition-transform hover:scale-105"
          >
            <Calendar className="h-4 w-4" /> Schedule Next Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SessionSummary;
