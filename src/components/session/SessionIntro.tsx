
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
  const [selectedTheme, setSelectedTheme] = useState('lavender');

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

  const getThemeClasses = () => {
    switch(selectedTheme) {
      case 'ocean':
        return 'from-blue-50 to-teal-50 border-teal-100';
      case 'sunrise':
        return 'from-orange-50 to-yellow-50 border-orange-100';
      case 'lavender':
      default:
        return 'from-blue-50 to-purple-50 border-blue-100';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-b from-[#f9fafe] to-[#f4f2ff]">
      <CloudBackground className="opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full bg-gradient-to-b ${getThemeClasses()} backdrop-blur-sm rounded-2xl shadow-sm px-6 py-8 space-y-6 relative z-10 border`}
      >
        {isStarting ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 py-8"
          >
            <div className="text-6xl font-semibold text-blue-900 mb-8">
              {countdown}
            </div>
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i >= countdown ? 'bg-blue-200' : 'bg-blue-500'
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
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Skip countdown
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-medium text-blue-800">Choose a Calming Theme</h3>
              <div className="flex space-x-3 justify-center mt-4">
                <button 
                  onClick={() => setSelectedTheme('lavender')}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 ${selectedTheme === 'lavender' ? 'ring-2 ring-blue-400 scale-110' : 'opacity-70'} transition-all`}
                  aria-label="Lavender Calm theme"
                >
                  {selectedTheme === 'lavender' && <span className="text-sm">✓</span>}
                </button>
                <button 
                  onClick={() => setSelectedTheme('ocean')} 
                  className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-teal-200 ${selectedTheme === 'ocean' ? 'ring-2 ring-teal-400 scale-110' : 'opacity-70'} transition-all`}
                  aria-label="Ocean Breeze theme"
                >
                  {selectedTheme === 'ocean' && <span className="text-sm">✓</span>}
                </button>
                <button 
                  onClick={() => setSelectedTheme('sunrise')} 
                  className={`w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-yellow-200 ${selectedTheme === 'sunrise' ? 'ring-2 ring-orange-400 scale-110' : 'opacity-70'} transition-all`}
                  aria-label="Sunrise Glow theme"
                >
                  {selectedTheme === 'sunrise' && <span className="text-sm">✓</span>}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mic-toggle" className="text-sm font-medium text-blue-700">
                  🎙️ Microphone
                </Label>
                <Switch
                  id="mic-toggle"
                  checked={isMicEnabled}
                  onCheckedChange={setIsMicEnabled}
                />
              </div>
              <p className="text-sm text-blue-600">
                You can talk or type — whichever feels better today.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setIsStarting(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-serenity-500 hover:from-blue-600 hover:to-serenity-600 text-white font-semibold rounded-full shadow-sm transition-all duration-300"
              >
                {isMicEnabled ? (
                  <Mic className="h-4 w-4 mr-2" />
                ) : (
                  <MicOff className="h-4 w-4 mr-2" />
                )}
                Begin Session with Sky
              </Button>

              <motion.p 
                className="text-xs text-blue-400 italic text-center"
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
