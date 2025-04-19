import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, HeadphonesIcon, PenLine, Smile } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface DailyGoalItem {
  action: string;
  points: number;
  icon: React.ReactNode;
  path?: string; // Optional path to navigate to
}

const goalItems: DailyGoalItem[] = [{
  action: "Completing a session",
  points: 50,
  icon: <HeadphonesIcon className="h-5 w-5 text-serenity-500 animate-pulse-gentle" />,
  path: '/session'
}, {
  action: "Logging a reflection",
  points: 30,
  icon: <PenLine className="h-5 w-5 text-violet-500" />,
  path: '/journal'
}, {
  action: "Mood check-in",
  points: 10,
  icon: <Smile className="h-5 w-5 text-amber-500" />
}];

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

  return <Card className="mb-8 rounded-xl border border-orb-fog/50 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-skyhug-500 animate-pulse-slow" />
            <span className="font-medium">Today's Goals</span>
          </CardTitle>
          <span className="text-sm font-medium bg-gradient-to-r from-skyhug-400 to-serenity-500 bg-clip-text text-transparent">
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
            <Progress value={20} className="h-2" indicatorClassName="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]" />
          </div>
          
          <div className="bg-orb-fog/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Earn Calm Points for:</h4>
            <ul className="space-y-1">
              {goalItems.map((item, index) => <li key={index} onClick={() => handleItemClick(item)} className={`flex items-center gap-3 p-3 rounded-md transition-all
                    ${item.path ? 'cursor-pointer hover:bg-white/70 hover:shadow-sm' : ''}`}>
                  <div className="p-1.5 bg-white rounded-full shadow-sm">
                    {item.icon}
                  </div>
                  <span className="flex-1 font-medium text-sm">{item.action}</span>
                  <Badge className="font-medium bg-gradient-to-r from-serenity-400 to-serenity-500 hover:from-serenity-500 hover:to-serenity-600 px-3 py-1.5">
                    +{item.points}
                  </Badge>
                </li>)}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>;
};

export default DailyGoalsCard;
