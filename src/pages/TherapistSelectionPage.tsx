
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Info } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { useTherapist } from '@/context/TherapistContext';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

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

// Define filter types
type IdentityFilter = 'All' | 'Male' | 'Female' | 'Non-binary' | 'LGBTQ+';
type StyleFilter = 'All' | 'Supportive' | 'Motivational' | 'Direct' | 'Reflective';
type TopicFilter = 'All' | 'Anxiety' | 'Depression' | 'Trauma' | 'Career' | 'Mindfulness' | 'Relationships' | 'Productivity' | 'Stress' | 'Grief' | 'Self-esteem';

const TherapistCard: React.FC<TherapistCardProps> = ({ 
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
            <Badge key={index} variant="outline" className={`${bgColor} bg-opacity-15 text-xs cursor-pointer hover:bg-opacity-30 transition-colors`}>
              {specialty}
            </Badge>
          ))}
        </div>
        
        <button 
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-400'} hover:text-pink-500`} />
        </button>
      </CardContent>
    </Card>
  );
};

const TherapistSelectionPage = () => {
  const navigate = useNavigate();
  const { setCurrentTherapist } = useTherapist();
  const isMobile = useIsMobile();
  
  // State for filters
  const [identityFilter, setIdentityFilter] = useState<IdentityFilter>('All');
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('All');
  const [topicFilter, setTopicFilter] = useState<TopicFilter>('All');
  const [showFilters, setShowFilters] = useState(!isMobile);
  
  // State for favorites
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const therapists = [
    {
      id: 'olivia',
      name: 'Olivia',
      description: 'Supportive and empathetic',
      specialties: ['Anxiety', 'Depression'],
      avatarSrc: '/therapists/olivia.svg',
      bgColor: 'bg-purple-100',
      gender: 'Female',
      style: 'Supportive',
    },
    {
      id: 'logan',
      name: 'Logan',
      description: 'Friendly and motivating',
      specialties: ['Productivity', 'Stress'],
      avatarSrc: '/therapists/logan.svg',
      bgColor: 'bg-blue-100',
      gender: 'Male',
      style: 'Motivational',
    },
    {
      id: 'sarah',
      name: 'Sarah',
      description: 'Calm and non-judgmental',
      specialties: ['Grief', 'Relationships'],
      avatarSrc: '/therapists/sarah.svg',
      bgColor: 'bg-green-100',
      gender: 'Female',
      style: 'Reflective',
    },
    {
      id: 'james',
      name: 'James',
      description: 'Practical and goal-oriented',
      specialties: ['Career', 'Self-esteem'],
      avatarSrc: '/therapists/james.svg',
      bgColor: 'bg-orange-100',
      gender: 'Male',
      style: 'Direct',
    },
    {
      id: 'maya',
      name: 'Maya',
      description: 'Patient and reflective',
      specialties: ['Trauma', 'Mindfulness'],
      avatarSrc: '/therapists/maya.svg',
      bgColor: 'bg-yellow-100',
      gender: 'Female',
      style: 'Reflective',
    }
  ];

  const handleTherapistSelect = (therapistId: string) => {
    setCurrentTherapist(therapistId);
    
    toast({
      title: "Therapist selected",
      description: `You've chosen to speak with ${therapistId.charAt(0).toUpperCase() + therapistId.slice(1)}`,
    });
    
    navigate('/session');
  };
  
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    
    const isNowFavorite = !favorites.includes(id);
    toast({
      title: isNowFavorite ? "Added to favorites" : "Removed from favorites",
      description: isNowFavorite ? `${id.charAt(0).toUpperCase() + id.slice(1)} has been added to your favorites` : `${id.charAt(0).toUpperCase() + id.slice(1)} has been removed from your favorites`,
    });
  };
  
  const handleFilterBySpecialty = (specialty: string) => {
    setTopicFilter(specialty as TopicFilter);
  };
  
  const resetFilters = () => {
    setIdentityFilter('All');
    setStyleFilter('All');
    setTopicFilter('All');
  };
  
  const handleQuickMatch = () => {
    // Simple algorithm to pick a therapist based on random selection for now
    const randomIndex = Math.floor(Math.random() * filteredTherapists.length);
    const matchedTherapist = filteredTherapists[randomIndex];
    
    toast({
      title: "We found a match!",
      description: `Based on your preferences, we recommend ${matchedTherapist.name}`,
    });
    
    setTimeout(() => {
      handleTherapistSelect(matchedTherapist.id);
    }, 1500);
  };
  
  // Filter therapists based on selected filters
  const filteredTherapists = therapists.filter(therapist => {
    const matchesIdentity = identityFilter === 'All' || 
      (identityFilter === 'LGBTQ+' ? true : therapist.gender === identityFilter);
    
    const matchesStyle = styleFilter === 'All' || therapist.style === styleFilter;
    
    const matchesTopic = topicFilter === 'All' || 
      therapist.specialties.some(specialty => specialty === topicFilter);
    
    return matchesIdentity && matchesStyle && matchesTopic;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-5xl w-full text-center mb-10 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gray-800">Select a Therapist</h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-6">Choose an AI therapist to talk to</p>
          
          {/* Therapist Info Tooltip */}
          <div className="flex justify-center mb-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full cursor-pointer">
                    <Info className="h-4 w-4 mr-1" />
                    <span>About AI Therapists</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>These are AI therapists designed to support different moods and needs. They provide personalized guidance while maintaining your privacy.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Filters - Collapsible on mobile */}
          <div className="mb-8">
            {isMobile && (
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            )}
            
            {showFilters && (
              <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-wrap justify-center gap-3'}`}>
                {/* Identity Filter */}
                <div className={`flex flex-wrap gap-2 ${isMobile ? '' : 'mr-4'}`}>
                  {['All', 'Female', 'Male', 'Non-binary', 'LGBTQ+'].map(filter => (
                    <Badge 
                      key={filter} 
                      variant={identityFilter === filter ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => setIdentityFilter(filter as IdentityFilter)}
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
                
                {/* Style Filter */}
                <div className={`flex flex-wrap gap-2 ${isMobile ? '' : 'mr-4'}`}>
                  {['All', 'Supportive', 'Motivational', 'Direct', 'Reflective'].map(filter => (
                    <Badge 
                      key={filter} 
                      variant={styleFilter === filter ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => setStyleFilter(filter as StyleFilter)}
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
                
                {/* Topic Filter */}
                <div className="flex flex-wrap gap-2">
                  {['All', 'Anxiety', 'Depression', 'Trauma', 'Career', 'Mindfulness', 'Relationships', 'Productivity', 'Stress', 'Grief', 'Self-esteem'].map(filter => (
                    <Badge 
                      key={filter} 
                      variant={topicFilter === filter ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => setTopicFilter(filter as TopicFilter)}
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
                
                {/* Reset */}
                <Button variant="ghost" className="mt-2" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Help Me Choose Button */}
          <Button 
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all mb-8"
            onClick={handleQuickMatch}
          >
            Not sure who to pick? Let us match you
          </Button>
        </div>
        
        {filteredTherapists.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-gray-600">No therapists match your current filters</h3>
            <Button variant="link" onClick={resetFilters}>Reset all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl justify-items-center">
            {filteredTherapists.map((therapist, index) => (
              <div key={therapist.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <TherapistCard
                  id={therapist.id}
                  name={therapist.name}
                  description={therapist.description}
                  specialties={therapist.specialties}
                  avatarSrc={therapist.avatarSrc}
                  bgColor={therapist.bgColor}
                  onClick={() => handleTherapistSelect(therapist.id)}
                  isFavorite={favorites.includes(therapist.id)}
                  onToggleFavorite={(e) => handleToggleFavorite(therapist.id, e)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TherapistSelectionPage;
