
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Lock } from 'lucide-react';
import Logo from '@/components/Logo';
import CloudBackground from '@/components/CloudBackground';
import SunriseGradientBackground from '@/components/SunriseGradientBackground';

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ResetPasswordPage = () => {
  const { updatePassword, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resetComplete, setResetComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetFormValues) => {
    try {
      await updatePassword(data.password);
      setResetComplete(true);
      toast({
        title: 'Password updated successfully',
        description: 'Your password has been reset. You can now log in with your new password.'
      });
    } catch (error) {
      toast({
        title: 'Password reset failed',
        description: 'Unable to update your password. Please try again or request a new reset link.',
        variant: 'destructive'
      });
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
              {resetComplete ? 'Password Reset Complete! 🎉' : 'Reset Your Password 🔐'}
            </h1>
            <p className="text-[#9b9b9b] text-base">
              {resetComplete 
                ? 'Your password has been updated successfully.' 
                : 'Enter your new password below to complete the reset process.'}
            </p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-[24px] border border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.05)] p-8 md:p-10">
            {resetComplete ? (
              <div className="text-center space-y-6">
                <div className="bg-serenity-100 text-serenity-700 p-4 rounded-lg">
                  Your password has been reset successfully. You can now log in with your new password.
                </div>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full h-12 bg-gradient-to-r from-[#a0c4ff] to-[#bdb2ff] hover:brightness-105 hover:scale-[1.02] transition-all duration-200 border-0"
                >
                  Return to Login <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-[15px] text-[#616161] font-normal">
                    <Lock className="h-4 w-4 text-[#9b9b9b]" />
                    New Password
                  </Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base" 
                    {...register('password')} 
                  />
                  {errors.password && <p className="text-sm text-rose-300 mt-1">{errors.password.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-[15px] text-[#616161] font-normal">
                    <Lock className="h-4 w-4 text-[#9b9b9b]" />
                    Confirm New Password
                  </Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base" 
                    {...register('confirmPassword')} 
                  />
                  {errors.confirmPassword && <p className="text-sm text-rose-300 mt-1">{errors.confirmPassword.message}</p>}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-[#a0c4ff] to-[#bdb2ff] hover:brightness-105 hover:scale-[1.02] transition-all duration-200 border-0 mt-6 text-base font-normal" 
                  disabled={loading}
                >
                  {loading ? 'Updating Password...' : 'Update Password'} <Lock className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
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

export default ResetPasswordPage;
