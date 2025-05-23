
import React from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { Menu, LogIn, UserPlus, LogOut, User, Settings, Sparkles, Award, BookMarked, Bell, LayoutDashboard, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      <Logo />
      
      <div className="hidden md:flex items-center gap-8">
        <nav className="flex items-center gap-6">
          {isAuthenticated && <button onClick={() => navigate('/home')} className={`transition-colors ${location.pathname === '/home' ? 'text-skyhug-500' : 'text-foreground hover:text-skyhug-500'}`}>
              Dashboard
            </button>}
          <button 
            onClick={() => navigate('/session')} 
            className={`transition-colors ${location.pathname === '/session' ? 'text-skyhug-500' : 'text-foreground hover:text-skyhug-500'}`}
          >
            Start a Session
          </button>
          <button 
            onClick={() => navigate('/therapists')} 
            className={`transition-colors ${location.pathname === '/therapists' ? 'text-skyhug-500' : 'text-foreground hover:text-skyhug-500'}`}
          >
            Find a Therapist
          </button>
        </nav>
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full border-skyhug-200 gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-skyhug-100 text-skyhug-500 text-sm">
                    {user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium flex items-center gap-2">
                  {user?.name || 'User'}
                  <span className="text-skyhug-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {calmPoints}
                  </span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>{calmPoints} Calm Points</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Award className="mr-2 h-4 w-4" />
                <span>Earned Badges</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BookMarked className="mr-2 h-4 w-4" />
                <span>My Calm Kit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
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
            <Button variant="ghost" className="text-foreground hover:text-skyhug-500 hover:bg-skyhug-50" onClick={() => navigate('/login')}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button variant="default" className="bg-skyhug-500 hover:bg-skyhug-600 text-white rounded-full" onClick={() => navigate('/signup')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
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
