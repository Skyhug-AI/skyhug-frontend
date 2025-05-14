
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { useTherapist } from '@/context/TherapistContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface TherapistCardProps {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  avatarSrc: string;
  bgColor: string;
  onClick: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ 
  id, 
  name, 
  description, 
  specialties, 
  avatarSrc, 
  bgColor, 
  onClick 
}) => {
  return (
    <Card 
      className="overflow-hidden flex flex-col items-center p-6 h-[280px] w-[220px] rounded-2xl bg-white hover:scale-[1.03] hover:shadow-lg transition-all duration-300 cursor-pointer relative group"
      onClick={onClick}
    >
      <div className={`${bgColor} w-32 h-32 rounded-full flex items-center justify-center mb-4`}>
        <Avatar className="w-28 h-28 border-4 border-white">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </div>
      
      <CardContent className="text-center p-0 w-full">
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-3">{description}</p>
        
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className={`${bgColor} bg-opacity-15 text-xs`}>
              {specialty}
            </Badge>
          ))}
        </div>
        
        <button className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-gray-400 hover:text-pink-500" />
        </button>
      </CardContent>
    </Card>
  );
};

const TherapistSelectionPage = () => {
  const navigate = useNavigate();
  const { setCurrentTherapist } = useTherapist();
  
  // Filter states
  const [identityFilter, setIdentityFilter] = useState<string>("");
  const [topicsFilter, setTopicsFilter] = useState<string>("");
  const [styleFilter, setStyleFilter] = useState<string>("");
  
  const therapists = [
    {
      id: 'olivia',
      name: 'Olivia',
      description: 'Supportive and empathetic',
      specialties: ['Anxiety', 'Depression'],
      avatarSrc: '/therapists/olivia.svg',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'logan',
      name: 'Logan',
      description: 'Friendly and motivating',
      specialties: ['Productivity', 'Stress'],
      avatarSrc: '/therapists/logan.svg',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'sarah',
      name: 'Sarah',
      description: 'Calm and non-judgmental',
      specialties: ['Grief', 'Relationships'],
      avatarSrc: '/therapists/sarah.svg',
      bgColor: 'bg-green-100',
    },
    {
      id: 'james',
      name: 'James',
      description: 'Practical and goal-oriented',
      specialties: ['Career', 'Self-esteem'],
      avatarSrc: '/therapists/james.svg',
      bgColor: 'bg-orange-100',
    },
    {
      id: 'maya',
      name: 'Maya',
      description: 'Patient and reflective',
      specialties: ['Trauma', 'Mindfulness'],
      avatarSrc: '/therapists/maya.svg',
      bgColor: 'bg-yellow-100',
    }
  ];

  const handleTherapistSelect = (therapistId: string) => {
    // In a real app, you would set the selected therapist in context or state
    setCurrentTherapist(therapistId);
    
    toast({
      title: "Therapist selected",
      description: `You've chosen to speak with ${therapistId.charAt(0).toUpperCase() + therapistId.slice(1)}`,
    });
    
    // Navigate to the session page
    navigate('/session');
  };
  
  const handleMatchClick = () => {
    // In a real app, this would use an algorithm to match based on preferences
    const randomIndex = Math.floor(Math.random() * therapists.length);
    const randomTherapist = therapists[randomIndex];
    
    toast({
      title: "We found a match for you!",
      description: `${randomTherapist.name} might be a good fit based on your needs`,
    });
    
    // Optional: auto-select the therapist
    // handleTherapistSelect(randomTherapist.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-5xl w-full text-center mb-10 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gray-800">Select a Therapist</h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-10">Choose an AI therapist to talk to</p>
          
          {/* Match button - centered above filters */}
          <div className="flex justify-center mb-8">
            <Button 
              variant="outline" 
              className="border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={handleMatchClick}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 text-xs">?</div>
              Let us match you
            </Button>
          </div>
          
          {/* Filter dropdowns */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Select value={identityFilter} onValueChange={setIdentityFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Identity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="nonbinary">Non-binary</SelectItem>
                <SelectItem value="lgbtq">LGBTQ+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={topicsFilter} onValueChange={setTopicsFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anxiety">Anxiety</SelectItem>
                <SelectItem value="depression">Depression</SelectItem>
                <SelectItem value="relationships">Relationships</SelectItem>
                <SelectItem value="stress">Stress Management</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="grief">Grief</SelectItem>
                <SelectItem value="trauma">Trauma</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Therapy Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supportive">Supportive</SelectItem>
                <SelectItem value="motivational">Motivational</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="reflective">Reflective</SelectItem>
                <SelectItem value="goal-oriented">Goal-oriented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl justify-items-center">
          {therapists.map((therapist, index) => (
            <div key={therapist.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <TherapistCard
                id={therapist.id}
                name={therapist.name}
                description={therapist.description}
                specialties={therapist.specialties}
                avatarSrc={therapist.avatarSrc}
                bgColor={therapist.bgColor}
                onClick={() => handleTherapistSelect(therapist.id)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TherapistSelectionPage;
