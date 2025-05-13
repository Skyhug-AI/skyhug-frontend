
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const affirmations = [
  "You're exactly where you need to be on your healing journey",
  "Your feelings are valid, and it's okay to feel them fully",
  "Small steps forward are still steps forward",
  "You have the strength to begin again, as many times as you need",
  "Your peace matters more than your productivity",
  "It's brave to ask for help when you need it",
  "You're learning and growing, even when it doesn't feel like it"
];

const AffirmationCard = () => {
  // Get a random affirmation but use the date as seed so it stays the same all day
  const today = new Date().toDateString();
  const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % affirmations.length;
  
  return (
    <Card className="glass-panel mb-6 bg-gradient-to-r from-white to-indigo-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-slate-950">
          <Sparkles className="h-4 w-4 text-skyhug-500" />
          Affirmation of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-base italic text-skyhug-700 leading-relaxed">
          "{affirmations[index]}"
        </p>
      </CardContent>
    </Card>
  );
};

export default AffirmationCard;
