
import React from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { Menu, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <Logo />
      
      <div className="hidden md:flex items-center gap-8">
        <nav className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')}
            className="text-foreground hover:text-serenity-500 transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/chat')}
            className="text-foreground hover:text-serenity-500 transition-colors"
          >
            Chat
          </button>
          <button 
            onClick={() => navigate('/voice')}
            className="text-foreground hover:text-serenity-500 transition-colors"
          >
            Voice
          </button>
          <button 
            className="text-foreground hover:text-serenity-500 transition-colors"
          >
            About
          </button>
        </nav>
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full border-serenity-200 gap-2">
                <User className="h-4 w-4" />
                {user?.name || 'User'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-foreground hover:text-serenity-500 hover:bg-serenity-50"
              onClick={() => navigate('/login')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button 
              variant="default" 
              className="bg-serenity-500 hover:bg-serenity-600 text-white rounded-full"
              onClick={() => navigate('/signup')}
            >
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
              <button 
                onClick={() => navigate('/')}
                className="text-foreground hover:text-serenity-500 transition-colors text-lg py-2"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="text-foreground hover:text-serenity-500 transition-colors text-lg py-2"
              >
                Chat
              </button>
              <button 
                onClick={() => navigate('/voice')}
                className="text-foreground hover:text-serenity-500 transition-colors text-lg py-2"
              >
                Voice
              </button>
              <button 
                className="text-foreground hover:text-serenity-500 transition-colors text-lg py-2"
              >
                About
              </button>
              
              {isAuthenticated ? (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 bg-serenity-100 rounded-full flex items-center justify-center text-serenity-500">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{user?.name || 'User'}</p>
                      <p className="text-muted-foreground text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/login')}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                  <Button 
                    variant="default" 
                    className="w-full justify-start bg-serenity-500 hover:bg-serenity-600"
                    onClick={() => navigate('/signup')}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
