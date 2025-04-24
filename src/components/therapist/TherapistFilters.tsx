
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TherapistFiltersProps {
  filters: {
    specialties: string[];
    availability: string[];
    priceRange: [number, number];
  };
  onFilterChange: (filters: {
    specialties: string[];
    availability: string[];
    priceRange: [number, number];
  }) => void;
  availableSpecialties: string[];
}

const TherapistFilters: React.FC<TherapistFiltersProps> = ({
  filters,
  onFilterChange,
  availableSpecialties,
}) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const handleSpecialtyChange = (specialty: string, isChecked: boolean) => {
    const updatedSpecialties = isChecked
      ? [...filters.specialties, specialty]
      : filters.specialties.filter(s => s !== specialty);
    
    onFilterChange({
      ...filters,
      specialties: updatedSpecialties,
    });
  };
  
  const handleAvailabilityChange = (day: string, isChecked: boolean) => {
    const updatedAvailability = isChecked
      ? [...filters.availability, day]
      : filters.availability.filter(d => d !== day);
    
    onFilterChange({
      ...filters,
      availability: updatedAvailability,
    });
  };
  
  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };
  
  const resetFilters = () => {
    onFilterChange({
      specialties: [],
      availability: [],
      priceRange: [0, 500],
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Specialties</h3>
              <div className="space-y-2">
                {availableSpecialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialty-${specialty}`}
                      checked={filters.specialties.includes(specialty)}
                      onCheckedChange={(checked) => 
                        handleSpecialtyChange(specialty, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`specialty-${specialty}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Availability</h3>
              <div className="space-y-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={filters.availability.includes(day)}
                      onCheckedChange={(checked) => 
                        handleAvailabilityChange(day, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`day-${day}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Price Range</h3>
                <span className="text-sm">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                min={0}
                max={500}
                step={10}
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
            </div>

            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistFilters;
