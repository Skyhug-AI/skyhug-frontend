import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';
import MoodSelectionDialog from '@/components/mood/MoodSelectionDialog';
import AffirmationCard from '@/components/affirmations/AffirmationCard';
import { toast } from '@/hooks/use-toast';

const getFirstName = (fullName: string | undefined) => {
  return fullName?.split(" ")[0] || "Friend";
};

const MainDashboard = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const firstName = getFirstName(user?.name);

  // Track completed goals
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);

  const handleGoalClick = (type: string) => {
    // If already completed, don't do anything
    if (completedGoals.includes(type)) {
      return;
    }
    if (type === "mood") {
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

    // Add points notification
    toast({
      title: "Mood logged successfully!",
      description: "You earned +10 Calm Points",
    });
  };

  // Calculate progress based on completed goals
  const totalGoals = 1; // only mood goal in this variant
  const completedCount = completedGoals.length;
  const progressPercentage = (completedCount / totalGoals) * 100;

  return (
    <div className="space-y-6 w-full">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {firstName} <span className="wave">👋</span>
        </h1>
        <p className="text-base text-gray-500">
          You've earned 720 Calm Points ⭐
        </p>
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
          <span className="absolute left-0 top-6 text-sm font-medium text-gray-600">
            {progressPercentage}% complete
          </span>
        </div>

        <ul className="space-y-4 text-base text-gray-700 mt-8">
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

      {/* Affirmation Card */}
      <section>
        <AffirmationCard />
      </section>
    </div>
  );
};

export default MainDashboard;