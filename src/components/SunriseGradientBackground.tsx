
import React from "react";

interface SunriseGradientBackgroundProps {
  className?: string;
}

const SunriseGradientBackground: React.FC<SunriseGradientBackgroundProps> = ({ className = "" }) => (
  <div
    className={`fixed inset-0 w-full h-full pointer-events-none -z-10 ${className}`}
    style={{
      background: "linear-gradient(180deg, #ffe1b5 0%, #ffe9d2 35%, #ffb2cb 60%, #e6deff 100%)",
      opacity: 0.8,
    }}
    aria-hidden="true"
  />
);

export default SunriseGradientBackground;
