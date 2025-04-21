
import React from 'react';
import { Smile } from 'lucide-react';

interface CloudBackgroundProps {
  className?: string;
  showMascot?: boolean;
}

const CloudBackground: React.FC<CloudBackgroundProps> = ({ 
  className = '',
  showMascot = true 
}) => {
  const cloudConfigs = [
    { left: "3%", top: "7%", width: 110, height: 45, opacity: 0.27, blur: 7 },
    { right: "7%", top: "9%", width: 150, height: 54, opacity: 0.20, blur: 8 },
    { left: "5%", bottom: "12%", width: 75, height: 38, opacity: 0.15, blur: 8 },
    { right: "8%", bottom: "14%", width: 100, height: 46, opacity: 0.19, blur: 8 },
    { left: "40%", top: "3%", width: 90, height: 40, opacity: 0.13, blur: 8 },
  ];

  return (
    <div className={`fixed inset-0 overflow-hidden z-0 ${className}`}>
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
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-[-10]">
        <div
          className="absolute inset-0 w-screen h-screen bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>
      
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
      
      {/* Sky Cloud Mascot */}
      {showMascot && (
        <div className="fixed bottom-4 right-4 z-30 select-none pointer-events-none flex flex-col items-center">
          <span
            className="block bg-cloud-100 rounded-full shadow-md"
            style={{
              width: "62px",
              height: "40px",
              filter: "blur(0.7px)",
              opacity: 0.94,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Smile
              className="text-skyhug-400 drop-shadow"
              size={34}
              style={{ position: "absolute", left: "14px", top: "6px" }}
            />
          </span>
          <span className="text-xs text-gray-400 mt-[-6px]">sky cloud</span>
        </div>
      )}
    </div>
  );
};

export default CloudBackground;
