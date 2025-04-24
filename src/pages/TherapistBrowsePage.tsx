
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, LayoutGrid, LayoutList } from "lucide-react";
import TherapistList from '@/components/therapist/TherapistList';
import TherapistGrid from '@/components/therapist/TherapistGrid';
import TherapistFilters from '@/components/therapist/TherapistFilters';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define the therapist type to use throughout the components
export type Therapist = {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialties: string[];
  experience: number;
  rating: number;
  sessionsCompleted: number;
  availability: string[];
  bio: string;
  approach: string;
  price: number;
};

const TherapistBrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<{
    specialties: string[];
    availability: string[];
    priceRange: [number, number];
  }>({
    specialties: [],
    availability: [],
    priceRange: [0, 500],
  });
  const { toast } = useToast();

  // Sample therapist data - in a real app, this would come from an API
  const therapists: Therapist[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
      title: 'Licensed Clinical Psychologist',
      specialties: ['Anxiety', 'Depression', 'Trauma'],
      experience: 12,
      rating: 4.9,
      sessionsCompleted: 843,
      availability: ['Mon', 'Wed', 'Fri'],
      bio: 'With over a decade of experience, I specialize in helping individuals navigate life transitions and overcome anxiety and depression through evidence-based approaches.',
      approach: 'Cognitive Behavioral Therapy (CBT), Mindfulness',
      price: 120,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
      title: 'Counseling Psychologist',
      specialties: ['Relationship Issues', 'LGBTQ+', 'Self-Esteem'],
      experience: 8,
      rating: 4.7,
      sessionsCompleted: 512,
      availability: ['Tue', 'Thu', 'Sat'],
      bio: 'I create a safe space for individuals to explore identity, relationships, and personal growth. My approach is warm, collaborative, and focused on your unique needs.',
      approach: 'Person-Centered Therapy, Narrative Therapy',
      price: 95,
    },
    {
      id: '3',
      name: 'Lisa Rivera',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      title: 'Licensed Marriage & Family Therapist',
      specialties: ['Couples Therapy', 'Family Conflicts', 'Grief'],
      experience: 15,
      rating: 4.8,
      sessionsCompleted: 967,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      bio: 'I help couples and families rebuild connections and navigate difficult transitions. My approach is collaborative and solution-focused.',
      approach: 'Emotionally Focused Therapy (EFT), Systems Theory',
      price: 140,
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      title: 'Clinical Psychologist',
      specialties: ['Anxiety Disorders', 'OCD', 'Panic Attacks'],
      experience: 11,
      rating: 4.6,
      sessionsCompleted: 731,
      availability: ['Wed', 'Thu', 'Fri', 'Sat'],
      bio: 'Specializing in anxiety disorders, I help clients develop practical strategies to manage symptoms and regain control of their lives.',
      approach: 'Exposure Therapy, Acceptance and Commitment Therapy (ACT)',
      price: 130,
    },
    {
      id: '5',
      name: 'Aisha Patel',
      avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
      title: 'Licensed Clinical Social Worker',
      specialties: ['Cultural Identity', 'Trauma', 'Life Transitions'],
      experience: 7,
      rating: 4.8,
      sessionsCompleted: 429,
      availability: ['Mon', 'Tue', 'Fri', 'Sat'],
      bio: 'I help individuals navigate cultural identity, trauma, and major life changes with an approach that honors your unique background and experiences.',
      approach: 'Culturally Responsive Therapy, EMDR',
      price: 90,
    },
    {
      id: '6',
      name: 'Robert Kim',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      title: 'Mental Health Counselor',
      specialties: ['Addiction', 'Men\'s Issues', 'Stress'],
      experience: 9,
      rating: 4.7,
      sessionsCompleted: 602,
      availability: ['Tue', 'Wed', 'Thu', 'Sun'],
      bio: 'I specialize in addiction recovery and men\'s mental health, creating a judgment-free zone to explore challenges and build resilience.',
      approach: 'Motivational Interviewing, Strengths-Based Approach',
      price: 85,
    }
  ];

  // Filter therapists based on search query and selected filters
  const filteredTherapists = therapists.filter(therapist => {
    // Search by name or specialty
    const matchesSearch = searchQuery === '' || 
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by specialty
    const matchesSpecialty = selectedFilters.specialties.length === 0 || 
      therapist.specialties.some(s => selectedFilters.specialties.includes(s));

    // Filter by availability
    const matchesAvailability = selectedFilters.availability.length === 0 ||
      therapist.availability.some(a => selectedFilters.availability.includes(a));

    // Filter by price
    const matchesPrice = therapist.price >= selectedFilters.priceRange[0] && 
      therapist.price <= selectedFilters.priceRange[1];

    return matchesSearch && matchesSpecialty && matchesAvailability && matchesPrice;
  });

  const handleFilterChange = (newFilters: typeof selectedFilters) => {
    setSelectedFilters(newFilters);
  };

  const handleBookSession = (therapist: Therapist) => {
    // In a real app, this would navigate to a booking page or open a modal
    toast({
      title: "Session Request Sent",
      description: `Your request to book a session with ${therapist.name} has been sent.`,
    });
    
    // For demonstration purposes, we'll just log the action
    console.log(`Booking session with ${therapist.name}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-center mb-6">Find Your Perfect Therapist Match</h1>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse through our highly qualified therapists and find someone who resonates with your needs. 
            You can filter by specialty, availability, and more to find your ideal match.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or specialty..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">View as:</span>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <TherapistFilters 
                filters={selectedFilters}
                onFilterChange={handleFilterChange}
                availableSpecialties={Array.from(new Set(therapists.flatMap(t => t.specialties)))}
              />
            </aside>
            
            <main className="lg:col-span-3">
              {filteredTherapists.length > 0 ? (
                viewMode === 'grid' ? (
                  <TherapistGrid 
                    therapists={filteredTherapists} 
                    onBookSession={handleBookSession} 
                  />
                ) : (
                  <TherapistList 
                    therapists={filteredTherapists} 
                    onBookSession={handleBookSession} 
                  />
                )
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No therapists found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TherapistBrowsePage;
