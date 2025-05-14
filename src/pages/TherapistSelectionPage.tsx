
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
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
import TherapistFilters from '@/components/therapist/TherapistFilters';
import TherapistSelectionCard from '@/components/therapist/TherapistSelectionCard';
import type { IdentityFilter, StyleFilter, TopicFilter } from '@/components/therapist/TherapistFilters';

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
      
      <main className="flex-grow flex flex-col items-center px-4 py-8 lg:py-12">
        <div className="max-w-5xl w-full mb-10 animate-fade-in space-y-3">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">Select a Therapist</h1>
            <p className="text-md sm:text-lg text-gray-500 mb-4">Choose an AI therapist to talk to</p>
          </div>
          
          {/* Therapist Info Tooltip */}
          <div className="flex justify-center">
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
          
          {/* Filters */}
          <TherapistFilters
            identityFilter={identityFilter}
            styleFilter={styleFilter}
            topicFilter={topicFilter}
            setIdentityFilter={setIdentityFilter}
            setStyleFilter={setStyleFilter}
            setTopicFilter={setTopicFilter}
            resetFilters={resetFilters}
            handleQuickMatch={handleQuickMatch}
            isMobile={isMobile}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        </div>
        
        {filteredTherapists.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
            <h3 className="text-xl font-medium text-gray-600 mb-3">No therapists match your current filters</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters to see more options</p>
            <Button variant="outline" onClick={resetFilters}>Reset all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl w-full">
            {filteredTherapists.map((therapist, index) => (
              <div key={therapist.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <TherapistSelectionCard
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
