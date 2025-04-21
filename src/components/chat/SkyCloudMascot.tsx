
import React from "react";
import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

/**
 * Sky's cloud mascot avatar for chat bubbles, header, etc.
 * Props:
 *   - mood: "neutral" | "smile" | "thinking" (for future expansions)
 *   - size: px (number)
 */
const SkyCloudMascot: React.FC<{ mood?: "neutral" | "smile" | "thinking"; size?: number }> = ({
  mood = "neutral",
  size = 36,
}) => {
  // Facial expression variants for future extension
  const face =
    mood === "smile" ? (
      <ellipse cx="50%" cy="68%" rx="16%" ry="6%" fill="#6E59A5" />
    ) : mood === "thinking" ? (
      <ellipse cx="53%" cy="75%" rx="12%" ry="4%" fill="#9b87f5" />
    ) : null;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.07, 0.97, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
    >
      {/* Main cloud with gradient outline */}
      <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
        <ellipse
          cx="21"
          cy="25"
          rx="18"
          ry="12"
          fill="url(#grad1)"
          opacity="0.99"
        />
        <ellipse
          cx="22"
          cy="21"
          rx="13"
          ry="8.5"
          fill="url(#grad2)"
          opacity="0.89"
        />
        {/* Eyes */}
        <ellipse cx="16.6" cy="26" rx="1.2" ry="1.6" fill="#544e7b" />
        <ellipse cx="26" cy="26.1" rx="1.17" ry="1.5" fill="#544e7b" />
        {/* Smile/mood */}
        {face}
        <defs>
          <linearGradient id="grad1" x1="0" y1="15" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#bdb2ff" />
            <stop offset="1" stopColor="#a0c4ff" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="10" x2="32" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f5f5ff" />
            <stop offset="1" stopColor="#e8edff" />
          </linearGradient>
        </defs>
      </svg>
      {/* Cheek blush effect */}
      <span className="absolute left-[25%] bottom-[19%] w-2 h-2 bg-[#FFC4E1] rounded-full opacity-50"></span>
      <span className="absolute right-[24%] bottom-[21%] w-2 h-2 bg-[#FFC4E1] rounded-full opacity-50"></span>
    </motion.div>
  );
};

export default SkyCloudMascot;
