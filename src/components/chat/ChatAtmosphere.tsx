
import React from 'react';
import { motion } from 'framer-motion';

const ChatAtmosphere = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8faff] to-[#ffffff] opacity-70" />
      
      {/* Soft clouds */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute"
          style={{
            top: `${i * 25}%`,
            left: `${(i % 2) * 70}%`,
            width: '300px',
            height: '120px',
          }}
        >
          <motion.div 
            className="w-full h-full bg-white/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      ))}

      {/* Twinkling stars */}
      <div className="absolute bottom-10 right-10 w-32 h-32">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/60 rounded-full"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: '100%',
          }}
          animate={{
            y: [0, -400],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 15,
            delay: i * 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default ChatAtmosphere;
