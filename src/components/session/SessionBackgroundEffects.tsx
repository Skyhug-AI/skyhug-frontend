
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
      {/* Subtle horizon/sunrise gradient background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(to top, #fde1d3 0%, #fdf6e3 45%, #f6f9ff 95%)",
          opacity: 1,
        }}
      />

      {/* Soft sun/orb "rise" at bottom center */}
      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: "-18%",
          transform: "translateX(-50%)",
          width: 350,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, #fde1d3 0%, #ffe29f 50%, rgba(252,242,217,0.11) 100%)",
          boxShadow: "0 0 70px 58px #fde1d399, 0 0 220px 120px #ffd5b2cc",
          filter: "blur(4px)",
          opacity: 0.90,
          animation: "float-sun 12s ease-in-out infinite",
        }}
      />

      {/* Optional: faint mirrored glow above "sun" for glow effect */}
      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: "6%",
          transform: "translateX(-50%)",
          width: 180,
          height: 70,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 38%, #fff7ed33 0%, #fbed9677 95%)",
          filter: "blur(18px)",
          opacity: 0.41,
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

      {/* Ultra sparse sparkles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute opacity-25 rounded-full"
          style={{
            width: `${Math.random() * 7 + 3}px`,
            height: `${Math.random() * 7 + 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: "radial-gradient(circle, #fbed96 52%, white 100%)",
            filter: "blur(1.1px)",
            animation: `float-cloud ${Math.random() * 9 + 11}s infinite`,
            animationDelay: `${Math.random() * 8}s`,
            zIndex: 2,
          }}
        />
      ))}
    </div>
  );
};

export default SessionBackgroundEffects;
