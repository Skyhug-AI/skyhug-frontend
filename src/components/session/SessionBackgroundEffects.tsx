
import React from "react";

// Subtle horizon/sunrise background: warm-to-white gradient with soft sun and clouds
const SessionBackgroundEffects: React.FC = () => {
  // Cloud positions/sizes for soft, non-distracting clouds
  const clouds = [
    { left: "5%", top: "7%", w: 200, h: 90, color: "rgba(250,238,210,0.36)", blur: 8 },
    { left: "65%", top: "3%", w: 280, h: 98, color: "rgba(240,230,255,0.30)", blur: 14 },
    { left: "36%", top: "18%", w: 190, h: 80, color: "rgba(245,240,220,0.20)", blur: 10 },
    { left: "72%", top: "33%", w: 150, h: 60, color: "rgba(230,232,219,0.18)", blur: 10 },
    { left: "7%", top: "62%", w: 140, h: 65, color: "rgba(240,220,235,0.16)", blur: 10 },
    { left: "40%", top: "74%", w: 230, h: 110, color: "rgba(246,237,178,0.15)", blur: 13 },
  ];

  // Add CSS animations for float effects
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes float-cloud {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-9px) translateX(5px); }
      }
      @keyframes float-sun {
        0%, 100% { transform: translateY(0) scale(1);}
        50% { transform: translateY(-8px) scale(1.07);}
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Removed sunrise gradient */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(to bottom right, #EEF2FF, #F7F8FD, #EEF4FD)",
          opacity: 1,
        }}
      />

      {/* Soft, warm sun-like orb */}
      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: "-10%",
          transform: "translateX(-50%)",
          width: 300,
          height: 140,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FEF7CD 0%, #FEC6A1 50%, #FF9800 100%)",
          boxShadow: "0 0 50px 20px rgba(254, 199, 161, 0.3)",
          opacity: 0.8,
          zIndex: -2,
          filter: "blur(12px)",
          animation: "float-sun 4s ease-in-out infinite",
        }}
      />

      {/* Fluffy, blurred pastel clouds */}
      {clouds.map((cloud, i) => (
        <div
          key={`cloud-${i}`}
          style={{
            position: "absolute",
            left: cloud.left,
            top: cloud.top,
            width: cloud.w,
            height: cloud.h,
            background: cloud.color,
            opacity: 1,
            filter: `blur(${cloud.blur}px)`,
            animation: `float-cloud ${10 + i * 3}s ease-in-out infinite`,
            zIndex: 1,
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
};

export default SessionBackgroundEffects;

