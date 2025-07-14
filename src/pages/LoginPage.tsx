import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import Logo from "@/components/Logo";
import CloudBackground from "@/components/CloudBackground";
import SunriseGradientBackground from "@/components/SunriseGradientBackground";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type ResetFormValues = z.infer<typeof resetSchema>;

const LoginPage = () => {
  const { login, loading, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    reset: resetForm,
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      navigate("/home");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setResettingPassword(true);
    try {
      await resetPassword(data.email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for password reset instructions.",
      });
      setResetDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: "Unable to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SunriseGradientBackground />
      <CloudBackground className="opacity-100" />

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[480px] animate-fade-in">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
              <Logo />
            </Link>
            <h1 className="text-2xl md:text-3xl font-normal mb-3">
              Welcome back, we missed you ☀️
            </h1>
            <p className="text-[#9b9b9b] text-base">
              Sky's here to support you. Let's keep going.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-[24px] border border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.05)] p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-[15px] text-[#616161] font-normal"
                >
                  <Mail className="h-4 w-4 text-[#9b9b9b]" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-rose-300 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="flex items-center gap-2 text-[15px] text-[#616161] font-normal"
                  >
                    <Lock className="h-4 w-4 text-[#9b9b9b]" />
                    Password
                  </Label>
                  <Dialog
                    open={resetDialogOpen}
                    onOpenChange={setResetDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-sm text-serenity-600 hover:text-serenity-700 hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-sm">
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Reset Your Password
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleResetSubmit(onResetSubmit)}
                        className="space-y-4 pt-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="reset-email" className="text-[15px]">
                            Email Address
                          </Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-[#f7f7fb] border-transparent"
                            {...registerReset("email")}
                          />
                          {resetErrors.email && (
                            <p className="text-sm text-rose-300 mt-1">
                              {resetErrors.email.message}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-[#9b9b9b]">
                          Enter your email address and we'll send you
                          instructions to reset your password.
                        </p>
                        <DialogFooter className="pt-4">
                          <Button
                            type="submit"
                            className="w-full h-10 bg-serenity-600 hover:bg-serenity-700"
                            disabled={resettingPassword}
                          >
                            {resettingPassword
                              ? "Sending Reset Instructions..."
                              : "Send Reset Instructions"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-rose-300 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#a0c4ff] to-[#bdb2ff] hover:brightness-105 hover:scale-[1.02] transition-all duration-200 border-0 mt-6 text-base font-normal"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}{" "}
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#eee]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/70 px-4 text-[#9b9b9b]">
                  or continue with
                </span>
              </div>
            </div>

            <SocialLoginButton
              provider="google"
              onClick={handleGoogleSignIn}
              disabled={loading}
            />

            <div className="mt-8 text-center">
              <p className="text-[#9b9b9b] text-[15px]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-serenity-600 hover:text-serenity-700 font-medium hover:underline transition-colors"
                >
                  Create an account <ArrowRight className="inline h-3 w-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

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

export default LoginPage;
