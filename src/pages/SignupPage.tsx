import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});
type SignupFormValues = z.infer<typeof signupSchema>;
const SignupPage = () => {
  const {
    signup,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data.name, data.email, data.password);
      toast({
        title: 'Account created',
        description: 'Welcome to Serenity! Your account has been created.'
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: 'Unable to create your account. Please try again.',
        variant: 'destructive'
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-[#fef6f9] to-[#eef5fb] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[480px] animate-fade-in">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
              <Logo />
            </Link>
            <h1 className="text-2xl md:text-3xl font-normal mb-3">Let's get started with skyhug 🌤️</h1>
            <p className="text-[#9b9b9b] text-base">begin your journey toward clarity and calm</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-[24px] border border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.05)] p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-[15px] text-[#616161] font-normal">
                  <User className="h-4 w-4 text-[#9b9b9b]" />
                  Full Name
                </Label>
                <Input id="name" type="text" placeholder="Your name" className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base" {...register('name')} />
                {errors.name && <p className="text-sm text-rose-300 mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-[15px] text-[#616161] font-normal">
                  <Mail className="h-4 w-4 text-[#9b9b9b]" />
                  Email
                </Label>
                <Input id="email" type="email" placeholder="your@email.com" className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base" {...register('email')} />
                {errors.email && <p className="text-sm text-rose-300 mt-1">{errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-[15px] text-[#616161] font-normal">
                  <Lock className="h-4 w-4 text-[#9b9b9b]" />
                  Password
                </Label>
                <Input id="password" type="password" placeholder="••••••••" className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base" {...register('password')} />
                {errors.password && <p className="text-sm text-rose-300 mt-1">{errors.password.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-[15px] text-[#616161] font-normal">
                  <Lock className="h-4 w-4 text-[#9b9b9b]" />
                  Confirm Password
                </Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="bg-[#f7f7fb] border-transparent hover:border-serenity-200 focus:border-serenity-300 transition-colors text-base" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-sm text-rose-300 mt-1">{errors.confirmPassword.message}</p>}
              </div>
              
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-[#a0c4ff] to-[#bdb2ff] hover:brightness-105 hover:scale-[1.02] transition-all duration-200 border-0 mt-6 text-base font-normal" disabled={loading}>
                {loading ? 'creating account...' : 'create account'} <UserPlus className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-[#9b9b9b] text-[15px]">
                Already have an account?{' '}
                <Link to="/login" className="text-serenity-600 hover:text-serenity-700 font-medium hover:underline transition-colors">
                  <ArrowLeft className="inline h-3 w-3" /> Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default SignupPage;