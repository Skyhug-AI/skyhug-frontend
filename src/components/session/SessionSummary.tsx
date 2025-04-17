import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Heart, Home, BookText, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

// Mood options
const moodOptions = [
  { value: 'terrible', emoji: '😥', label: 'Terrible' },
  { value: 'bad', emoji: '😟', label: 'Bad' }, 
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'great', emoji: '😁', label: 'Great' },
];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-serenity-50 to-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg border-skyhug-200 animate-fade-in">
        <CardHeader className="pb-4 wavy-border">
          <CardTitle className="text-2xl font-semibold text-skyhug-800">
            Here's what we talked about today
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" /> Session completed on {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* AI-Generated Summary */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <BookText className="h-5 w-5 text-skyhug-500" /> 
                Summary
              </h3>
              <ScrollArea className="h-40 rounded-md border p-4">
                <ul className="space-y-3">
                  {summary.points.map((point) => (
                    <li key={point.id} className="flex gap-2">
                      <span className="text-xs bg-skyhug-100 text-skyhug-700 px-1.5 py-0.5 rounded font-mono">
                        {point.time}
                      </span>
                      <p className="text-sm flex-1">{point.text}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            
            {/* Emotions */}
            <div>
              <h3 className="text-sm font-medium mb-2">Key emotions detected:</h3>
              <div className="flex flex-wrap gap-2">
                {summary.emotions.map((emotion) => (
                  <Badge key={emotion.id} variant="secondary" className="bg-cloud-100">
                    {emotion.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Suggested next steps */}
            <div>
              <h3 className="text-sm font-medium mb-2">Suggested next steps:</h3>
              <ul className="list-disc list-inside space-y-1.5 pl-1 text-sm">
                {summary.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-muted-foreground">{suggestion}</li>
                ))}
              </ul>
            </div>
            
            {/* Journal Prompt */}
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-3">Would you like to reflect on today's session?</h3>
              <Textarea 
                placeholder="Write your thoughts here..." 
                className="min-h-[120px] resize-none"
                value={journalEntry}
                onChange={handleJournalChange}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveJournal}
                  disabled={!journalEntry.trim()}
                >
                  Save to Journal
                </Button>
              </div>
            </div>
            
            {/* Mood Selection */}
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-3">How are you feeling after this session?</h3>
              <div className="flex justify-between items-center px-4 py-2">
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
                    <span className="text-3xl mb-1">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="gap-2"
          >
            <Home className="h-4 w-4" /> Go Home
          </Button>
          <Button
            onClick={handleScheduleNext}
            className="bg-skyhug-500 hover:bg-skyhug-600 gap-2"
          >
            <Calendar className="h-4 w-4" /> Schedule Next Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SessionSummary;
