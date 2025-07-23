
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User, Trash2, Save, Lock, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/context/TherapistContext';

const SettingsForm = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentTherapist } = useTherapist();
  
  // Form state
  const [name, setName] = useState(user?.name || '');
  const [userDescription, setUserDescription] = useState('');
  const [localStorageOnly, setLocalStorageOnly] = useState(true);
  
  // Current therapist info
  const therapists = {
    'olivia': {
      name: 'Olivia',
      specialty: 'Anxiety, Depression',
      avatar: '/therapists/olivia.svg',
      bgColor: 'bg-purple-100'
    },
    'logan': {
      name: 'Logan',
      specialty: 'Productivity, Stress',
      avatar: '/therapists/logan.svg',
      bgColor: 'bg-blue-100'
    },
    'sarah': {
      name: 'Sarah',
      specialty: 'Grief, Relationships',
      avatar: '/therapists/sarah.svg',
      bgColor: 'bg-green-100'
    },
    'james': {
      name: 'James',
      specialty: 'Career, Self-esteem',
      avatar: '/therapists/james.svg',
      bgColor: 'bg-orange-100'
    },
    'maya': {
      name: 'Maya',
      specialty: 'Trauma, Mindfulness',
      avatar: '/therapists/maya.svg',
      bgColor: 'bg-yellow-100'
    },
    'dr-sky': {
      name: 'Sky',
      specialty: '',
      avatar: '/sky-avatar.png',
      bgColor: 'bg-blue-50'
    },
  };
  
  const selectedTherapist = therapists['dr-sky']; // Default to Sky for now
  
  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    // For now, just show a success message
    toast({
      title: 'Settings saved',
      description: 'Your profile settings have been updated.',
    });
  };
  
  const handleDeleteData = () => {
    // In a real app, this would delete user data
    toast({
      title: 'Data deleted',
      description: 'All your data has been deleted. You will be logged out.',
      variant: 'destructive',
    });
    
    // Simulate logout after data deletion
    setTimeout(() => {
      logout();
    }, 1500);
  };
  
  const handleChooseNewTherapist = () => {
    navigate('/therapist-selection');
  };
  
  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Profile
          </CardTitle>
          <CardDescription>
            Manage your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Username</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={user?.email || ''} 
              disabled 
              placeholder="Your email"
              className="opacity-70"
            />
            <p className="text-xs text-muted-foreground">
              Your email cannot be changed.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="user-description">About You</Label>
            <Textarea
              id="user-description"
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              placeholder="Tell us about yourself, your career, interests, and what brings you here..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              This information helps our AI provide more personalized therapy sessions.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Current Therapist - Simplified */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Your Therapist
          </CardTitle>
          <CardDescription>
            View or change your current therapist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
            <div className={`${selectedTherapist.bgColor} w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0`}>
              <Avatar className="w-14 h-14 border-2 border-white">
                <AvatarFallback>{selectedTherapist.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-medium text-lg">{selectedTherapist.name}</h3>
              {selectedTherapist.specialty && (
                <p className="text-muted-foreground">{selectedTherapist.specialty}</p>
              )}
            </div>
            
            {/* <Button variant="outline" onClick={handleChooseNewTherapist} className="flex-shrink-0">
              Choose New Therapist
            </Button> */}
          </div>
        </CardContent>
      </Card>
      
      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Control your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="storage">Local storage only</Label>
              <p className="text-sm text-muted-foreground">
                Keep all your data on this device only
              </p>
            </div>
            <Switch 
              id="storage" 
              checked={localStorageOnly} 
              onCheckedChange={setLocalStorageOnly} 
            />
          </div>
          
          <div className="pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete My Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    data and remove your account from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteData}>
                    Yes, delete my data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="px-6">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsForm;
