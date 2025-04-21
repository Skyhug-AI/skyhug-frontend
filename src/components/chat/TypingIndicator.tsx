
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react"; // We'll use this for a pulse effect

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3 mb-4 animate-fade-in">
      {/* Sky's Cloud avatar */}
      <div className="relative flex items-center justify-center">
        <span className="rounded-full bg-gradient-to-b from-[#e8edff] to-[#f5f5ff] p-1 shadow-[0_2px_8px_rgba(173,188,255,0.20)]">
          {/* Small static cloud avatar, could be animated more */}
          <svg width="32" height="32" viewBox="0 0 32 32"><g><ellipse cx="16" cy="23" rx="12" ry="7" fill="#bdb2ff" /><ellipse cx="20" cy="17" rx="7" ry="4.5" fill="#a0c4ff" /><ellipse cx="13.5" cy="19" rx="7" ry="3.7" fill="#f5f5ff" /></g></svg>
        </span>
        {/* Sparkles pulse, left corner */}
        <motion.span
          className="absolute -left-2 -bottom-1"
          animate={{ scale: [1, 1.26, 0.9, 1], opacity: [0.9, 1, 0.5, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <Sparkles className="h-4 w-4 text-[#bdb2ff] opacity-80" />
        </motion.span>
      </div>
      <div className="bg-gradient-to-b from-[#e8edff] to-[#f5f5ff] border border-[#dae5ff] shadow-lg p-5 rounded-2xl rounded-tl-none min-w-[135px] max-w-[300px] flex flex-col items-start relative">
        <div className="flex space-x-2 h-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#9b87f5] opacity-65"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1.2, 0.98],
              }}
              transition={{
                delay: i * 0.16,
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <span className="mt-2 text-xs text-[#6E59A5] font-medium italic">Sky is thinking…</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
