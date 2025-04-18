import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Headphones, MessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MoodSelectionDialog from '@/components/mood/MoodSelectionDialog';

interface Mission {
  id: string;
  title: string;
  points: number;
  icon: React.ReactNode;
  completed: boolean;
}

const DailyMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'mood',
      title: 'Tap to log a mood',
      points: 10,
      icon: <Brain className="h-5 w-5 text-skyhug-500" />,
      completed: false
    },
    {
      id: 'reflection',
      title: 'Do a 2-min reflection',
      points: 30,
      icon: <Headphones className="h-5 w-5 text-violet-500" />,
      completed: false
    },
    {
      id: 'journal',
      title: "Answer today's AI journal prompt",
      points: 50,
      icon: <MessageSquare className="h-5 w-5 text-rose-400" />,
      completed: false
    }
  ]);

  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const totalPoints = missions.reduce((acc, mission) => acc + mission.points, 0);
  const earnedPoints = missions.filter(mission => mission.completed).reduce((acc, mission) => acc + mission.points, 0);
  const progressPercentage = earnedPoints / totalPoints * 100;

  const handleMissionClick = (missionId: string) => {
    if (missionId === 'mood') {
      setMoodDialogOpen(true);
    }
  };

  const handleMoodSelect = () => {
    setMissions(missions.map(mission => 
      mission.id === 'mood' ? { ...mission, completed: true } : mission
    ));
  };

  return (
    <Card>
      <CardContent>
        {missions.map((mission) => (
          <div key={mission.id} onClick={() => handleMissionClick(mission.id)}>
            {mission.title}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyMissions;
