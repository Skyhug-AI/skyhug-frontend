
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Search, ChevronDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Define filter types
export type IdentityFilter = 'All' | 'Male' | 'Female' | 'Non-binary' | 'LGBTQ+';
export type StyleFilter = 'All' | 'Supportive' | 'Motivational' | 'Direct' | 'Reflective';
export type TopicFilter = 'All' | 'Anxiety' | 'Depression' | 'Trauma' | 'Career' | 'Mindfulness' | 'Relationships' | 'Productivity' | 'Stress' | 'Grief' | 'Self-esteem';

interface TherapistFiltersProps {
  identityFilter: IdentityFilter;
  styleFilter: StyleFilter;
  topicFilter: TopicFilter;
  setIdentityFilter: (filter: IdentityFilter) => void;
  setStyleFilter: (filter: StyleFilter) => void;
  setTopicFilter: (filter: TopicFilter) => void;
  resetFilters: () => void;
  handleQuickMatch: () => void;
  isMobile: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const TherapistFilters: React.FC<TherapistFiltersProps> = ({
  identityFilter,
  styleFilter,
  topicFilter,
  setIdentityFilter,
  setStyleFilter,
  setTopicFilter,
  resetFilters,
  handleQuickMatch,
  isMobile,
  showFilters,
  setShowFilters
}) => {
  return (
    <div className="mb-8 w-full">
      {isMobile && (
        <Button 
          variant="outline" 
          className="mb-4 w-full flex items-center justify-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      )}
      
      {showFilters && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
            {/* Identity Filter Group */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="font-medium">Identity</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="ml-1">
                      <span className="text-xs bg-gray-100 rounded-full h-4 w-4 inline-flex items-center justify-center">?</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Filter therapists based on their identity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2">
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
            </div>
            
            {/* Style Filter Group */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="font-medium">Therapy Style</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="ml-1">
                      <span className="text-xs bg-gray-100 rounded-full h-4 w-4 inline-flex items-center justify-center">?</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Choose a therapy approach that works for you</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2">
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
            </div>
            
            {/* Topic Filter Group */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="font-medium">Topics</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="ml-1">
                      <span className="text-xs bg-gray-100 rounded-full h-4 w-4 inline-flex items-center justify-center">?</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Filter by areas of expertise</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
            </div>
          </div>
          
          {/* Quick Match and Reset Filters */}
          <div className="flex flex-wrap items-center justify-between mt-6 gap-3">
            <Button 
              variant="outline"
              className="border-dashed border-gray-300 flex items-center"
              onClick={handleQuickMatch}
            >
              <Search className="h-4 w-4 mr-2" />
              Let us match you
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-gray-500"
            >
              Reset filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistFilters;
