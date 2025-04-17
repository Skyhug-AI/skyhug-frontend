
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CloudBackground from '@/components/CloudBackground';

interface SessionIntroProps {
  onStartSession: () => void;
}

const SessionIntro: React.FC<SessionIntroProps> = ({ onStartSession }) => {
  const [countdown, setCountdown] = useState(3);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (isStarting && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isStarting && countdown === 0) {
      onStartSession();
    }
  }, [countdown, isStarting]);

  const handleSkip = () => {
    setIsStarting(false);
    onStartSession();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CloudBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-sm px-6 py-5 space-y-6 relative z-10"
      >
        {isStarting ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 py-8"
          >
            <div className="text-6xl font-semibold text-gray-900 mb-8">
              {countdown}
            </div>
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i >= countdown ? 'bg-gray-200' : 'bg-gray-900'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: i === countdown - 1 ? [0.8, 1.2, 0.8] : 0.8 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Skip countdown
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mic-toggle" className="text-sm font-medium text-gray-700">
                  Microphone
                </Label>
                <Switch
                  id="mic-toggle"
                  checked={isMicEnabled}
                  onCheckedChange={setIsMicEnabled}
                />
              </div>
              <p className="text-sm text-gray-500">
                You can talk or type — whichever feels better today.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setIsStarting(true)}
                className="w-full bg-[#5F6FFF] hover:bg-[#4F57DD] text-white font-semibold rounded-full shadow-sm transition-all duration-300"
              >
                {isMicEnabled ? (
                  <Mic className="h-4 w-4 mr-2" />
                ) : (
                  <MicOff className="h-4 w-4 mr-2" />
                )}
                Begin Session with Sky
              </Button>

              <motion.p 
                className="text-xs text-gray-400 italic text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                ✨ Your mind deserves this pause.
              </motion.p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SessionIntro;
