
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
      completed: false,
    },
    {
      id: 'reflection',
      title: 'Do a 2-min reflection',
      points: 30,
      icon: <Headphones className="h-5 w-5 text-violet-500" />,
      completed: false,
    },
    {
      id: 'journal',
      title: "Answer today's AI journal prompt",
      points: 50,
      icon: <MessageSquare className="h-5 w-5 text-rose-400" />,
      completed: false,
    },
  ]);

  const [moodDialogOpen, setMoodDialogOpen] = useState(false);

  const totalPoints = missions.reduce((acc, mission) => acc + mission.points, 0);
  const earnedPoints = missions
    .filter(mission => mission.completed)
    .reduce((acc, mission) => acc + mission.points, 0);
  
  const progressPercentage = (earnedPoints / totalPoints) * 100;

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
    <Card className="glass-panel mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-skyhug-500" />
          Daily Clarity Boost
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Today's Progress</span>
              <span className="font-medium text-skyhug-500">{earnedPoints}/{totalPoints} pts</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="space-y-4">
            {missions.map((mission) => (
              <TooltipProvider key={mission.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all
                        ${mission.completed 
                          ? 'bg-skyhug-50 text-skyhug-700' 
                          : 'hover:bg-skyhug-50/50'
                        }`}
                      onClick={() => handleMissionClick(mission.id)}
                      disabled={mission.completed}
                    >
                      <div className={`p-2 rounded-full ${
                        mission.completed ? 'bg-skyhug-100' : 'bg-muted'
                      }`}>
                        {mission.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{mission.title}</div>
                      </div>
                      <div className="text-sm font-medium text-skyhug-500">
                        +{mission.points}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Earn {mission.points} clarity points</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
      
      <MoodSelectionDialog 
        open={moodDialogOpen}
        onOpenChange={setMoodDialogOpen}
        onMoodSelect={handleMoodSelect}
      />
    </Card>
  );
};

export default DailyMissions;
