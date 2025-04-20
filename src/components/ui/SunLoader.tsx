
import React from "react";
import { Sun } from "lucide-react";

const SunLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-48">
    <div className="relative">
      {/* Outer ray ring */}
      <div className="absolute inset-0 flex items-center justify-center animate-[spin_3s_linear_infinite]">
        <div className="w-28 h-28 rounded-full border-4 border-blue-100 border-t-blue-400 border-b-yellow-300" />
      </div>
      {/* Inner pulsing sun */}
      <div className="flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tl from-[#FEF7CD] via-[#FEC6A1] to-[#33C3F0] shadow-lg animate-[pulse-slow_2s_ease-in-out_infinite] flex items-center justify-center">
          <Sun size={48} className="text-yellow-400 drop-shadow" />
        </div>
      </div>
    </div>
    <div className="mt-6 text-base font-medium text-blue-700 animate-fade-in">
      Starting session...
    </div>
  </div>
);

export default SunLoader;

