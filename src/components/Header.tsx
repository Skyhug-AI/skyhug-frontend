import React from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { LogIn, UserPlus, LogOut, User, Settings, Sparkles, Award, LayoutDashboard, Search, Play } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.'
    });
    navigate('/');
  };

  const calmPoints = 720;

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
        {/* Removed the "Start a Session" button from here */}
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full p-0 px-4 border-gray-100 gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-skyhug-100 text-skyhug-500 text-sm">
                    {user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium flex items-center gap-2">
                  {user?.name || 'User'}
                  <Sparkles className="h-4 w-4 text-skyhug-500" />
                  <span className="text-skyhug-500 font-medium">{calmPoints}</span>
                </span>
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
              <DropdownMenuItem className="cursor-pointer">
                <Award className="mr-2 h-4 w-4" />
                <span>Achievements</span>
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

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <LayoutDashboard className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-6 pt-10">
              {isAuthenticated && <button onClick={() => navigate('/home')} className={`transition-colors ${location.pathname === '/home' ? 'text-skyhug-500' : 'text-foreground hover:text-skyhug-500'} text-lg py-2`}>
                  Dashboard
                </button>}
              <button 
                onClick={() => navigate('/session')} 
                className={`transition-colors ${location.pathname === '/session' ? 'text-skyhug-500' : 'text-foreground hover:text-skyhug-500'} text-lg py-2`}
              >
                Start a Session
              </button>
              <button 
                onClick={() => navigate('/therapists')} 
                className={`transition-colors ${location.pathname === '/therapists' ? 'text-skyhug-500' : 'text-foreground hover:text-skyhug-500'} text-lg py-2`}
              >
                Find a Therapist
              </button>
              
              <button onClick={() => navigate('/')} className={`transition-colors ${location.pathname === '/' ? 'text-skyhug-500' : 'text-foreground hover:text-skyhug-500'} text-lg py-2`}>
                Landing
              </button>
              <button className="text-foreground hover:text-skyhug-500 transition-colors text-lg py-2">
                About
              </button>
              
              {isAuthenticated ? <div className="pt-4 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 bg-skyhug-100 rounded-full flex items-center justify-center text-skyhug-500">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{user?.name || 'User'}</p>
                      <p className="text-muted-foreground text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full justify-start mb-2" onClick={() => navigate('/home')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button variant="outline" className="w-full justify-start mb-2" onClick={() => navigate('/sessions')}>
                    Session History
                  </Button>
                  <Button variant="outline" className="w-full justify-start mb-2" onClick={() => navigate('/therapists')}>
                    <Search className="mr-2 h-4 w-4" />
                    Find a Therapist
                  </Button>
                  <Button variant="outline" className="w-full justify-start mb-2" onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div> : <div className="flex flex-col gap-3 pt-4 border-t">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/login')}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                  <Button variant="default" className="w-full justify-start bg-skyhug-500 hover:bg-skyhug-600" onClick={() => navigate('/signup')}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </div>}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
