import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CloudBackground from '@/components/CloudBackground';
import EmotionalCheckInReminder from '@/components/reminders/EmotionalCheckInReminder';
import DailyGoalsCard from '@/components/goals/DailyGoalsCard';
import MoodChart from '@/components/progress/MoodChart';
import StreakTracker from '@/components/achievements/StreakTracker';
import FloatingJournalButton from '@/components/journal/FloatingJournalButton';
import AffirmationCard from '@/components/affirmations/AffirmationCard';

const getFirstName = (fullName: string | undefined) => {
  return fullName?.split(' ')[0] || 'Friend';
};

const HomePage = () => {
  const { user } = useAuth();
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

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-[#f8f6fc] to-[#eef4fd]">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <FloatingJournalButton />
      
      <CloudBackground className="opacity-90" />
      
      <main className="flex-grow px-4 pt-20 pb-8 relative z-10 max-w-5xl mx-auto w-full flex flex-col gap-8">
        <div className="text-center mb-4 relative">
          <div className="absolute -right-4 top-0 md:right-20 animate-bounce-slow">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
              <img 
                src="/sky-mascot.png" 
                alt="Sky mascot" 
                className="w-12 h-12 md:w-16 md:h-16"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23a0c4ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'%3E%3C/path%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium mb-2 text-foreground">
            Hi {firstName} <span className="wave">👋</span> Here's your mind check-in for today
          </h1>
          <p className="text-lg text-[#858ca5] font-normal">Small steps make big shifts. Let's take one together.</p>
        </div>
        
        <section>
          <EmotionalCheckInReminder />
          <DailyGoalsCard />
          <MoodChart moodData={moodData} />
          <StreakTracker currentStreak={3} longestStreak={7} />
        </section>

        <section className="">
          <AffirmationCard />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
