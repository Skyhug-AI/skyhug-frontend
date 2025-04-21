
import React from "react";
import { Cloud, Sparkles } from "lucide-react";

// This component renders subtle floating sparkle particles and floating clouds with slightly higher edge bias.
const cloudConfigs = [
  { left: "3%", top: "7%", width: 110, height: 45, opacity: 0.27, blur: 7 },
  { right: "7%", top: "9%", width: 150, height: 54, opacity: 0.20, blur: 8 },
  { left: "5%", bottom: "12%", width: 75, height: 38, opacity: 0.15, blur: 8 },
  { right: "8%", bottom: "14%", width: 100, height: 46, opacity: 0.19, blur: 8 },
  { left: "40%", top: "3%", width: 90, height: 40, opacity: 0.13, blur: 8 },
];

const BackgroundEffects: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "linear-gradient(180deg, #d3e4fd 0%, #ffffff 100%)",
          zIndex: -20,
        }}
      />
      
      {/* Sun orb at bottom for gradient accent */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: "50%",
          bottom: "-11%",
          transform: "translateX(-50%)",
          width: 330,
          height: 132,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, #fde1d3 0%, #ffe29f 48%, rgba(252,242,217,0.14) 100%)",
          boxShadow: "0 0 70px 58px #fde1d399, 0 0 220px 120px #ffd5b2cc",
          filter: "blur(8px)",
          opacity: 0.75,
          zIndex: -15,
        }}
      />

      {/* softly drifting clouds around edges */}
      {cloudConfigs.map((cloud, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute rounded-full"
          style={{
            left: cloud.left,
            right: cloud.right,
            top: cloud.top,
            bottom: cloud.bottom,
            width: cloud.width,
            height: cloud.height,
            background: "#fff",
            opacity: cloud.opacity,
            filter: `blur(${cloud.blur}px)`,
            animation: "float-cloud 18s ease-in-out infinite",
            animationDelay: `${i * 1.4}s`,
            zIndex: -10,
          }}
        />
      ))}

      {/* Floating sparkles and ambient particles */}
      {[...Array(22)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white opacity-40 rounded-full animate-float"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 8}s`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: -5,
          }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute bg-white opacity-25 animate-pulse-slow"
          style={{
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 4 + 3}s`,
            animationDelay: `${Math.random() * 3}s`,
            zIndex: -5,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundEffects;
