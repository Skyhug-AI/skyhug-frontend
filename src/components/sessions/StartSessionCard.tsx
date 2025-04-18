
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, PlusCircle, Sparkles } from 'lucide-react';

const StartSessionCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-panel px-6 py-5 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Ready for a Session?</h2>
        <p className="text-sm text-sky-600">Let's talk it out with Sky.</p>
      </div>
      
      <div className="flex flex-col gap-y-4">
        <Button 
          onClick={() => navigate('/session')} 
          size="lg"
          className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 
                     text-white rounded-full py-6 shadow-md hover:shadow-lg 
                     transition-all duration-300 font-medium text-base"
        >
          <Headphones className="mr-2 h-4 w-4" />
          Begin Session with Sky
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/schedule')} 
          className="w-full rounded-full border-gray-300 text-gray-800 hover:bg-gray-50"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Schedule Session
        </Button>
      </div>
      
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
        <Sparkles className="h-3.5 w-3.5 text-sky-500" />
        <span>+10 Calm Points today</span>
      </div>
    </Card>
  );
};

export default StartSessionCard;
