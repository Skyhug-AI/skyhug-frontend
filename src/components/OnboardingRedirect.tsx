import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const OnboardingRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, patientReady, onboardingCompleted } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // Don't redirect if not authenticated
    if (!user || !patientReady) return;

    // If onboarding is completed and user is on onboarding page, redirect to home
    if (onboardingCompleted && location.pathname === '/onboarding') {
      console.log('🔄 Redirecting to home - onboarding completed');
      navigate('/home');
      return;
    }

    // If onboarding is not completed and user is not on onboarding page, redirect to onboarding
    if (!onboardingCompleted && location.pathname !== '/onboarding') {
      console.log('🔄 Redirecting to onboarding - not completed');
      navigate('/onboarding');
      return;
    }
  }, [user, loading, patientReady, onboardingCompleted, navigate, location.pathname]);

  return <>{children}</>;
};

export default OnboardingRedirect;