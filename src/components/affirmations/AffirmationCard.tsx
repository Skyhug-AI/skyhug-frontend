
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const fallbackAffirmations = [
  "You're exactly where you need to be on your healing journey",
  "Your feelings are valid, and it's okay to feel them fully",
  "Small steps forward are still steps forward",
  "You have the strength to begin again, as many times as you need",
  "Your peace matters more than your productivity",
  "It's brave to ask for help when you need it",
  "You're learning and growing, even when it doesn't feel like it"
];

const AffirmationCard = () => {
  const [affirmation, setAffirmation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date().toDateString();

  useEffect(() => {
    const generateAffirmation = async () => {
      try {
        setIsLoading(true);
        
        // Check if we already have an affirmation for today in localStorage
        const cachedData = localStorage.getItem('dailyAffirmation');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (parsed.date === today && parsed.affirmation) {
            setAffirmation(parsed.affirmation);
            setIsLoading(false);
            return;
          }
        }

        // Generate new affirmation using edge function
        const { data, error } = await supabase.functions.invoke('generate-affirmation');
        
        if (error) {
          console.warn('Failed to generate AI affirmation, using fallback:', error);
          // Use fallback affirmation
          const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % fallbackAffirmations.length;
          setAffirmation(fallbackAffirmations[index]);
        } else {
          setAffirmation(data.affirmation);
          // Cache the affirmation for today
          localStorage.setItem('dailyAffirmation', JSON.stringify({
            affirmation: data.affirmation,
            date: today
          }));
        }
      } catch (error) {
        console.warn('Error generating affirmation, using fallback:', error);
        // Use fallback affirmation
        const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % fallbackAffirmations.length;
        setAffirmation(fallbackAffirmations[index]);
      } finally {
        setIsLoading(false);
      }
    };

    generateAffirmation();
  }, [today]);
  
  return (
    <Card className="glass-panel mb-6 bg-gradient-to-r from-white to-indigo-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-slate-950">
          <Sparkles className="h-4 w-4 text-skyhug-500" />
          Affirmation of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <div className="flex items-center gap-2 text-skyhug-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-base italic">Generating your daily affirmation...</span>
          </div>
        ) : (
          <p className="text-base italic text-skyhug-700 leading-relaxed">
            "{affirmation}"
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AffirmationCard;
