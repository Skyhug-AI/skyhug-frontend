import React from 'react';
import { Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Logo = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/home');
    }
  };

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer group" 
      onClick={handleLogoClick}
    >
      <div className="relative">
        <div 
          className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#ADCFF8] to-[#CDB4DB] flex items-center justify-center shadow-md"
          style={{ 
            boxShadow: '0 0 12px rgba(189, 224, 254, 0.25), 0 4px 10px rgba(180, 170, 255, 0.3)' 
          }}
        >
          <div className="absolute inset-1 bg-white/20 rounded-full blur-sm"></div>
          
          <Cloud 
            className="h-5 w-5 text-white relative z-10" 
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          
          <div className="absolute top-0.5 right-0.5 transition-all animate-pulse-slow">
            <svg 
              width="10" 
              height="10" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white opacity-90"
              style={{ filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))' }}
            >
              <path 
                d="M12 3L13.4328 9.23607L19.0622 6.93782L15.2639 12L19.0622 17.0622L13.4328 14.7639L12 21L10.5672 14.7639L4.93782 17.0622L8.73607 12L4.93782 6.93782L10.5672 9.23607L12 3Z" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <span 
        className="font-['Plus_Jakarta_Sans'] font-medium text-xl text-foreground tracking-[0.5px] group-hover:text-[#ADCFF8] transition-colors"
      >
        skyhug
      </span>
    </div>
  );
};

export default Logo;
