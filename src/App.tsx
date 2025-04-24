
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TherapistProvider } from "@/context/TherapistContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import all page components
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import BlogPage from "@/pages/BlogPage";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage";
import ChatPage from "@/pages/ChatPage";
import VoicePage from "@/pages/VoicePage";
import PastSessionsPage from "@/pages/PastSessionsPage";
import SettingsPage from "@/pages/SettingsPage";
import SessionPage from "@/pages/SessionPage";
import SessionSummaryPage from "@/pages/SessionSummaryPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TherapistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/blog" element={<BlogPage />} />
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
            </BrowserRouter>
          </TherapistProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
