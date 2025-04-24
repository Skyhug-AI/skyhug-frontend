
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar } from "lucide-react";
import { Therapist } from '@/pages/TherapistBrowsePage';

interface TherapistGridProps {
  therapists: Therapist[];
  onBookSession: (therapist: Therapist) => void;
}

const TherapistGrid: React.FC<TherapistGridProps> = ({ therapists, onBookSession }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {therapists.map((therapist) => (
        <Card key={therapist.id} className="overflow-hidden flex flex-col h-full">
          <CardHeader className="p-0">
            <div className="relative h-40 bg-skyhug-50">
              <div className="absolute -bottom-10 left-6">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage src={therapist.avatar} alt={therapist.name} />
                  <AvatarFallback className="text-lg">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-12 pb-4 space-y-4 flex-grow">
            <div>
              <h3 className="font-semibold text-lg">{therapist.name}</h3>
              <p className="text-muted-foreground text-sm">{therapist.title}</p>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{therapist.rating}</span>
              <span className="text-muted-foreground text-sm">
                ({therapist.sessionsCompleted} sessions)
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Specializes in:</p>
              <div className="flex flex-wrap gap-1">
                {therapist.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="bg-skyhug-50 text-skyhug-700 hover:bg-skyhug-100 border-skyhug-200">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <p className="text-sm line-clamp-3">{therapist.bio}</p>
          </CardContent>
          <CardFooter className="pt-2 pb-4 flex-col items-start gap-4">
            <div className="w-full text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Experience:</span>
                <span>{therapist.experience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per session:</span>
                <span className="font-medium">${therapist.price}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => onBookSession(therapist)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Session
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TherapistGrid;
