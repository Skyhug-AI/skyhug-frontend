
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { Switch } from '@/components/ui/switch';
import { User, Trash2, Save, Lock, SlidersHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const SettingsForm = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState(user?.name || '');
  const [selectedTherapistId, setSelectedTherapistId] = useState('dr-sky');
  const [therapistStyle, setTherapistStyle] = useState([50]); // Middle of the scale (0-100)
  const [localStorageOnly, setLocalStorageOnly] = useState(true);
  
  // Therapist options
  const therapists = [
    { id: 'dr-sky', name: 'Dr. Sky', specialty: 'General Wellness', avatar: '/sky-avatar.png' },
    { id: 'dr-morgan', name: 'Dr. Morgan', specialty: 'Anxiety', avatar: '/morgan-avatar.png' },
    { id: 'dr-taylor', name: 'Dr. Taylor', specialty: 'Depression', avatar: '/taylor-avatar.png' },
    { id: 'dr-jordan', name: 'Dr. Jordan', specialty: 'Stress Management', avatar: '/jordan-avatar.png' },
    { id: 'dr-alex', name: 'Dr. Alex', specialty: 'Trauma', avatar: '/alex-avatar.png' },
  ];
  
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
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name"
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
        </CardContent>
      </Card>
      
      {/* Therapist Preferences - Updated */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Therapist Preferences
          </CardTitle>
          <CardDescription>
            Customize your therapy experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Select your preferred therapist</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {therapists.map(therapist => (
                <div 
                  key={therapist.id}
                  className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTherapistId === therapist.id 
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTherapistId(therapist.id)}
                >
                  <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                    <AvatarFallback>{therapist.name[0]}{therapist.name.split(' ')[1]?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{therapist.name}</p>
                    <p className="text-xs text-muted-foreground">{therapist.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Therapist interaction style</Label>
            
            <div className="space-y-6 pt-2">
              <div>
                <div className="mb-4">
                  <Slider 
                    value={therapistStyle} 
                    onValueChange={setTherapistStyle} 
                    max={100} 
                    step={1}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>More agreeable</span>
                  <span>More challenging</span>
                </div>
              </div>
              
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2">What does this mean?</h4>
                <p className="text-sm text-muted-foreground">
                  {therapistStyle[0] < 33 ? (
                    "Your therapist will be more supportive and agreeable, focusing on validation and emotional support."
                  ) : therapistStyle[0] < 66 ? (
                    "Your therapist will balance support with gentle challenging, helping you reflect on your thoughts and behaviors."
                  ) : (
                    "Your therapist will more frequently challenge your perspectives and help you explore alternatives and growth opportunities."
                  )}
                </p>
              </div>
            </div>
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
