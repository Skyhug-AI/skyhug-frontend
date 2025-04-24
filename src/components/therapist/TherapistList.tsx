
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar } from "lucide-react";
import { Therapist } from '@/pages/TherapistBrowsePage';

interface TherapistListProps {
  therapists: Therapist[];
  onBookSession: (therapist: Therapist) => void;
}

const TherapistList: React.FC<TherapistListProps> = ({ therapists, onBookSession }) => {
  return (
    <div className="space-y-4">
      {therapists.map((therapist) => (
        <Card key={therapist.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-16 w-16 md:h-24 md:w-24">
                  <AvatarImage src={therapist.avatar} alt={therapist.name} />
                  <AvatarFallback className="text-lg">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-grow space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{therapist.name}</h3>
                      <p className="text-muted-foreground">{therapist.title}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <Button 
                        className="whitespace-nowrap" 
                        onClick={() => onBookSession(therapist)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Session
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{therapist.rating}</span>
                    <span className="text-muted-foreground text-sm">
                      ({therapist.sessionsCompleted} sessions)
                    </span>
                    <span className="mx-2">•</span>
                    <span>{therapist.experience} years experience</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium">${therapist.price}/session</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="bg-skyhug-50 text-skyhug-700 hover:bg-skyhug-100 border-skyhug-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm line-clamp-2">{therapist.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    {therapist.availability.map((day) => (
                      <span key={day} className="font-medium">{day}</span>
                    ))}
                  </div>
                </div>
                
                <div className="md:hidden mt-3">
                  <Button 
                    className="w-full" 
                    onClick={() => onBookSession(therapist)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Session
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TherapistList;
