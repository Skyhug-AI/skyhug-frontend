
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AchievementBadge from './AchievementBadge';
import { Award, Star, Calendar, TrendingUp, MessageSquare } from 'lucide-react';

const AchievementsCard = () => {
  const achievements = [
    { title: 'First Voice Session', icon: <Award className="h-4 w-4 text-amber-500" /> },
    { title: '5 Mood Logs', icon: <Star className="h-4 w-4 text-violet-500" /> },
    { title: '1 Week of Engagement', icon: <Calendar className="h-4 w-4 text-skyhug-500" /> },
    { title: 'Longest Streak', icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
    { title: 'First Insight Tag', icon: <MessageSquare className="h-4 w-4 text-rose-400" /> },
  ];
  
  return (
    <Card className="glass-panel mb-6">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Milestones on your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 bg-gradient-to-br from-skyhug-200 to-skyhug-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">3</span>
            </div>
            <div>
              <h3 className="text-lg font-medium">🧠 3 Days in a Row!</h3>
              <p className="text-sm text-muted-foreground">Keep the streak alive!</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {achievements.map((achievement, index) => (
              <AchievementBadge 
                key={index}
                title={achievement.title} 
                icon={achievement.icon} 
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;
