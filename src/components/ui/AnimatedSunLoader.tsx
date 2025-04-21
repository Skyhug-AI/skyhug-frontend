
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useMotionValue, animate } from "framer-motion";
import { Sun } from "lucide-react";
import CloudBackground from "@/components/CloudBackground";

// Use soft sun color and gradient
const BG_START = "linear-gradient(to top, #fef6f9 0%, #e5deff 100%)";
const BG_END = "linear-gradient(to top, #dbeafe 0%, #c7d7fc 100%)";
const SUN_GRADIENT = "linear-gradient(135deg, #ffd799 0%, #ffb347 100%)";
const PULSE_COLOR = "#ffecd2";
const CHIME_SOUND_URL = "https://cdn.pixabay.com/audio/2022/10/16/audio_12ad6099c7.mp3"; // royalty-free, soft chime

interface AnimatedSunLoaderProps {
  duration?: number; // ms
  onComplete: () => void;
  onSkip?: () => void;
  subtext?: string;
}

const Sparkle: React.FC<{ left: string; top: string; delay: number }> = ({ left, top, delay }) => (
  <motion.div
    className="absolute rounded-full bg-white opacity-60"
    style={{ width: 8, height: 8, left, top, filter: "blur(1px)" }}
    animate={{
      scale: [1, 1.25, 1],
      opacity: [0.4, 0.85, 0.4],
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const AnimatedSunLoader: React.FC<AnimatedSunLoaderProps> = ({
  duration = 3000,
  onComplete,
  onSkip,
  subtext = "Your mind deserves this pause.",
}) => {
  const controls = useAnimation();
  const bgControls = useAnimation();
  const [textVisible1, setTextVisible1] = useState(false);
  const [textVisible2, setTextVisible2] = useState(false);
  const [sunVisible, setSunVisible] = useState(false);
  const sunProgress = useMotionValue(0); // for parallax
  const audioRef = useRef<HTMLAudioElement>(null);

  // Animate sun rise and background
  useEffect(() => {
    setSunVisible(false);
    controls.set({ y: 44, opacity: 0 }); // Start further down
    controls.start({
      y: [44, 0],
      opacity: [0, 1],
      transition: { duration: duration / 1000, ease: "easeInOut" }
    }).then(() => setSunVisible(true));
    bgControls.start({
      background: [BG_START, BG_END],
      transition: { duration: duration / 1000, ease: "easeInOut" }
    });
    // Animate sunProgress 0 → 1
    const controlsAnim = animate(0, 1, {
      duration: duration / 1000,
      onUpdate: v => sunProgress.set(v),
      ease: [0.42,0,0.58,1]
    });

    // Fade-in text lines staggered
    const t1 = setTimeout(() => setTextVisible1(true), 500);
    const t2 = setTimeout(() => setTextVisible2(true), 800);

    // Auto-complete after duration
    const timeout = setTimeout(() => {
      // Play chime before completing
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setTimeout(onComplete, 600);
    }, duration);

    return () => {
      clearTimeout(timeout);
      clearTimeout(t1);
      clearTimeout(t2);
      controlsAnim.stop();
    };
  }, [duration, onComplete, controls, bgControls, sunProgress]);

  const handleSkip = () => {
    if (onSkip) onSkip();
    onComplete();
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-end min-h-80 h-80 relative w-full select-none"
      initial={false}
      animate={bgControls}
      style={{
        background: BG_START,
        borderRadius: "1.25rem",
        overflow: "hidden",
      }}
    >
      {/* Floating dots/clouds/sparkles in background, with sunProgress for parallax */}
      <CloudBackground sunProgress={sunProgress.get()} />
      {/* Sun group (glow + sun + rays) */}
      <motion.div
        className="absolute left-1/2 z-20"
        style={{ transform: "translateX(-50%)" }}
        animate={controls}
        initial={{ y: 44, opacity: 0 }}
      >
        {/* Glowing, pulsing ring/beam */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 166,
            height: 166,
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 50%, #ffefbb 0%, #ffeab750 52%, transparent 97%)`,
            position: "absolute",
            zIndex: 2,
            filter: "blur(7px)",
            boxShadow: "0 0 40px 0 #ffd18050, 0 0 80px #ffd18044",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [0.94, 1.12, 0.94],
            opacity: [0.37, 0.77, 0.37]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Animated subtle sun rays */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [0.97, 1.12, 0.97],
            opacity: [0.7, 0.98, 0.7],
            rotate: [0, 66, 0],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-32 h-32 rounded-full border-4 border-yellow-50 border-t-yellow-300 border-b-yellow-100 shadow-lg blur-[1.5px]" />
        </motion.div>
        {/* Sun orb itself */}
        <motion.div
          className="flex items-center justify-center"
          style={{
            width: 92,
            height: 92,
            borderRadius: 9999,
            background: SUN_GRADIENT,
            boxShadow: "0 0 40px 0 #ffeac6, 0 0 0 18px #fdecc883",
            zIndex: 3,
            border: "2.5px solid #fffdf3",
            overflow: "visible",
          }}
          initial={{ scale: 0.97, opacity: 1 }}
          animate={{
            scale: [0.978, 1.00, 0.97],
            filter: [
              "drop-shadow(0px 0px 0px #ffd180bb)",
              "drop-shadow(0px 0px 12px #ffd180e0)",
              "drop-shadow(0px 0px 0px #ffd180bb)",
            ],
          }}
          transition={{
            duration: 2.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sun className="text-yellow-400 drop-shadow" size={54} />
        </motion.div>
      </motion.div>

      {/* Fade-in animated, larger message text */}
      <motion.div
        className="absolute w-full flex flex-col items-center z-30"
        style={{ bottom: "80px" }}
        initial={false}
        animate={{
          opacity: textVisible1 ? 1 : 0,
          y: textVisible1 ? 0 : 12
        }}
        transition={{ duration: 0.97 }}
      >
        <div className="text-[1.32rem] md:text-[1.37rem] font-semibold text-skyhug-600 drop-shadow-sm mb-1" style={{ lineHeight: 1.32, fontWeight: 600 }}>
          Taking a breath before we begin…
        </div>
      </motion.div>
      <motion.div
        className="absolute w-full flex flex-col items-center z-30"
        style={{ bottom: "56px" }}
        initial={false}
        animate={{
          opacity: textVisible2 ? 1 : 0,
          y: textVisible2 ? 0 : 10
        }}
        transition={{ duration: 0.78, delay: 0.16 }}
      >
        <div className="text-sm text-blue-500 mt-0.5" style={{ lineHeight: 1.33, fontWeight: 500 }}>
          {subtext}
        </div>
      </motion.div>

      {/* Sparkles (decorate, but not overwhelming, as before) */}
      <Sparkle left="55%" top="32%" delay={0.3} />
      <Sparkle left="38%" top="23%" delay={0.7} />
      <Sparkle left="70%" top="45%" delay={1.6} />
      <Sparkle left="23%" top="44%" delay={1.1} />

      {/* "Skip" Button */}
      <motion.div
        className="absolute w-full flex justify-center z-40"
        style={{ bottom: "20px", pointerEvents: "auto" }}
        initial={false}
        animate={{ opacity: textVisible2 ? 1 : 0, y: textVisible2 ? 0 : 12 }}
        transition={{ duration: 0.55, delay: 0.07 }}
      >
        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-full bg-white/85 shadow-md border border-black/5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 text-xs font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
          style={{
            boxShadow: "0 1px 7px 0 rgba(0,0,0,0.05)",
            minWidth: 94,
            marginInline: "auto"
          }}
        >
          Start now
        </button>
      </motion.div>

      {/* Chime audio (hidden) */}
      <audio ref={audioRef} src={CHIME_SOUND_URL} preload="auto" />
    </motion.div>
  );
};

export default AnimatedSunLoader;
