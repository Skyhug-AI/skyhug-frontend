
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ChevronDown, Search } from 'lucide-react';
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
import TherapistProfileCard from '@/components/therapist/TherapistProfileCard';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TherapistSelectionPage = () => {
  const navigate = useNavigate();
  const { setCurrentTherapist } = useTherapist();
  const isMobile = useIsMobile();
  
  // State for filters
  const [identityFilter, setIdentityFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [styleFilter, setStyleFilter] = useState('All');
  
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
      description: 'Smart and thorough',
      specialties: ['Productivity'],
      avatarSrc: '/therapists/logan.svg',
      bgColor: 'bg-blue-100',
      gender: 'Male',
      style: 'Direct',
    },
    {
      id: 'sarah',
      name: 'Sarah',
      description: 'Friendly and caring',
      specialties: ['Grief', 'Stress'],
      avatarSrc: '/therapists/sarah.svg',
      bgColor: 'bg-green-100',
      gender: 'Female',
      style: 'Reflective',
    },
    {
      id: 'maya',
      name: 'Maya',
      description: 'Trauma specialist',
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
  
  const resetFilters = () => {
    setIdentityFilter('All');
    setTopicFilter('All');
    setStyleFilter('All');
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

  const identityOptions = ['All', 'Male', 'Female', 'Non-binary', 'LGBTQ+'];
  const topicOptions = ['All', 'Anxiety', 'Depression', 'Trauma', 'Productivity', 'Mindfulness', 'Grief', 'Stress', 'Relationships', 'Self-esteem', 'Career'];
  const styleOptions = ['All', 'Supportive', 'Direct', 'Reflective', 'Motivational'];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow flex flex-col items-center px-4 py-8 lg:py-12">
        <div className="w-full max-w-4xl mb-10 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Select a Therapist</h1>
            <p className="text-lg text-gray-600">Choose an AI therapist to talk to.</p>
          </div>
          
          {/* Quick match button */}
          <div className="flex justify-center mb-8">
            <Button 
              variant="outline" 
              className="bg-white border border-gray-300 rounded-full px-8 py-6 text-lg font-medium flex items-center hover:bg-gray-50"
              onClick={handleQuickMatch}
            >
              <Search className="h-5 w-5 mr-2" />
              Let us match you
            </Button>
          </div>
          
          {/* Filter dropdowns */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-60 justify-between text-left font-normal">
                  <span>Identity</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0">
                <div className="flex flex-col">
                  {identityOptions.map(option => (
                    <Button 
                      key={option}
                      variant="ghost" 
                      className={`justify-start ${identityFilter === option ? 'bg-gray-100' : ''}`}
                      onClick={() => setIdentityFilter(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-60 justify-between text-left font-normal">
                  <span>Topics</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0">
                <div className="flex flex-col">
                  {topicOptions.map(option => (
                    <Button 
                      key={option}
                      variant="ghost" 
                      className={`justify-start ${topicFilter === option ? 'bg-gray-100' : ''}`}
                      onClick={() => setTopicFilter(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-60 justify-between text-left font-normal">
                  <span>Therapy Style</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0">
                <div className="flex flex-col">
                  {styleOptions.map(option => (
                    <Button 
                      key={option}
                      variant="ghost" 
                      className={`justify-start ${styleFilter === option ? 'bg-gray-100' : ''}`}
                      onClick={() => setStyleFilter(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Therapist grid */}
          {filteredTherapists.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm p-8 w-full">
              <h3 className="text-xl font-medium text-gray-600 mb-3">No therapists match your current filters</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to see more options</p>
              <Button variant="outline" onClick={resetFilters}>Reset all filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredTherapists.map((therapist) => (
                <div 
                  key={therapist.id} 
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleTherapistSelect(therapist.id)}
                >
                  <TherapistProfileCard
                    therapist={therapist}
                    isFavorite={favorites.includes(therapist.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(therapist.id, e)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TherapistSelectionPage;
