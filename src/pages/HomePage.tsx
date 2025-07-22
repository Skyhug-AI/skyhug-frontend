import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CloudBackground from "@/components/CloudBackground";
import SunriseGradientBackground from "@/components/SunriseGradientBackground";
import EmotionalCheckInReminder from "@/components/reminders/EmotionalCheckInReminder";
import DailyGoalsCard from "@/components/goals/DailyGoalsCard";
import MoodChart from "@/components/progress/MoodChart";
// import StreakTracker from "@/components/achievements/StreakTracker";
import FloatingJournalButton from "@/components/journal/FloatingJournalButton";
import AffirmationCard from "@/components/affirmations/AffirmationCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MoodSelectionDialog from "@/components/mood/MoodSelectionDialog";
import { toast } from "@/hooks/use-toast";
import { useTherapist } from "@/context/TherapistContext";

const getFirstName = (fullName: string | undefined) => {
  return fullName?.split(" ")[0] || "Friend";
};

const HomePage = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const firstName = getFirstName(user?.name);
  const navigate = useNavigate();
  const {
    activeConversationId,
    getActiveSessionIdAndTherapist,
    currentTherapist,
  } = useTherapist();

  useEffect(() => {
    getActiveSessionIdAndTherapist();
  }, []);

  // Track completed goals
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);
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
    // If already completed, don't do anything
    if (completedGoals.includes(type)) {
      return;
    }
    if (type === "session") {
      navigate("/session");
    } else if (type === "mood") {
      // Open mood selection dialog
      setMoodDialogOpen(true);
    }
  };
  const handleMoodSelect = () => {
    // Update the goals list to show completion
    setSelectedMood(3);

    // Mark the mood goal as completed
    setCompletedGoals((prev) => [...prev, "mood"]);

    // Close the dialog
    setMoodDialogOpen(false);

    // Add points notification could go here
    toast({
      title: "Mood logged successfully!",
      description: "You earned +10 Calm Points",
    });
  };

  // Calculate progress based on completed goals
  const totalGoals = 2; // session and mood
  const completedCount = completedGoals.length;
  const progressPercentage = (completedCount / totalGoals) * 100;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SunriseGradientBackground />
      <CloudBackground />
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* <FloatingJournalButton /> */}

      <main className="flex-grow p-6 md:p-8 space-y-6 relative z-10 max-w-5xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {firstName} <span className="wave">👋</span>
          </h1>
        </div>

        {/* Action: Start Session CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 flex flex-col md:flex-row justify-between items-center shadow-xl border border-white/30 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Need a quick check-in?
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Tap below to begin a voice or reflection session.
            </p>
          </div>
          {!activeConversationId ? (
            <Button
              className="mt-6 md:mt-0 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => navigate("/session")}
            >
              Start Session
            </Button>
          ) : (
            <Button
              className="mt-6 md:mt-0 px-8 py-4 bg-gradient-to-r from-[#a0c4ff] to-[#bdb2ff] hover:brightness-105 hover:scale-[1.02] transition-all duration-200 border-0 rounded-xl text-base font-normal text-white"
              onClick={() => navigate("/session")}
            >
              Resume Session
            </Button>
          )}
        </div>

        {/* Goals + Calm Points */}
        <div className="rounded-2xl border border-white/30 p-8 space-y-6 bg-white/90 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Today's Goals</h3>
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {completedCount * 10 + 10}/100 Calm Points
            </span>
          </div>

          <div className="relative">
            <Progress
              value={progressPercentage}
              className="h-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200"
              indicatorClassName="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-lg"
            />
            <span className="absolute left-0 top-6 text-sm font-medium text-gray-600 pb-4">
              {progressPercentage}% complete
            </span>
          </div>

          <ul className="space-y-4 text-base text-gray-700 mt-12">
            <li
              className={`flex items-center justify-between p-4 rounded-xl transition-all border-2 ${
                completedGoals.includes("session")
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md"
                  : "bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-purple-50 cursor-pointer border-blue-200 hover:border-purple-300 hover:shadow-lg transform hover:scale-102"
              }`}
              onClick={() => handleGoalClick("session")}
            >
              <div className="flex items-center">
                <span
                  className={
                    completedGoals.includes("session")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  Completing a session
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 font-bold text-lg">+50</span>
                {!completedGoals.includes("session") && (
                  <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
                )}
              </div>
            </li>
            <li
              className={`flex items-center justify-between p-4 rounded-xl transition-all border-2 ${
                completedGoals.includes("mood")
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md"
                  : "bg-gradient-to-r from-white to-pink-50 hover:from-pink-50 hover:to-purple-50 cursor-pointer border-pink-200 hover:border-purple-300 hover:shadow-lg transform hover:scale-102"
              }`}
              onClick={() => handleGoalClick("mood")}
            >
              <div className="flex items-center">
                <span
                  className={
                    completedGoals.includes("mood")
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  Mood check-in
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-pink-600 font-bold text-lg">+10</span>
                {!completedGoals.includes("mood") && (
                  <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
                )}
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
