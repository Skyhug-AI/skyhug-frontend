
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { TherapistProvider } from "@/context/TherapistContext";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import BlogPage from "./pages/BlogPage";
import TherapistBrowsePage from "./pages/TherapistBrowsePage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import VoicePage from "./pages/VoicePage";
import PastSessionsPage from "./pages/PastSessionsPage";
import SettingsPage from "./pages/SettingsPage";
import TherapistSelectionPage from "./pages/TherapistSelectionPage";
import SessionPage from "./pages/SessionPage";
import SessionSummaryPage from "./pages/SessionSummaryPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import OnboardingRedirect from "./components/OnboardingRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TherapistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OnboardingRedirect>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route 
                  path="/therapists" 
                  element={
                    <ProtectedRoute>
                      <TherapistBrowsePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/home" 
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/voice" 
                  element={
                    <ProtectedRoute>
                      <VoicePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/sessions" 
                  element={
                    <ProtectedRoute>
                      <PastSessionsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/therapist-selection" 
                  element={
                    <ProtectedRoute>
                      <TherapistSelectionPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/session" 
                  element={
                    <ProtectedRoute>
                      <SessionPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/session-summary" 
                  element={
                    <ProtectedRoute>
                      <SessionSummaryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OnboardingRedirect>
          </BrowserRouter>
        </TherapistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
