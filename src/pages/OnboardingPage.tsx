import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Brain } from "lucide-react";
import Logo from "@/components/Logo";
import CloudBackground from "@/components/CloudBackground";
import SunriseGradientBackground from "@/components/SunriseGradientBackground";
import { supabase } from "@/integrations/supabase/client";

const onboardingSchema = z.object({
  age: z.coerce
    .number({
      invalid_type_error: "Please enter your age",
    })
    .min(13, "Must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  gender: z.string().min(1, "Please select your gender"),
  occupation: z.string().min(1, "Please enter your occupation"),
  sexual_preference: z.string().min(1, "Please select your sexual preference"),
  self_diagnosed_issues: z.string().optional(),
  topics_on_mind: z.string().optional(),
  additional_info: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const OnboardingPage = () => {
  const { user, refreshOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [therapistStyle, setTherapistStyle] = useState([50]); // 0 = agreeable, 100 = challenging

  // Navigate to home when onboarding is completed
  useEffect(() => {
    if (onboardingCompleted) {
      navigate("/home");
    }
  }, [onboardingCompleted, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      age: undefined,
      gender: "",
      occupation: "",
      sexual_preference: "",
      self_diagnosed_issues: "",
      topics_on_mind: "",
      additional_info: "",
    },
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    if (!user) return;

    console.log("🎯 Submitting onboarding data:", data);
    setLoading(true);

    try {
      // Convert topics_on_mind string to array
      const topicsArray = data.topics_on_mind
        ? data.topics_on_mind
            .split(",")
            .map((topic) => topic.trim())
            .filter((topic) => topic.length > 0)
        : [];

      // Insert/update user profile data
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          age: data.age,
          gender: data.gender,
          career: data.occupation,
          sexual_preferences: data.sexual_preference,
          self_diagnosed_issues: data.self_diagnosed_issues,
          topics_on_mind: topicsArray,
          additional_info: data.additional_info,
          agreeable_slider: therapistStyle[0],
          agreeable_slider_updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error("❌ Profile update error:", profileError);
        throw profileError;
      }

      // Mark onboarding as completed in patients table
      const { error: patientError } = await supabase
        .from("patients")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (patientError) {
        console.error("❌ Patient update error:", patientError);
        throw patientError;
      }

      console.log("✅ Onboarding completed successfully");
      setOnboardingCompleted(true);
      
      // Refresh the auth context to update onboarding status
      await refreshOnboardingStatus();
      
      // Navigate to home after updating the context
      navigate('/home');
    } catch (error) {
      console.error("🚨 Onboarding failed:", error);
      toast({
        title: "Something went wrong",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTherapistStyleText = () => {
    const value = therapistStyle[0];
    if (value < 25) return "Very Agreeable - Supportive and validating";
    if (value < 50) return "Mostly Agreeable - Gentle guidance";
    if (value < 75) return "Balanced - Mix of support and challenge";
    return "Challenging - Direct and thought-provoking";
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SunriseGradientBackground />
      <CloudBackground className="opacity-100" />

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[600px] animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <Logo />
            </div>
            <h1 className="text-2xl md:text-3xl font-normal mb-3">
              Let's get to know you 🌟
            </h1>
            <p className="text-[#9b9b9b] text-base">
              This helps us personalize your experience
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-[24px] border border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.05)] p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Therapist Style Preference */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[15px] text-[#616161] font-normal">
                  <Brain className="h-4 w-4 text-[#9b9b9b]" />
                  AI Therapist Style Preference
                </Label>
                <div className="space-y-3">
                  <Slider
                    value={therapistStyle}
                    onValueChange={setTherapistStyle}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#9b9b9b]">
                    <span>Agreeable</span>
                    <span>Challenging</span>
                  </div>
                  <p className="text-sm text-[#616161] text-center">
                    {getTherapistStyleText()}
                  </p>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label
                  htmlFor="age"
                  className="text-[15px] text-[#616161] font-normal"
                >
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base"
                  {...register("age", { valueAsNumber: true })}
                />
                {errors.age && (
                  <p className="text-sm text-rose-300 mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-[15px] text-[#616161] font-normal">
                  Gender
                </Label>
                <Select onValueChange={(value) => setValue("gender", value)}>
                  <SelectTrigger className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non_binary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-rose-300 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <Label
                  htmlFor="occupation"
                  className="text-[15px] text-[#616161] font-normal"
                >
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  type="text"
                  placeholder="What do you do for work?"
                  className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base"
                  {...register("occupation")}
                />
                {errors.occupation && (
                  <p className="text-sm text-rose-300 mt-1">
                    {errors.occupation.message}
                  </p>
                )}
              </div>

              {/* Sexual Preference */}
              <div className="space-y-2">
                <Label className="text-[15px] text-[#616161] font-normal">
                  Sexual Preference
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("sexual_preference", value)
                  }
                >
                  <SelectTrigger className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base">
                    <SelectValue placeholder="Select your preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heterosexual">Heterosexual</SelectItem>
                    <SelectItem value="homosexual">Homosexual</SelectItem>
                    <SelectItem value="bisexual">Bisexual</SelectItem>
                    <SelectItem value="pansexual">Pansexual</SelectItem>
                    <SelectItem value="asexual">Asexual</SelectItem>
                    <SelectItem value="questioning">Questioning</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.sexual_preference && (
                  <p className="text-sm text-rose-300 mt-1">
                    {errors.sexual_preference.message}
                  </p>
                )}
              </div>

              {/* Self Diagnosed Issues */}
              <div className="space-y-2">
                <Label
                  htmlFor="self_diagnosed_issues"
                  className="text-[15px] text-[#616161] font-normal"
                >
                  Self-Diagnosed Issues{" "}
                  <span className="text-[#9b9b9b]">(Optional)</span>
                </Label>
                <Textarea
                  id="self_diagnosed_issues"
                  placeholder="Any mental health concerns you'd like to share..."
                  className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base min-h-[80px]"
                  {...register("self_diagnosed_issues")}
                />
              </div>

              {/* Topics on Mind */}
              <div className="space-y-2">
                <Label
                  htmlFor="topics_on_mind"
                  className="text-[15px] text-[#616161] font-normal"
                >
                  What's on your mind?{" "}
                  <span className="text-[#9b9b9b]">(Optional)</span>
                </Label>
                <Textarea
                  id="topics_on_mind"
                  placeholder="Topics, concerns, or goals you'd like to explore..."
                  className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base min-h-[80px]"
                  {...register("topics_on_mind")}
                />
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <Label
                  htmlFor="additional_info"
                  className="text-[15px] text-[#616161] font-normal"
                >
                  Tell me more about you{" "}
                  <span className="text-[#9b9b9b]">(Optional)</span>
                </Label>
                <Textarea
                  id="additional_info"
                  placeholder="Anything else you'd like to share about yourself..."
                  className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base min-h-[80px]"
                  {...register("additional_info")}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#a0c4ff] to-[#bdb2ff] hover:brightness-105 hover:scale-[1.02] transition-all duration-200 border-0 mt-8 text-base font-normal"
                disabled={loading}
              >
                {loading ? "Setting up your profile..." : "Complete Setup"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Sun orb gradient */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: "50%",
          bottom: "-10%",
          transform: "translateX(-50%)",
          width: 300,
          height: 140,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, #fde1d3 0%, #ffe29f 50%, rgba(252,242,217,0.11) 100%)",
          boxShadow: "0 0 70px 58px #fde1d399, 0 0 220px 120px #ffd5b2cc",
          filter: "blur(5px)",
          opacity: 0.8,
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default OnboardingPage;
