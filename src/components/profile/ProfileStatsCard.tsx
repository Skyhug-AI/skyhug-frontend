
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ProfileStatsCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const calmPoints = 720;
  
  return (
    <Card className="glass-panel mb-6 border-0 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10 bg-skyhug-100">
            <AvatarFallback className="bg-skyhug-100 text-skyhug-500 text-sm">
              {user?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h3 className="font-medium text-gray-800">{user?.name || 'User'}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-skyhug-500" />
            <span className="font-medium text-skyhug-500">{calmPoints}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatsCard;
