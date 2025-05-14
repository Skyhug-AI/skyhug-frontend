
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { useTherapist } from '@/context/TherapistContext';

interface TherapistCardProps {
  name: string;
  description: string;
  avatarSrc: string;
  bgColor: string;
  onClick: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ name, description, avatarSrc, bgColor, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden flex flex-col items-center p-6 cursor-pointer border border-gray-100 hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className={`w-36 h-36 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
        <Avatar className="w-32 h-32">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </div>
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

const TherapistSelectionPage = () => {
  const navigate = useNavigate();
  const { setCurrentTherapist } = useTherapist();
  
  const therapists = [
    {
      id: 'olivia',
      name: 'Olivia',
      description: 'Supportive and empathetic',
      avatarSrc: 'https://randomuser.me/api/portraits/women/44.jpg',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'logan',
      name: 'Logan',
      description: 'Friendly and motivating',
      avatarSrc: 'https://randomuser.me/api/portraits/men/32.jpg',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'sarah',
      name: 'Sarah',
      description: 'Calm and non-judgmental',
      avatarSrc: 'https://randomuser.me/api/portraits/women/68.jpg',
      bgColor: 'bg-orange-100',
    },
    {
      id: 'james',
      name: 'James',
      description: 'Practical and goal-oriented',
      avatarSrc: 'https://randomuser.me/api/portraits/men/46.jpg',
      bgColor: 'bg-yellow-100',
    },
    {
      id: 'maya',
      name: 'Maya',
      description: 'Patient and reflective',
      avatarSrc: 'https://randomuser.me/api/portraits/women/33.jpg',
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-5xl w-full text-center mb-10">
          <h1 className="text-5xl font-bold mb-4">Select a Therapist</h1>
          <p className="text-xl text-gray-600">Choose an AI therapist to talk to.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
          {therapists.slice(0, 3).map((therapist) => (
            <TherapistCard
              key={therapist.id}
              name={therapist.name}
              description={therapist.description}
              avatarSrc={therapist.avatarSrc}
              bgColor={therapist.bgColor}
              onClick={() => handleTherapistSelect(therapist.id)}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mt-8">
          {therapists.slice(3).map((therapist) => (
            <TherapistCard
              key={therapist.id}
              name={therapist.name}
              description={therapist.description}
              avatarSrc={therapist.avatarSrc}
              bgColor={therapist.bgColor}
              onClick={() => handleTherapistSelect(therapist.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default TherapistSelectionPage;
