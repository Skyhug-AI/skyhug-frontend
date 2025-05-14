
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TherapistCardProps {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  avatarSrc: string;
  bgColor: string;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const TherapistSelectionCard: React.FC<TherapistCardProps> = ({ 
  id, 
  name, 
  description, 
  specialties, 
  avatarSrc, 
  bgColor, 
  onClick,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <Card 
      className="overflow-hidden flex flex-col p-5 h-full w-full rounded-xl bg-white hover:scale-[1.03] hover:shadow-lg transition-all duration-300 cursor-pointer relative"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4 mb-3">
        <div className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center`}>
          <Avatar className="w-14 h-14 border-2 border-white">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-0.5">{name}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        
        <button 
          className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-400'} hover:text-pink-500`} />
        </button>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center mb-2">
          <h4 className="text-xs text-gray-500 font-medium">SPECIALTIES</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 ml-1 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Click on a specialty to filter by it</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {specialties.map((specialty, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`${bgColor} bg-opacity-15 text-xs cursor-pointer hover:bg-opacity-30 transition-colors`}
            >
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TherapistSelectionCard;
