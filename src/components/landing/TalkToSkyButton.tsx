
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const TalkToSkyButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/chat')}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 text-lg font-medium text-white rounded-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <MessageSquare className="w-5 h-5" />
      Talk to Sky
    </button>
  );
};

export default TalkToSkyButton;
