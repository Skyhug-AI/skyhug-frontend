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

    // Don't redirect if already on onboarding page
    if (location.pathname === '/onboarding') return;

    // Redirect to onboarding if not completed
    if (!onboardingCompleted) {
      console.log('🔄 Redirecting to onboarding - not completed');
      navigate('/onboarding');
    }
  }, [user, loading, patientReady, onboardingCompleted, navigate, location.pathname]);

  return <>{children}</>;
};

export default OnboardingRedirect;