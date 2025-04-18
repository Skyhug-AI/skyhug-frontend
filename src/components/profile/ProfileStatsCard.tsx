
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Award, Flame, Sparkles, ChevronRight } from 'lucide-react';
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
            <div className="relative">
              <div 
                className="h-10 w-10 bg-gradient-to-br from-skyhug-100 to-skyhug-500 rounded-full flex items-center justify-center text-white font-medium text-lg shadow-lg relative"
                style={{
                  boxShadow: '0 0 0 4px rgba(185, 198, 255, 0.3)',
                }}
              >
                {user?.name?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-serenity-100 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-serenity-500">●</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500">🌱 Building momentum</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-skyhug-500" />
                <span className="text-sm font-medium">{calmPoints} Calm Points</span>
              </div>
              <Progress value={60} className="w-20 h-1.5" />
            </div>
            
            <div className="flex items-center justify-between gap-y-1">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">{currentStreak}-day streak</span>
              </div>
              <Progress 
                value={(currentStreak / 7) * 100} 
                className="w-24 h-1.5 bg-orange-100" 
              />
            </div>
            
            <div className="flex items-center justify-between gap-y-1">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">{badgesCount} badges earned</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3 text-amber-400" />
                <Award className="h-3 w-3 text-amber-400" />
              </div>
            </div>

            <div className="text-xs text-gray-600 pl-6">
              Latest: 🌙 {lastBadge}
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/profile')}
            className="w-full mt-2 border-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-50 gap-1"
          >
            View Full Profile
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatsCard;
