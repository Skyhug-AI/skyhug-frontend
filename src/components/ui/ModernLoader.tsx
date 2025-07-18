import React from "react";
import { motion } from "framer-motion";

interface ModernLoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

const ModernLoader: React.FC<ModernLoaderProps> = ({ 
  text = "Loading...", 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48", 
    lg: "w-64 h-64"
  };

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Main animated container */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Background blur effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-4 border-2 border-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-60"
          style={{
            background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))"
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner pulsing circle */}
        <motion.div
          className="relative w-20 h-20 bg-gradient-to-br from-background via-muted to-background rounded-full shadow-2xl border border-border/50"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 40px rgba(59, 130, 246, 0.6)",
              "0 0 20px rgba(59, 130, 246, 0.3)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Central dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${dotSizes[size]} bg-gradient-to-r from-primary to-secondary rounded-full`}
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: `${Math.cos((i * 60) * Math.PI / 180) * 60}px ${Math.sin((i * 60) * Math.PI / 180) * 60}px`,
            }}
            animate={{
              rotate: 360,
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Loading text with typing effect */}
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.h3 
          className="text-lg font-semibold text-foreground"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.h3>
        
        {/* Animated progress dots */}
        <div className="flex items-center justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ModernLoader;