import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsOnboardingCompleted } from './hooks/useQueries';
import LandingPage from './pages/LandingPage';
import ProfileSetup from './pages/ProfileSetup';
import OnboardingFlow from './pages/OnboardingFlow';
import Dashboard from './pages/Dashboard';
import WelcomeTutorial from './components/WelcomeTutorial';
import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: onboardingCompleted, isLoading: onboardingLoading } = useIsOnboardingCompleted();
  const [showTutorial, setShowTutorial] = useState(false);

  const isAuthenticated = !!identity;

  // Show tutorial after onboarding is completed for the first time
  useEffect(() => {
    if (isAuthenticated && onboardingCompleted && !sessionStorage.getItem('tutorialShown')) {
      setShowTutorial(true);
      sessionStorage.setItem('tutorialShown', 'true');
    }
  }, [isAuthenticated, onboardingCompleted]);

  // Show loading state while initializing
  if (isInitializing || (isAuthenticated && (profileLoading || onboardingLoading) && !isFetched)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Loading SHAMMAH...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show landing page
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage />
        <Toaster />
      </>
    );
  }

  // Authenticated but no profile - show profile setup
  const showProfileSetup = isAuthenticated && isFetched && userProfile === null;
  if (showProfileSetup) {
    return (
      <>
        <ProfileSetup />
        <Toaster />
      </>
    );
  }

  // Authenticated with profile but onboarding not completed - show onboarding flow
  const showOnboarding = isAuthenticated && userProfile && !onboardingCompleted;
  if (showOnboarding) {
    return (
      <>
        <OnboardingFlow />
        <Toaster />
      </>
    );
  }

  // Authenticated with profile and onboarding completed - show dashboard
  return (
    <>
      <Dashboard />
      {showTutorial && <WelcomeTutorial onClose={() => setShowTutorial(false)} />}
      <Toaster />
    </>
  );
}
