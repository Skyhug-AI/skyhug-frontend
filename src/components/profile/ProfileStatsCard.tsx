
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Award, Flame, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ProfileStatsCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const calmPoints = 720;
  const currentStreak = 3;
  const badgesCount = 6;
  const lastBadge = "First Night Session";
  
  return (
    <Card className="glass-panel mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-skyhug-100 rounded-full flex items-center justify-center text-skyhug-500 font-medium">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h3 className="font-medium">{user?.name || 'User'}</h3>
              <p className="text-sm text-muted-foreground">Building momentum</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-skyhug-500" />
                <span className="text-sm font-medium">{calmPoints} Calm Points</span>
              </div>
              <Progress value={60} className="w-20 h-1.5" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">{currentStreak}-day streak</span>
              </div>
              <div className="flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i < currentStreak ? 'bg-orange-500' : 'bg-orange-100'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">{badgesCount} badges earned</span>
              </div>
              <span className="text-xs text-muted-foreground">Latest: {lastBadge}</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => navigate('/profile')}
          >
            View Full Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatsCard;
