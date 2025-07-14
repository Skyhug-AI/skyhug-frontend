
import React from 'react';

interface CloudBackgroundProps {
  className?: string;
}

const CloudBackground: React.FC<CloudBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden z-10 ${className}`}>
      {/* Enhanced gradient background with more vibrant colors - made more transparent */}
      <div className="absolute inset-0 w-screen h-screen bg-gradient-to-br from-[#EEF2FF]/30 via-[#F0F4FE]/30 to-[#E8F2FF]/30"></div>
      
      {/* More colorful accent gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-[#FFE4E1] via-[#FFF0E6] to-transparent opacity-40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#E5DEFF] via-[#F0E6FF] to-transparent opacity-40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-gradient-to-br from-[#E6F7FF] via-[#F0FAFF] to-transparent opacity-35 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-1/4 h-1/4 bg-gradient-to-tr from-[#FFF5E6] via-[#FFFAF0] to-transparent opacity-35 rounded-full blur-3xl"></div>
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
        <div
          className="absolute inset-0 w-screen h-screen bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>
      
      {/* Sparkles (Duolingo-style) floating particles */}
      <div className="particles-container absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-70 animate-float"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
        
        {/* Star-shaped particles (subtle) */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white opacity-50 animate-pulse-slow"
            style={{
              width: `${Math.random() * 8 + 5}px`,
              height: `${Math.random() * 8 + 5}px`,
              clipPath:
                'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 4 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Decorative clouds with enhanced floating animation */}
      <div
        className="cloud w-32 h-20 top-[10%] left-[5%] animate-float-cloud"
        style={{ animationDuration: '18s', animationDelay: '0s' }}
      ></div>
      <div
        className="cloud w-40 h-24 top-[15%] right-[10%] animate-float-cloud"
        style={{ animationDuration: '22s', animationDelay: '1.5s' }}
      ></div>
      <div
        className="cloud w-28 h-16 bottom-[30%] left-[15%] animate-float-cloud"
        style={{ animationDuration: '20s', animationDelay: '3s' }}
      ></div>
      <div
        className="cloud w-36 h-20 bottom-[20%] right-[20%] animate-float-cloud"
        style={{ animationDuration: '24s', animationDelay: '4.5s' }}
      ></div>
      <div
        className="cloud w-24 h-14 top-[50%] left-[50%] animate-float-cloud"
        style={{ animationDuration: '19s', animationDelay: '2s' }}
      ></div>
      {/* Additional floating clouds for more movement */}
      <div
        className="cloud w-30 h-18 top-[35%] right-[5%] animate-float-cloud"
        style={{ animationDuration: '25s', animationDelay: '6s' }}
      ></div>
      <div
        className="cloud w-26 h-15 bottom-[45%] left-[8%] animate-float-cloud"
        style={{ animationDuration: '21s', animationDelay: '7.5s' }}
      ></div>
    </div>
  );
};

export default CloudBackground;

