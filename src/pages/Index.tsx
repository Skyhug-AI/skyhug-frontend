
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageSquareText, Mic, Brain, Heart, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Features Section */}
        <section className="py-32 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">How Serenity Can Help You</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI therapist provides a safe space for you to explore your thoughts and feelings, 
                offering guidance and support whenever you need it.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-serenity-50 to-white border border-serenity-100 transition-all duration-300 hover:shadow-lg">
                <div className="h-16 w-16 bg-serenity-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquareText className="h-8 w-8 text-serenity-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Voice Conversations</h3>
                <p className="text-muted-foreground">
                  Speak naturally with our AI therapist, just like talking to a trusted friend.
                </p>
              </div>
              
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-serenity-50 to-white border border-serenity-100 transition-all duration-300 hover:shadow-lg">
                <div className="h-16 w-16 bg-serenity-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-serenity-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Guided Prompts</h3>
                <p className="text-muted-foreground">
                  Get personalized prompts that help you explore your thoughts and emotions deeply.
                </p>
              </div>
              
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-serenity-50 to-white border border-serenity-100 transition-all duration-300 hover:shadow-lg">
                <div className="h-16 w-16 bg-serenity-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-serenity-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Mood Tracking</h3>
                <p className="text-muted-foreground">
                  Visualize your emotional journey and track your progress over time.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-white to-serenity-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Getting started with Serenity is simple. Begin your journey to better mental wellbeing in just a few steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="relative">
                <div className="h-12 w-12 bg-serenity-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-serenity-500">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Choose Your Format</h3>
                <p className="text-muted-foreground">
                  Select between text-based chat or voice conversation based on what feels most comfortable.
                </p>
              </div>
              
              <div className="relative">
                <div className="h-12 w-12 bg-serenity-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-serenity-500">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Share Your Thoughts</h3>
                <p className="text-muted-foreground">
                  Express what's on your mind, how you're feeling, or what you'd like to work through.
                </p>
              </div>
              
              <div className="relative">
                <div className="h-12 w-12 bg-serenity-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-serenity-500">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Receive Guidance</h3>
                <p className="text-muted-foreground">
                  Get thoughtful responses and insights to help you explore your feelings.
                </p>
              </div>
              
              <div className="relative">
                <div className="h-12 w-12 bg-serenity-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-serenity-500">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
                <p className="text-muted-foreground">
                  See your emotional journey unfold with visual insights and progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="py-32 px-4 md:px-8 bg-serenity-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Start your journey to clarity</h2>
            <p className="text-xl mb-12 opacity-90">
              Serenity is free to try, no account required. Just say hi.
            </p>
            <Button 
              onClick={() => navigate('/voice')}
              size="lg"
              className="rounded-full px-8 bg-white text-serenity-600 hover:bg-serenity-50 group"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
