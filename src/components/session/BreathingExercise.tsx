
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import confetti from 'canvas-confetti';

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  isOpen,
  onClose,
}) => {
  const [breatheInDuration, setBreatheInDuration] = useState(4);
  const [breatheOutDuration, setBreatheOutDuration] = useState(4);
  const [isBreathingIn, setIsBreathingIn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [totalDuration, setTotalDuration] = useState(4 * 60); // 4 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(4 * 60);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset timer when opening
  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(totalDuration);
      setIsCompleted(false);
    }
  }, [isOpen, totalDuration]);

  // Breathing animation effect
  useEffect(() => {
    if (!isOpen) return;

    const breathingInterval = setInterval(() => {
      setIsBreathingIn((prev) => !prev);
    }, (isBreathingIn ? breatheInDuration : breatheOutDuration) * 1000);

    return () => clearInterval(breathingInterval);
  }, [isOpen, isBreathingIn, breatheInDuration, breatheOutDuration]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen || timeRemaining <= 0) return;

    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsCompleted(true);
          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isOpen, timeRemaining]);

  // Auto close after completion celebration
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Show celebration for 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onClose]);

  if (!isOpen) return null;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-md flex items-center justify-center"
      >
        {isCompleted ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-white"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 1.5, repeat: 1 }}
              className="text-5xl mb-6 text-purple-400"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-bold mb-3">Well done!</h2>
            <p className="text-xl">Breathing exercise completed</p>
          </motion.div>
        ) : (
          <>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white"
              >
                <Settings className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {showSettings && (
              <div className="absolute top-16 right-4 bg-white p-4 rounded-md shadow-lg w-64">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm">Breathe In: {breatheInDuration}s</label>
                    </div>
                    <Slider
                      value={[breatheInDuration]}
                      min={2}
                      max={8}
                      step={1}
                      onValueChange={(value) => setBreatheInDuration(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm">Breathe Out: {breatheOutDuration}s</label>
                    </div>
                    <Slider
                      value={[breatheOutDuration]}
                      min={2}
                      max={8}
                      step={1}
                      onValueChange={(value) => setBreatheOutDuration(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm">Session Duration (min)</label>
                    </div>
                    <Slider
                      value={[totalDuration / 60]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => {
                        const newDuration = value[0] * 60;
                        setTotalDuration(newDuration);
                        setTimeRemaining(newDuration);
                      }}
                    />
                    <div className="text-xs text-center mt-1">
                      {Math.round(totalDuration / 60)} minutes
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center justify-center">
              {/* Countdown timer */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/20 px-6 py-2 rounded-full flex items-center gap-2">
                <Timer className="h-5 w-5 text-white" />
                <span className="text-white text-xl font-mono">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <motion.div
                animate={{
                  scale: isBreathingIn ? 2 : 1,
                  opacity: isBreathingIn ? 1 : 0.7,
                }}
                transition={{
                  duration: isBreathingIn ? breatheInDuration : breatheOutDuration,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 bg-purple-400 bg-opacity-50 rounded-full flex items-center justify-center mb-8"
              />

              <motion.div
                key={isBreathingIn ? "in" : "out"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-white text-3xl font-light"
              >
                {isBreathingIn ? "Breathe in..." : "Breathe out..."}
              </motion.div>

              <div className="mt-6 text-white text-xl">
                <span className="opacity-50">
                  {isBreathingIn
                    ? `${breatheInDuration}s in`
                    : `${breatheOutDuration}s out`}
                </span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BreathingExercise;
