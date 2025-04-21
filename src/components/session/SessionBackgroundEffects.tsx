
import React from "react";

// Subtle sky background with soft aurora/gradient effect at the bottom,
// gentle clouds, and very light sparkles
const SessionBackgroundEffects: React.FC = () => {
  // Pre-determined cloud positions/sizes for soft, non-distracting clouds
  const clouds = [
    // Soft left-top
    { left: "5%", top: "7%", w: 200, h: 90, color: "rgba(210,227,250,0.47)", blur: 8 },
    // Large right-top
    { left: "65%", top: "3%", w: 280, h: 98, color: "rgba(185,198,255,0.30)", blur: 14 },
    // Center-sky
    { left: "36%", top: "18%", w: 190, h: 80, color: "rgba(180,200,255,0.25)", blur: 10 },
    // Mid right
    { left: "72%", top: "33%", w: 150, h: 60, color: "rgba(219,212,255,0.22)", blur: 10 },
    // Soft low left
    { left: "7%", top: "62%", w: 140, h: 65, color: "rgba(194,205,255,0.19)", blur: 10 },
    // Center low (slightly blue-lavender)
    { left: "40%", top: "74%", w: 230, h: 110, color: "rgba(205,198,255,0.20)", blur: 12 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Main sky gradient background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(circle at bottom center, #f8f6ff 0%, #edf0fa 45%, #ffffff 100%)",
        }}
      />

      {/* Subtle colored orb/aurora at bottom center */}
      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: "3.5%",
          transform: "translateX(-50%)",
          width: 280,
          height: 180,
          borderRadius: "90%",
          background:
            "radial-gradient(circle at 50% 60%, rgba(186,173,255,0.30) 0%, rgba(140,183,255,0.18) 60%, rgba(235,236,251,0) 97%)",
          filter: "blur(25px)",
          animation: "float 11s ease-in-out infinite",
        }}
      />

      {/* Floating, blurred pastel clouds */}
      {clouds.map((cloud, i) => (
        <div
          key={`cloud-${i}`}
          className="cloud"
          style={{
            left: cloud.left,
            top: cloud.top,
            width: cloud.w,
            height: cloud.h,
            background: cloud.color,
            opacity: 1,
            filter: `blur(${cloud.blur}px)`,
            animation: `float-cloud ${(10 + i * 2)}s ease-in-out infinite`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Ultra subtle, sparse sparkles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute opacity-25 rounded-full animate-float"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: "radial-gradient(circle, #bccafa 55%, white 100%)",
            filter: "blur(0.7px)",
            animationDuration: `${Math.random() * 9 + 11}s`,
            animationDelay: `${Math.random() * 6}s`,
            zIndex: 2,
          }}
        />
      ))}
    </div>
  );
};

export default SessionBackgroundEffects;
