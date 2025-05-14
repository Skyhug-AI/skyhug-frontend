
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

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
      className="overflow-hidden p-4 h-full w-full rounded-xl bg-white hover:shadow-md transition-all duration-300 cursor-pointer relative border border-gray-200"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`${bgColor} w-12 h-12 rounded-full flex items-center justify-center`}>
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        
        <button 
          className="p-1.5 rounded-full ml-auto bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-400'} hover:text-pink-500`} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {specialties.map((specialty, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full"
          >
            {specialty}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default TherapistSelectionCard;
