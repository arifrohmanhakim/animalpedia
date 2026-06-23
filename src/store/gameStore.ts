import { create } from 'zustand';
import { animals as allAnimals, badges as badgeList } from '@/data/animals';

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  unlocked: boolean;
}

interface GameState {
  // App flow
  showSplash: boolean;
  onboardingComplete: boolean;
  currentTab: string;

  // Player
  playerName: string;
  selectedCharacter: string;
  ageRange: string;
  favoriteCategories: string[];

  // Progression
  xp: number;
  discoveredAnimals: string[];
  quizCorrectCount: number;
  lastLoginDate: string;
  dailyStreak: number;
  badges: Badge[];

  // Quiz
  quizInProgress: boolean;
  currentQuizAnimalId: string | null;

  // Actions
  finishSplash: () => void;
  completeOnboarding: (data: {
    playerName: string;
    selectedCharacter: string;
    ageRange: string;
    favoriteCategories: string[];
  }) => void;
  setTab: (tab: string) => void;
  discoverAnimal: (animalId: string) => void;
  addXP: (amount: number) => void;
  recordCorrectQuiz: () => void;
  startQuiz: (animalId: string) => void;
  endQuiz: () => void;
  checkBadges: () => void;
  getLevel: () => { level: number; title: string; xpForNext: number; progress: number };
  getAnimals: () => typeof allAnimals;
  isDiscovered: (animalId: string) => boolean;
  getCollectionProgress: () => { discovered: number; total: number };
}

const getLevelFromXP = (xp: number) => {
  const levelThresholds = [
    { level: 1, title: 'Penjelajah Kecil', xpNeeded: 0 },
    { level: 5, title: 'Penjelajah Aktif', xpNeeded: 100 },
    { level: 10, title: 'Penjelajah Hebat', xpNeeded: 300 },
    { level: 15, title: 'Ahli Satwa', xpNeeded: 600 },
    { level: 25, title: 'Master Animalpedia', xpNeeded: 1200 },
  ];

  let currentLevel = levelThresholds[0];
  let nextLevel = levelThresholds[1];

  for (let i = 0; i < levelThresholds.length - 1; i++) {
    if (xp >= levelThresholds[i].xpNeeded) {
      currentLevel = levelThresholds[i];
      nextLevel = levelThresholds[i + 1];
    }
  }

  if (xp >= levelThresholds[levelThresholds.length - 1].xpNeeded) {
    currentLevel = levelThresholds[levelThresholds.length - 1];
    nextLevel = { ...currentLevel, xpNeeded: currentLevel.xpNeeded + 500 };
  }

  const xpInLevel = xp - currentLevel.xpNeeded;
  const xpNeededForNext = nextLevel.xpNeeded - currentLevel.xpNeeded;
  const progress = Math.min(xpInLevel / xpNeededForNext, 1);

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    xpForNext: nextLevel.xpNeeded,
    progress,
  };
};

export const useGameStore = create<GameState>((set, get) => ({
  showSplash: true,
  onboardingComplete: false,
  currentTab: 'home',

  playerName: '',
  selectedCharacter: '',
  ageRange: '',
  favoriteCategories: [],

  xp: 0,
  discoveredAnimals: [],
  quizCorrectCount: 0,
  lastLoginDate: '',
  dailyStreak: 0,
  badges: badgeList.map((b) => ({ ...b })),

  quizInProgress: false,
  currentQuizAnimalId: null,

  finishSplash: () => set({ showSplash: false }),

  completeOnboarding: (data) =>
    set({
      onboardingComplete: true,
      playerName: data.playerName,
      selectedCharacter: data.selectedCharacter,
      ageRange: data.ageRange,
      favoriteCategories: data.favoriteCategories,
    }),

  setTab: (tab) => set({ currentTab: tab }),

  discoverAnimal: (animalId) => {
    const state = get();
    if (state.discoveredAnimals.includes(animalId)) return;

    const newDiscovered = [...state.discoveredAnimals, animalId];
    const newXP = state.xp + 5;

    set({
      discoveredAnimals: newDiscovered,
      xp: newXP,
    });

    get().checkBadges();
  },

  addXP: (amount) => {
    set((state) => ({ xp: state.xp + amount }));
    get().checkBadges();
  },

  recordCorrectQuiz: () => {
    set((state) => ({ quizCorrectCount: state.quizCorrectCount + 1 }));
    get().checkBadges();
  },

  startQuiz: (animalId) => set({ quizInProgress: true, currentQuizAnimalId: animalId }),
  endQuiz: () => set({ quizInProgress: false, currentQuizAnimalId: null }),

  checkBadges: () => {
    const state = get();
    const updatedBadges = state.badges.map((badge) => {
      if (badge.unlocked) return badge;

      switch (badge.id) {
        case 'explorer':
          return { ...badge, unlocked: state.discoveredAnimals.length >= 10 };
        case 'mammal-expert': {
          const mammalCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === 'mamalia'
          ).length;
          return { ...badge, unlocked: mammalCount >= 5 };
        }
        case 'ocean-master': {
          const oceanIds = allAnimals.filter((a) => a.category === 'laut').map((a) => a.id);
          const oceanDiscovered = oceanIds.filter((id) =>
            state.discoveredAnimals.includes(id)
          ).length;
          return { ...badge, unlocked: oceanDiscovered === oceanIds.length };
        }
        case 'quiz-champion':
          return { ...badge, unlocked: state.quizCorrectCount >= 10 };
        case 'daily-learner':
          return { ...badge, unlocked: state.dailyStreak >= 7 };
        default:
          return badge;
      }
    });

    set({ badges: updatedBadges });
  },

  getLevel: () => getLevelFromXP(get().xp),

  getAnimals: () => allAnimals,

  isDiscovered: (animalId) => get().discoveredAnimals.includes(animalId),

  getCollectionProgress: () => ({
    discovered: get().discoveredAnimals.length,
    total: allAnimals.length,
  }),
}));
