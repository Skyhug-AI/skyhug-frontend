import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CloudBackground from '@/components/CloudBackground';
import EmotionalCheckInReminder from '@/components/reminders/EmotionalCheckInReminder';
import DailyGoalsCard from '@/components/goals/DailyGoalsCard';
import EncouragementFeed from '@/components/therapy/EncouragementFeed';
import { StreakVault } from '@/components/achievements/StreakVault';
import DailyMissions from '@/components/goals/DailyMissions';
import MoodChart from '@/components/progress/MoodChart';
import SessionHistoryCard from '@/components/sessions/SessionHistoryCard';
import AchievementsCard from '@/components/achievements/AchievementsCard';
import StartSessionCard from '@/components/sessions/StartSessionCard';
import StreakTracker from '@/components/achievements/StreakTracker';
import FloatingJournalButton from '@/components/journal/FloatingJournalButton';
import AffirmationCard from '@/components/affirmations/AffirmationCard';
import ProfileStatsCard from '@/components/profile/ProfileStatsCard';
const getFirstName = (fullName: string | undefined) => {
  return fullName?.split(' ')[0] || 'Friend';
};
const HomePage = () => {
  const {
    user
  } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const firstName = getFirstName(user?.name);
  const moodData = [{
    day: 'Mon',
    value: 2,
    mood: '😐',
    note: 'Feeling neutral'
  }, {
    day: 'Tue',
    value: 3,
    mood: '🙂',
    note: 'Slightly better today'
  }, {
    day: 'Wed',
    value: 1,
    mood: '😔',
    note: 'Difficult day'
  }, {
    day: 'Thu',
    value: 4,
    mood: '😄',
    note: 'Great progress'
  }, {
    day: 'Fri',
    value: 3,
    mood: '🙂',
    note: 'Steady improvement'
  }, {
    day: 'Sat',
    value: 4,
    mood: '😄',
    note: 'Feeling good'
  }, {
    day: 'Sun',
    value: 5,
    mood: '🌟',
    note: 'Excellent day'
  }];
  const sessionHistory = [{
    day: 'Monday',
    type: 'Voice Session with Serenity',
    topic: 'anxiety before presentation',
    moodBefore: '😐',
    moodAfter: '🙂'
  }, {
    day: 'Thursday',
    type: 'Reflection Journal',
    topic: 'social burnout',
    moodBefore: '😔',
    moodAfter: '😐'
  }, {
    day: 'Saturday',
    type: 'Voice Session with Serenity',
    topic: 'weekend planning',
    moodBefore: '🙂',
    moodAfter: '😄'
  }];
  return <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <FloatingJournalButton />
      
      <CloudBackground className="opacity-90" />
      
      <main className="flex-grow px-4 pt-20 pb-8 relative z-10 max-w-5xl mx-auto w-full flex flex-col gap-8">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-medium mb-2 text-foreground">
            Hi {firstName} <span className="wave">👋</span> Here's your mind check-in for today
          </h1>
          <p className="text-lg text-skyhug-600">Small steps make big shifts. Let's take one together.</p>
        </div>
        
        <section>
          <EmotionalCheckInReminder />
          <DailyGoalsCard />
          <MoodChart moodData={moodData} />
          <StreakTracker currentStreak={3} longestStreak={7} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <SessionHistoryCard sessionHistory={sessionHistory} />
            </div>
            
            <div>
              <ProfileStatsCard />
              <AchievementsCard />
              <StartSessionCard />
            </div>
          </div>
        </section>
        
 
        <section className="">
          <AffirmationCard />
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default HomePage;