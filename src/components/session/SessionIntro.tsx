
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import CloudBackground from '@/components/CloudBackground';
import AnimatedSunLoader from '@/components/ui/AnimatedSunLoader';

interface SessionIntroProps {
  onStartSession: () => void;
}

const SessionIntro: React.FC<SessionIntroProps> = ({ onStartSession }) => {
  // We want the intro animation to play automatically and then proceed
  useEffect(() => {
    // Nothing else needed here; loader will trigger on mount
  }, []);

  // Callback for when animation finishes
  const handleLoaderComplete = () => {
    onStartSession(); // Moves to the session view
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CloudBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-sm px-6 py-8 space-y-6 relative z-10"
      >
        <AnimatedSunLoader
          onComplete={handleLoaderComplete}
          duration={3000}
          subtext="Your mind deserves this pause."
        />
      </motion.div>
    </div>
  );
};

export default SessionIntro;
