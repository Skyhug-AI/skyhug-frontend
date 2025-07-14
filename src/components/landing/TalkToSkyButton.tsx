
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const TalkToSkyButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/chat')}
      className="relative mx-auto flex items-center gap-2 px-6 py-3 text-lg font-medium text-white rounded-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-sky-300/50 hover:border-sky-200/70 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] animate-pulse-gentle"
      style={{
        boxShadow: '0 0 20px rgba(14, 165, 233, 0.3), 0 0 40px rgba(14, 165, 233, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
    >
      <MessageSquare className="w-5 h-5" />
      Talk to Sky ☀️
    </button>
  );
};

export default TalkToSkyButton;
