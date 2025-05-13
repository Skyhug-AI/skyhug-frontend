
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

const getFirstName = (fullName: string | undefined) => {
  return fullName?.split(" ")[0] || "Friend";
};

const HomePage = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
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

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
      <CloudBackground />
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* <FloatingJournalButton /> */}

      <main className="flex-grow p-6 md:p-10 space-y-6 relative z-10 max-w-5xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back, {firstName}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Calm Points: <strong>720</strong></span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{firstName[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Action: Start Session CTA */}
        <div className="rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 p-6 flex flex-col md:flex-row justify-between items-center shadow-sm">
          <div>
            <h2 className="text-lg font-medium text-gray-800">Need a quick check-in?</h2>
            <p className="text-sm text-gray-600 mt-1">Tap below to begin a voice or reflection session.</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            onClick={() => navigate('/session')}
          >
            Start Session
          </Button>
        </div>

        {/* Goals + Calm Points */}
        <div className="rounded-lg border p-5 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Today's Goals</h3>
            <span className="text-sm text-gray-500">20/100 Calm Points</span>
          </div>

          <Progress value={20} className="h-2" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500" />

          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-center justify-between">
              <span>✅ Completing a session</span>
              <span className="text-indigo-600 font-semibold">+50</span>
            </li>
            <li className="flex items-center justify-between">
              <span>😊 Mood check-in</span>
              <span className="text-indigo-600 font-semibold">+10</span>
            </li>
          </ul>
        </div>

        <section className="space-y-4">
          {/* <MoodChart moodData={moodData} /> */}
          <StreakTracker currentStreak={3} longestStreak={7} />
        </section>

        <section>
          <AffirmationCard />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
