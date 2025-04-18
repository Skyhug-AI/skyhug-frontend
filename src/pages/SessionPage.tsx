
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/context/TherapistContext';
import SessionIntro from '@/components/session/SessionIntro';
import SessionRoom from '@/components/session/SessionRoom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SessionPage = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const { clearMessages } = useTherapist();
  const navigate = useNavigate();

  useEffect(() => {
    clearMessages();
  }, []);

  const handleStartSession = () => {
    setIsSessionStarted(true);
  };

  const handleEndSession = () => {
    navigate('/session-summary');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {isSessionStarted && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleEndSession}
            >
              End Chat & Continue
            </Button>
          )}
        </div>
      </header>
      
      <div className="flex-grow max-w-3xl mx-auto px-4 w-full">
        {!isSessionStarted ? (
          <SessionIntro onStartSession={handleStartSession} />
        ) : (
          <SessionRoom />
        )}
      </div>
    </div>
  );
};

export default SessionPage;
