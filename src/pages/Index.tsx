import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { SplashScreen } from '@/components/SplashScreen';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { BottomNav } from '@/components/BottomNav';
import { HomeScreen } from '@/components/HomeScreen';
import { ExploreScreen } from '@/components/ExploreScreen';
import { CollectionScreen } from '@/components/CollectionScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { GamesHub } from '@/components/GamesHub';
import { AnimalDetailScreen } from '@/components/AnimalDetailScreen';
import { QuizScreen } from '@/components/QuizScreen';
import { ToastContainer } from '@/components/ToastNotification';

const Index = () => {
  const showSplash = useGameStore((s) => s.showSplash);
  const onboardingComplete = useGameStore((s) => s.onboardingComplete);
  const currentTab = useGameStore((s) => s.currentTab);
  const quizInProgress = useGameStore((s) => s.quizInProgress);
  const currentQuizAnimalId = useGameStore((s) => s.currentQuizAnimalId);
  const endQuiz = useGameStore((s) => s.endQuiz);

  const [detailAnimalId, setDetailAnimalId] = useState<string | null>(null);

  // --- Browser back button handling for overlays ---
  const ignorePopRef = useRef(false);

  // Keep refs to current overlay states so popstate listener can read them
  const detailAnimalIdRef = useRef(detailAnimalId);
  detailAnimalIdRef.current = detailAnimalId;

  const quizInProgressRef = useRef(quizInProgress);
  quizInProgressRef.current = quizInProgress;

  // Push a history entry when an overlay opens
  useEffect(() => {
    if (detailAnimalId) {
      window.history.pushState(null, '');
    }
  }, [detailAnimalId]);

  useEffect(() => {
    if (quizInProgress) {
      window.history.pushState(null, '');
    }
  }, [quizInProgress]);

  // Listen for physical back button / popstate
  useEffect(() => {
    const handlePopState = () => {
      if (ignorePopRef.current) {
        ignorePopRef.current = false;
        return;
      }

      if (detailAnimalIdRef.current) {
        setDetailAnimalId(null);
        return;
      }

      if (quizInProgressRef.current) {
        endQuiz();
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [endQuiz]);

  // Listen for custom event from ExploreScreen / HomeScreen
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setDetailAnimalId(e.detail.animalId);
    };
    window.addEventListener('view-animal', handler as EventListener);
    return () => window.removeEventListener('view-animal', handler as EventListener);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleCloseDetail = useCallback(() => {
    ignorePopRef.current = true;
    setDetailAnimalId(null);
    window.history.back();
  }, []);

  const handleCloseQuiz = useCallback(() => {
    ignorePopRef.current = true;
    endQuiz();
    window.history.back();
  }, [endQuiz]);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'games':
        return <GamesHub />;
      case 'collection':
        return <CollectionScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div
      className="h-dvh w-full max-w-md mx-auto relative overflow-hidden flex flex-col"
      style={{
        background: 'var(--cream)',
        boxShadow: '0 0 40px rgba(0,0,0,0.08)',
      }}
    >
      {/* Splash Screen */}
      {showSplash && <SplashScreen />}

      {/* Onboarding (shown after splash) */}
      {!showSplash && !onboardingComplete && <OnboardingScreen />}

      {/* Main App (tabs + bottom nav) */}
      {!showSplash && onboardingComplete && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tab content fills available space */}
          <div className="flex-1 overflow-hidden relative">
            {renderTabContent()}
          </div>

          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      )}

      {/* Animal Detail Overlay (no bottom nav) */}
      {detailAnimalId && (
        <AnimalDetailScreen
          animalId={detailAnimalId}
          onBack={handleCloseDetail}
        />
      )}

      {/* Quiz Overlay (no bottom nav) */}
      {quizInProgress && currentQuizAnimalId && (
        <QuizScreen
          animalId={currentQuizAnimalId}
          onBack={handleCloseQuiz}
          onFinish={handleCloseQuiz}
        />
      )}

      {/* Toast notifications - always on top */}
      <ToastContainer />
    </div>
  );
};

export default Index;