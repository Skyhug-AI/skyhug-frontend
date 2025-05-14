
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ChevronDown, Search } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { useTherapist } from '@/context/TherapistContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import TherapistSelectionCard from '@/components/therapist/TherapistSelectionCard';

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
      
      <main className="flex-grow px-6 py-10">
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Select a Therapist</h1>
          </div>
          
          <p className="text-gray-500 mb-6">Choose an AI therapist to talk to.</p>
          
          {/* Quick match button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-gray-300 rounded-lg hover:shadow-sm transition mb-6"
            onClick={handleQuickMatch}
          >
            <Search className="h-4 w-4" /> Let us match you
          </Button>
          
          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select 
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none"
              value={identityFilter}
              onChange={(e) => setIdentityFilter(e.target.value)}
            >
              <option value="All">Identity</option>
              {identityOptions.filter(option => option !== 'All').map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <select 
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="All">Topics</option>
              {topicOptions.filter(option => option !== 'All').map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <select 
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none"
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
            >
              <option value="All">Therapy Style</option>
              {styleOptions.filter(option => option !== 'All').map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            
            {(identityFilter !== 'All' || topicFilter !== 'All' || styleFilter !== 'All') && (
              <Button 
                variant="ghost" 
                className="text-sm text-gray-500"
                onClick={resetFilters}
              >
                Reset filters
              </Button>
            )}
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
                <TherapistSelectionCard
                  key={therapist.id}
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TherapistSelectionPage;
