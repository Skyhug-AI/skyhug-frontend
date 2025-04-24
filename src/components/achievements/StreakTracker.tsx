import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  isStreakBroken?: boolean;
}
const StreakTracker = ({
  currentStreak = 3,
  longestStreak = 7,
  isStreakBroken = false
}: StreakTrackerProps) => {
  const progress = currentStreak / 7 * 100; // 7 days is the milestone

  if (isStreakBroken) {
    return <Card className="bg-white/80 backdrop-blur-sm border-serenity-100">
        <CardContent className="pt-6 pb-8"> {/* Added pb-8 for bottom padding */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-amber-50 p-3 rounded-full">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Streak Break</h3>
              <p className="text-muted-foreground mb-4">
                Looks like you missed a day — and that's okay 💛
                <br />
                Showing up again today gives you a ✨ Resilience Boost!
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="bg-white">
                +5 Calm Points
              </Badge>
              <Button size="sm" variant="outline">
                Restart Streak
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="bg-white/80 backdrop-blur-sm border-serenity-100 mb-10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-orange-500" />
          Streak Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className=""> {/* Added pb-8 for bottom padding */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium mb-1">
              You've shown up {currentStreak} days in a row! 🌤️
            </p>
            <p className="text-sm text-muted-foreground">
              Your longest streak: {longestStreak} days
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Current Progress</span>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{currentStreak}/7 days</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center pt-2">
            💡 Tip: Even a 2-min check-in counts toward your streak.
          </p>
        </div>
      </CardContent>
    </Card>;
};
export default StreakTracker;