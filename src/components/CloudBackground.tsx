
import React from 'react';
import { Cloud, Sparkle } from "lucide-react";

interface CloudBackgroundProps {
  className?: string;
  sunProgress?: number; // from 0 (sun at bottom) to 1 (top), for parallax
}

// Parallax multiplier helpers: closer clouds move faster.
const DOT_MULT = 14;
const CLOUD_MULT = 27;
const SPARK_MULT = 21;

const DotsCloudsSparkles = ({
  sunProgress = 0,
}: { sunProgress: number }) => {
  const floatElems = [
    ...[...Array(12)].map((_, i) => ({
      key: `dot-${i}`,
      type: "dot",
      left: `${10 + ((i * 7.5 + 15) % 80)}%`,
      topBase: 10 + ((i * 17 + 8) % 75),
      size: 4 + (i % 5) * 2,
      speed: 1 + (i % 2) * 1.2, // parallax
      opacity: 0.21 + ((i * 7) % 30) / 124,
    })),
    ...[...Array(5)].map((_, i) => ({
      key: `cloudicon-${i}`,
      type: "cloud",
      left: `${(12 + 16*i) % 90}%`,
      topBase: 8 + ((i * 13) % 58),
      size: 22 + (i % 3) * 11,
      speed: 2.3 + (i % 2) * 1.4,
      opacity: 0.13 + (i % 2) * 0.09,
    })),
    ...[...Array(5)].map((_, i) => ({
      key: `spk-${i}`,
      type: "sparkle",
      left: `${(20 + i * 17) % 88}%`,
      topBase: 16 + ((i * 11 + 6) % 66),
      size: 9 + (i % 3) * 6,
      speed: 0.9 + i * 0.77,
      opacity: 0.10 + (i % 3) * 0.10,
    })),
  ];
  return (
    <>
      {floatElems.map(el => {
        const parallax = el.type === "dot" ? DOT_MULT :
                         el.type === "cloud" ? CLOUD_MULT :
                         el.type === "sparkle" ? SPARK_MULT : 14;
        const shift = -(sunProgress || 0) * (parallax * el.speed);

        let zIndex = el.type === "dot" ? 0 : el.type === "cloud" ? 1 : 3;

        return (
          <div
            key={el.key}
            className={`absolute transition-all duration-600
              ${el.type === "dot" ? "rounded-full bg-white" : ""}
              ${el.type === "cloud" ? "blur-[2.5px]" : ""}
              ${el.type === "sparkle" ? "" : ""}
            `}
            style={{
              left: el.left,
              top: `calc(${el.topBase}% + ${shift}px)`,
              width: el.size,
              height: el.size * 0.95,
              opacity: el.opacity,
              filter:
                el.type === "dot"
                  ? "blur(0.7px)"
                  : el.type === "cloud"
                  ? "blur(2.5px) brightness(1.09) saturate(0.8)"
                  : undefined,
              zIndex,
              transition: "top 0.72s cubic-bezier(.47,0,.26,1), opacity 0.4s",
              pointerEvents: "none",
            }}
          >
            {el.type === "cloud" ? (
              <Cloud size={el.size + 2} className="text-blue-100" style={{ opacity: 0.5 }} />
            ) : el.type === "sparkle" ? (
              <Sparkle size={el.size} className="text-yellow-100" style={{ opacity: 0.22 }} />
            ) : null}
          </div>
        );
      })}
    </>
  );
};

const CloudBackground: React.FC<CloudBackgroundProps> = ({ className = '', sunProgress = 0 }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden z-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0 w-screen h-screen bg-gradient-to-br from-[#EEF2FF] via-[#F7F8FD] to-white"></div>
      
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-[#FDE1D3] to-transparent opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#E5DEFF] to-transparent opacity-30 rounded-full blur-3xl"></div>
      
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0 w-screen h-screen bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>
      
      <div className="particles-container absolute inset-0">
        <DotsCloudsSparkles sunProgress={sunProgress} />
      </div>
      
      {/* Card cloud shapes (lowered opacity/blur for dreamy effect) */}
      <div className="cloud w-32 h-20 top-[10%] left-[5%] animate-float-cloud" 
           style={{animationDuration: '20s', animationDelay: '0s', opacity: 0.43, filter: 'blur(2.5px)' }}></div>
      <div className="cloud w-40 h-24 top-[15%] right-[10%] animate-float-cloud" 
           style={{animationDuration: '24s', animationDelay: '1.5s', opacity: 0.42, filter: 'blur(2.5px)' }}></div>
      <div className="cloud w-28 h-16 bottom-[30%] left-[15%] animate-float-cloud" 
           style={{animationDuration: '26s', animationDelay: '3s', opacity: 0.36, filter: 'blur(2.5px)' }}></div>
      <div className="cloud w-36 h-20 bottom-[20%] right-[20%] animate-float-cloud" 
           style={{animationDuration: '28s', animationDelay: '4.5s', opacity: 0.34, filter: 'blur(2.6px)' }}></div>
      <div className="cloud w-24 h-14 top-[50%] left-[50%] animate-float-cloud"
           style={{animationDuration: '22s', animationDelay: '2s', opacity: 0.38, filter: 'blur(2.8px)' }}></div>
    </div>
  );
};

export default CloudBackground;
