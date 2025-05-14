
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface Therapist {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  avatarSrc: string;
  bgColor: string;
  gender: string;
  style: string;
}

interface TherapistProfileCardProps {
  therapist: Therapist;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const TherapistProfileCard: React.FC<TherapistProfileCardProps> = ({ 
  therapist, 
  isFavorite,
  onToggleFavorite 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start space-x-4 mb-4">
        <div className={`${therapist.bgColor} rounded-full p-2`}>
          <Avatar className="h-20 w-20">
            <AvatarImage src={therapist.avatarSrc} alt={therapist.name} />
            <AvatarFallback>{therapist.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{therapist.name}</h3>
          <p className="text-gray-600 mt-1">{therapist.description}</p>
          
          <button 
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {therapist.specialties.map((specialty, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="py-1.5 px-4 text-base"
          >
            {specialty}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TherapistProfileCard;
