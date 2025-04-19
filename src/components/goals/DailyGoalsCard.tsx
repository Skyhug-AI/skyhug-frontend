
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
  path?: string;
  affirmation?: string;
}

const goalItems: DailyGoalItem[] = [{
  action: "Completing a session",
  points: 50,
  icon: <HeadphonesIcon className="h-5 w-5 text-serenity-500" />,
  path: '/session',
  affirmation: "Taking a moment to listen = caring for your mind"
}, {
  action: "Logging a reflection",
  points: 30,
  icon: <PenLine className="h-5 w-5 text-violet-500" />,
  path: '/journal',
  affirmation: "Reflections help untangle emotions"
}, {
  action: "Mood check-in",
  points: 10,
  icon: <Smile className="h-5 w-5 text-amber-500" />,
  affirmation: "Checking in helps you grow"
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

  return (
    <Card className="mb-8 rounded-3xl border-none bg-gradient-to-br from-white to-orb-fog/30 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-nunito">
            <div className="p-2 bg-gradient-to-br from-skyhug-100 to-skyhug-200 rounded-full">
              <Brain className="h-5 w-5 text-skyhug-500 animate-pulse-gentle" />
            </div>
            <span className="font-semibold text-gray-700">Today's Goals</span>
          </CardTitle>
          <span className="text-sm font-medium bg-gradient-to-r from-skyhug-400 to-serenity-500 bg-clip-text text-transparent font-nunito">
            {currentPoints}/{targetPoints} Calm Points
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2 font-nunito">
              <span>Daily Goal: 1 Reflection or Voice Session</span>
              <span className="text-skyhug-500 font-medium">20%</span>
            </div>
            <Progress 
              value={20} 
              className="h-2.5 bg-gray-100" 
              indicatorClassName="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] animate-pulse-slow" 
            />
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold mb-3 text-gray-700 font-nunito">Earn Calm Points for:</h4>
            <ul className="space-y-3">
              {goalItems.map((item, index) => (
                <li 
                  key={index} 
                  onClick={() => handleItemClick(item)} 
                  className={`flex flex-col gap-2 p-4 rounded-xl transition-all group
                    ${item.path ? 'cursor-pointer hover:bg-white hover:shadow-md' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-orb-fog to-white rounded-full shadow-sm group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className="flex-1 font-medium text-sm text-gray-700 font-nunito">{item.action}</span>
                    <Badge className="font-medium bg-gradient-to-r from-serenity-400 to-serenity-500 hover:from-serenity-500 hover:to-serenity-600 px-3 py-1.5 shadow-sm group-hover:scale-105 transition-transform">
                      +{item.points}
                    </Badge>
                  </div>
                  {item.affirmation && (
                    <p className="text-xs text-muted-foreground pl-12 font-nunito">{item.affirmation}</p>
                  )}
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
