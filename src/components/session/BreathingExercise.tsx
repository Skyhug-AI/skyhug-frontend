
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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

  useEffect(() => {
    if (!isOpen) return;

    const totalDuration = breatheInDuration + breatheOutDuration;
    const breathingInterval = setInterval(() => {
      setIsBreathingIn((prev) => !prev);
    }, (isBreathingIn ? breatheInDuration : breatheOutDuration) * 1000);

    return () => clearInterval(breathingInterval);
  }, [isOpen, isBreathingIn, breatheInDuration, breatheOutDuration]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-md flex items-center justify-center"
      >
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
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center">
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
      </motion.div>
    </AnimatePresence>
  );
};

export default BreathingExercise;
