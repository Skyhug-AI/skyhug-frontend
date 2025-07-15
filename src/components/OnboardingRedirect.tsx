import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const OnboardingRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, patientReady, onboardingCompleted } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    console.log(loading, "LOADING");
    if (loading) return;

    // Don't redirect if not authenticated
    console.log(user, "USER");
    console.log(patientReady, "PATIENT READY");
    if (!user || !patientReady) return;

    console.log(onboardingCompleted, "ONBOARDING COMPLETED");
    // If onboarding is completed and user is on onboarding page, redirect to session
    if (onboardingCompleted && location.pathname === "/onboarding") {
      console.log("🔄 Redirecting to session - onboarding completed");
      navigate("/session");
      return;
    }

    // If onboarding is not completed and user is not on onboarding page, redirect to onboarding
    if (!onboardingCompleted && location.pathname !== "/onboarding") {
      console.log("🔄 Redirecting to onboarding - not completed");
      navigate("/onboarding");
      return;
    }
  }, [
    user,
    loading,
    patientReady,
    onboardingCompleted,
    navigate,
    location.pathname,
  ]);

  return <>{children}</>;
};

export default OnboardingRedirect;
