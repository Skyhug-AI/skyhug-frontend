
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { StreakVault } from '@/components/achievements/StreakVault';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const calmPoints = 720;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col">
        <div className="bg-serenity-50 py-6 px-4 md:px-8 border-b border-border">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your profile information
            </p>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col bg-gradient-to-b from-white to-serenity-50 p-4 md:p-8">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-20 w-20 bg-skyhug-100 rounded-full flex items-center justify-center text-2xl text-skyhug-500 font-medium">
                    {user?.name?.[0]?.toLowerCase() || 'u'}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/settings')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-skyhug-500" />
                    <span className="font-medium">Calm Points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-3 py-1 rounded-full text-lg font-semibold shadow-sm flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      {calmPoints}
                    </div>
                  </div>
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
