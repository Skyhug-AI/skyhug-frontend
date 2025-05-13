
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CloudBackground from "@/components/CloudBackground";
import EmotionalCheckInReminder from "@/components/reminders/EmotionalCheckInReminder";
import DailyGoalsCard from "@/components/goals/DailyGoalsCard";
import MoodChart from "@/components/progress/MoodChart";
import StreakTracker from "@/components/achievements/StreakTracker";
import FloatingJournalButton from "@/components/journal/FloatingJournalButton";
import AffirmationCard from "@/components/affirmations/AffirmationCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MoodSelectionDialog from "@/components/mood/MoodSelectionDialog";
import { toast } from "@/hooks/use-toast";

const getFirstName = (fullName: string | undefined) => {
  return fullName?.split(" ")[0] || "Friend";
};

const HomePage = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const firstName = getFirstName(user?.name);
  const navigate = useNavigate();

  const moodData = [
    {
      day: "Mon",
      value: 2,
      mood: "😐",
      note: "Feeling neutral",
    },
    {
      day: "Tue",
      value: 3,
      mood: "🙂",
      note: "Slightly better today",
    },
    {
      day: "Wed",
      value: 1,
      mood: "😔",
      note: "Difficult day",
    },
    {
      day: "Thu",
      value: 4,
      mood: "😄",
      note: "Great progress",
    },
    {
      day: "Fri",
      value: 3,
      mood: "🙂",
      note: "Steady improvement",
    },
    {
      day: "Sat",
      value: 4,
      mood: "😄",
      note: "Feeling good",
    },
    {
      day: "Sun",
      value: 5,
      mood: "🌟",
      note: "Excellent day",
    },
  ];

  const handleGoalClick = (type: string) => {
    if (type === 'session') {
      navigate("/session");
    } else if (type === 'mood') {
      // Open mood selection dialog
      setMoodDialogOpen(true);
    }
  };

  const handleMoodSelect = () => {
    // Update the goals list to show completion
    setSelectedMood(3);
    
    // Close the dialog
    setMoodDialogOpen(false);
    
    // Add points notification could go here
    toast({
      title: "Mood logged successfully!",
      description: "You earned +10 Calm Points",
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
      <CloudBackground />
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* <FloatingJournalButton /> */}

      <main className="flex-grow p-6 md:p-8 space-y-6 relative z-10 max-w-5xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Welcome back, {firstName} <span className="wave">👋</span>
          </h1>
          <p className="text-sm text-gray-500">You've earned 720 Calm Points 🌟</p>
        </div>

        {/* Action: Start Session CTA */}
        <div className="rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 p-6 flex flex-col md:flex-row justify-between items-center shadow-sm">
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              Need a quick check-in?
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tap below to begin a voice or reflection session.
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            onClick={() => navigate("/session")}
          >
            Start Session
          </Button>
        </div>

        {/* Goals + Calm Points */}
        <div className="rounded-lg border p-6 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Today's Goals</h3>
            <span className="text-sm text-gray-500">20/100 Calm Points</span>
          </div>

          <div className="relative">
            <Progress value={20} className="h-3 rounded-full" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            <span className="absolute left-0 top-4 text-xs text-gray-500">20% complete</span>
          </div>

          <ul className="space-y-3 text-sm text-gray-700 mt-10">
            <li 
              className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100 hover:shadow-sm"
              onClick={() => handleGoalClick('session')}
            >
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Completing a session</span>
              </div>
              <div className="flex items-center">
                <span className="text-indigo-600 font-semibold">+50</span>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </div>
            </li>
            <li 
              className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100 hover:shadow-sm"
              onClick={() => handleGoalClick('mood')}
            >
              <div className="flex items-center">
                <span className="mr-2">😊</span>
                <span>Mood check-in</span>
              </div>
              <div className="flex items-center">
                <span className="text-indigo-600 font-semibold">+10</span>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </div>
            </li>
          </ul>
        </div>

        {/* Mood Selection Dialog */}
        <MoodSelectionDialog 
          open={moodDialogOpen} 
          onOpenChange={setMoodDialogOpen}
          onMoodSelect={handleMoodSelect}
        />

        {/* <section className="space-y-4"> */}
        {/* <MoodChart moodData={moodData} /> */}
        {/* <StreakTracker currentStreak={3} longestStreak={7} /> */}
        {/* </section> */}

        <section>
          <AffirmationCard />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
