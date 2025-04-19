
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Brain, PenLine, SmilePlus, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DailyGoalItem {
  action: string;
  points: number;
  icon: React.ReactNode;
  path?: string; // Optional path to navigate to
}

const goalItems: DailyGoalItem[] = [
  { 
    action: "Completing a session", 
    points: 50, 
    icon: <Check className="h-4 w-4 text-green-500" />,
    path: '/session'
  },
  { 
    action: "Logging a reflection", 
    points: 30, 
    icon: <PenLine className="h-4 w-4 text-violet-500" />,
    path: '/journal'
  },
  { 
    action: "Mood check-in", 
    points: 10, 
    icon: <SmilePlus className="h-4 w-4 text-amber-500" />
  },
  { 
    action: "Reading AI summary", 
    points: 10, 
    icon: <Sparkles className="h-4 w-4 text-sky-500" />
  },
];

const DailyGoalsCard = () => {
  const navigate = useNavigate();
  const currentPoints = 20;
  const targetPoints = 100;
  
  const handleItemClick = (item: DailyGoalItem) => {
    if (item.path) {
      navigate(item.path);
      toast({
        title: "Navigating...",
        description: `Taking you to ${item.action.toLowerCase()}`
      });
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-skyhug-500" />
            Today's Goals
          </CardTitle>
          <span className="text-sm font-medium text-skyhug-600">
            {currentPoints}/{targetPoints} Calm Points
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Daily Goal: 1 Reflection or Voice Session</span>
              <span className="text-skyhug-500 font-medium">20%</span>
            </div>
            <Progress value={20} className="h-2" />
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Earn Calm Points for:</h4>
            <ul className="space-y-3">
              {goalItems.map((item, index) => (
                <li 
                  key={index} 
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center gap-3 text-sm p-2 rounded-md transition-colors
                    ${item.path ? 'cursor-pointer hover:bg-skyhug-50 hover:text-skyhug-700' : ''}`}
                >
                  {item.icon}
                  <span className="flex-1">{item.action}</span>
                  <span className="font-medium text-skyhug-500">+{item.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalsCard;
