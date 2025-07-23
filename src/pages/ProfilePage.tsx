import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Edit, Sparkles, Save, User, Heart, Brain, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
// import { StreakVault } from '@/components/achievements/StreakVault';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    age: '',
    gender: '',
    career: '',
    sexual_preferences: '',
    topics_on_mind: [] as string[],
    self_diagnosed_issues: [] as string[],
    agreeable_slider: 50,
    calm_points: 0
  });

  const [newTopic, setNewTopic] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const calmPoints = profileData.calm_points;
  console.log('Current calm points in component:', calmPoints, 'Raw profileData:', profileData);

  // Load user profile data
  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user?.id]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        console.log('Loaded profile data:', data); // Debug log
        setProfileData({
          age: data.age?.toString() || '',
          gender: data.gender || '',
          career: data.career || '',
          sexual_preferences: data.sexual_preferences || '',
          topics_on_mind: data.topics_on_mind || [],
          self_diagnosed_issues: (data.self_diagnosed_issues as unknown as string[]) || [],
          agreeable_slider: data.agreeable_slider || 50,
          calm_points: data.calm_points || 0
        });
      } else {
        console.log('No profile data found, using defaults'); // Debug log
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        user_id: user?.id,
        age: profileData.age ? parseInt(profileData.age) : null,
        gender: profileData.gender || null,
        career: profileData.career || null,
        sexual_preferences: profileData.sexual_preferences || null,
        topics_on_mind: profileData.topics_on_mind.length > 0 ? profileData.topics_on_mind : null,
        self_diagnosed_issues: profileData.self_diagnosed_issues.length > 0 ? profileData.self_diagnosed_issues : null,
        agreeable_slider: profileData.agreeable_slider
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(dataToSave as any, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile changes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addTopic = () => {
    if (newTopic.trim() && !profileData.topics_on_mind.includes(newTopic.trim())) {
      setProfileData(prev => ({
        ...prev,
        topics_on_mind: [...prev.topics_on_mind, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setProfileData(prev => ({
      ...prev,
      topics_on_mind: prev.topics_on_mind.filter(t => t !== topic)
    }));
  };

  const addCondition = () => {
    if (newCondition.trim() && !profileData.self_diagnosed_issues.includes(newCondition.trim())) {
      setProfileData(prev => ({
        ...prev,
        self_diagnosed_issues: [...prev.self_diagnosed_issues, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    setProfileData(prev => ({
      ...prev,
      self_diagnosed_issues: prev.self_diagnosed_issues.filter(c => c !== condition)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-muted-foreground">Loading profile...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col">
        <div className="bg-serenity-50 py-6 px-4 md:px-8 border-b border-border">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              {isEditing ? 'Edit your profile information' : 'View and manage your profile information'}
            </p>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col bg-gradient-to-b from-white to-serenity-50 p-4 md:p-8">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-20 w-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl text-white font-medium">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-purple-500">{calmPoints} Calm Points</span>
                    </div>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Enter your age"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{profileData.age || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{profileData.gender || 'Not specified'}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="career">Career/Profession</Label>
                  {isEditing ? (
                    <Input
                      id="career"
                      value={profileData.career}
                      onChange={(e) => setProfileData(prev => ({ ...prev, career: e.target.value }))}
                      placeholder="What do you do for work?"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profileData.career || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sexual_preferences">Sexual Preferences</Label>
                  {isEditing ? (
                    <Select value={profileData.sexual_preferences} onValueChange={(value) => setProfileData(prev => ({ ...prev, sexual_preferences: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sexual preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heterosexual">Heterosexual</SelectItem>
                        <SelectItem value="homosexual">Homosexual</SelectItem>
                        <SelectItem value="bisexual">Bisexual</SelectItem>
                        <SelectItem value="pansexual">Pansexual</SelectItem>
                        <SelectItem value="asexual">Asexual</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profileData.sexual_preferences || 'Not specified'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mental Health & Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Mental Health & Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topics_on_mind">Topics on Your Mind</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="Add a topic..."
                          onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                        />
                        <Button type="button" onClick={addTopic} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profileData.topics_on_mind.map((topic, index) => (
                          <div key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                            {topic}
                            <button onClick={() => removeTopic(topic)} className="ml-1 text-purple-600 hover:text-purple-800">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.topics_on_mind.length > 0 ? (
                        profileData.topics_on_mind.map((topic, index) => (
                          <div key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                            {topic}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No topics specified</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="self_diagnosed_issues">Self Diagnosed Mental Health Conditions (eg. depression)</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          placeholder="Add a condition..."
                          onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                        />
                        <Button type="button" onClick={addCondition} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profileData.self_diagnosed_issues.map((condition, index) => (
                          <div key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                            {condition}
                            <button onClick={() => removeCondition(condition)} className="ml-1 text-red-600 hover:text-red-800">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.self_diagnosed_issues.length > 0 ? (
                        profileData.self_diagnosed_issues.map((condition, index) => (
                          <div key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                            {condition}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No conditions specified</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Agreeableness Level: {profileData.agreeable_slider}</Label>
                  {isEditing ? (
                    <div className="mt-2">
                      <Slider
                        value={[profileData.agreeable_slider]}
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, agreeable_slider: value[0] }))}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Less Agreeable</span>
                        <span>More Agreeable</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${profileData.agreeable_slider}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Less Agreeable</span>
                        <span>More Agreeable</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* <StreakVault /> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
