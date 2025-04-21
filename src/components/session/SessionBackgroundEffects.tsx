
import React from "react";

// Combination of floating clouds and sparkles, made to be subtle but visible behind session content
const SessionBackgroundEffects: React.FC = () => {
  // Clouds positions and sizes (less random for consistency)
  const clouds = [
    { left: "5%",    top: "6%",   w: 220, h: 100, opacity: 0.33, anim: 12 },
    { left: "72%",   top: "12%",  w: 180, h: 90,  opacity: 0.27, anim: 18 },
    { left: "35%",   top: "70%",  w: 240, h: 120, opacity: 0.35, anim: 13 },
    { left: "60%",   top: "82%",  w: 150, h: 68,  opacity: 0.22, anim: 19 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Floating clouds */}
      {clouds.map((c, i) => (
        <div
          key={`cloud-${i}`}
          className="cloud animate-float-cloud"
          style={{
            left: c.left,
            top: c.top,
            width: c.w,
            height: c.h,
            opacity: c.opacity,
            filter: "blur(2px)",
            animationDuration: `${c.anim}s`,
            background: "linear-gradient(135deg, #e0f3ff 70%, #fff 100%)",
          }}
        />
      ))}
      {/* Subtle sparkles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute bg-white opacity-30 rounded-full animate-float"
          style={{
            width: `${Math.random() * 5 + 3}px`,
            height: `${Math.random() * 5 + 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 6}s`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
      {[...Array(3)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute bg-white opacity-20 animate-pulse-slow"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 6 + 5}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SessionBackgroundEffects;
