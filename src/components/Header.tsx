
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { LogIn, UserPlus, LogOut, User, Settings, Sparkles, Award, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTherapist } from '@/context/TherapistContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();
  const { endConversation } = useTherapist();
  const { toast } = useToast();
  const [calmPoints, setCalmPoints] = useState(0);

  const handleEndSession = async () => {
    await endConversation();
    navigate("/home");
  };

  // Load calm points from database
  useEffect(() => {
    if (user?.id && isAuthenticated) {
      loadCalmPoints();
    }
  }, [user?.id, isAuthenticated]);

  const loadCalmPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('calm_points')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCalmPoints(data.calm_points || 0);
      }
    } catch (error) {
      console.error('Error loading calm points:', error);
      setCalmPoints(0);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.'
    });
    navigate('/');
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 flex items-center justify-between bg-white sticky top-0 z-50 border-b border-border shadow-sm">
      {/* Left: Logo */}
      <Logo />
      
      {/* Center: Empty */}
      <div className="hidden md:flex items-center">
        {/* Empty center as requested */}
      </div>
      
      {/* Right: Session CTA + Profile */}
      <div className="flex items-center gap-3">
        {/* End Chat button - only show on /session route */}
        {location.pathname === '/session' && isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={handleEndSession}
          >
            End Chat & Continue
          </Button>
        )}
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="rounded-full p-2 px-4 hover:bg-gray-50 transition-all duration-300 gap-3"
              >
                <Avatar className="h-8 w-8 ring-2 ring-purple-200/50">
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white text-sm font-semibold">
                    {user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {user?.name || 'User'}
                  </span>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    {calmPoints}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/home')} className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="glass-panel text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-white/90 transition-all duration-300 shadow-lg flex items-center gap-2 hover:scale-105"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white px-4 py-2 rounded-full font-medium hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg flex items-center gap-2 hover:scale-105"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
