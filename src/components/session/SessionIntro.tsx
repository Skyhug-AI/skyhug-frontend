import React from "react";
import { motion } from "framer-motion";
import CloudBackground from "@/components/CloudBackground";
import AnimatedSunLoader from "@/components/ui/AnimatedSunLoader";

interface SessionIntroProps {
  onStartSession: () => void;
}

const SessionIntro: React.FC<SessionIntroProps> = ({ onStartSession }) => {
  const handleLoaderComplete = () => {
    // Call onStartSession only once
    onStartSession();
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
