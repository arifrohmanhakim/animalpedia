import { create } from 'zustand';
import { animals as allAnimals, badges as badgeList, families } from '@/data/animals';

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  unlocked: boolean;
}

interface GameState {
  showSplash: boolean;
  onboardingComplete: boolean;
  currentTab: string;

  playerName: string;
  selectedCharacter: string;
  ageRange: string;
  favoriteCategories: string[];

  xp: number;
  discoveredAnimals: string[];
  favoriteAnimals: string[];
  quizCorrectCount: number;
  lastLoginDate: string;
  dailyStreak: number;
  badges: Badge[];

  quizInProgress: boolean;
  currentQuizAnimalId: string | null;

  lastViewedAnimalId: string | null;

  activeGame: string | null;

  dailyChallengeDate: string;
  dailyChallengeCompleted: boolean;

  finishSplash: () => void;
  completeOnboarding: (data: {
    playerName: string;
    selectedCharacter: string;
    ageRange: string;
    favoriteCategories: string[];
  }) => void;
  setTab: (tab: string) => void;
  discoverAnimal: (animalId: string) => void;
  toggleFavorite: (animalId: string) => void;
  setLastViewedAnimal: (animalId: string) => void;
  addXP: (amount: number) => void;
  recordCorrectQuiz: () => void;
  startQuiz: (animalId: string) => void;
  endQuiz: () => void;
  checkBadges: () => void;
  checkNewBadges: () => string[];
  completeDailyChallenge: () => void;
  setActiveGame: (game: string | null) => void;
  getLevel: () => { level: number; title: string; xpForNext: number; progress: number };
  getAnimals: () => typeof allAnimals;
  isDiscovered: (animalId: string) => boolean;
  isFavorite: (animalId: string) => boolean;
  getCollectionProgress: () => { discovered: number; total: number };
  isFamilyComplete: (familyId: string) => boolean;
}

const STORAGE_KEY = 'animalpedia-kids-save';

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const saveState = (state: Partial<GameState>) => {
  try {
    const toSave = {
      onboardingComplete: state.onboardingComplete,
      playerName: state.playerName,
      selectedCharacter: state.selectedCharacter,
      ageRange: state.ageRange,
      favoriteCategories: state.favoriteCategories,
      xp: state.xp,
      discoveredAnimals: state.discoveredAnimals,
      favoriteAnimals: state.favoriteAnimals,
      quizCorrectCount: state.quizCorrectCount,
      lastLoginDate: state.lastLoginDate,
      dailyStreak: state.dailyStreak,
      badges: state.badges,
      lastViewedAnimalId: state.lastViewedAnimalId,
      dailyChallengeDate: state.dailyChallengeDate,
      dailyChallengeCompleted: state.dailyChallengeCompleted,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
};

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

const savedState = loadState();
const today = new Date().toDateString();
const dailyChallengeCompleted =
  savedState?.dailyChallengeDate === today
    ? savedState?.dailyChallengeCompleted ?? false
    : false;

let initialDailyStreak = savedState?.dailyStreak ?? 0;
let initialLastLoginDate = savedState?.lastLoginDate ?? '';

if (initialLastLoginDate) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  if (initialLastLoginDate === today) {
    // keep streak
  } else if (initialLastLoginDate === yesterdayStr) {
    initialDailyStreak += 1;
  } else {
    initialDailyStreak = 1;
  }
} else {
  initialDailyStreak = 1;
}
initialLastLoginDate = today;

export const useGameStore = create<GameState>((set, get) => ({
  showSplash: true,
  onboardingComplete: savedState?.onboardingComplete ?? false,
  currentTab: 'home',

  playerName: savedState?.playerName ?? '',
  selectedCharacter: savedState?.selectedCharacter ?? '',
  ageRange: savedState?.ageRange ?? '',
  favoriteCategories: savedState?.favoriteCategories ?? [],

  xp: savedState?.xp ?? 0,
  discoveredAnimals: savedState?.discoveredAnimals ?? [],
  favoriteAnimals: savedState?.favoriteAnimals ?? [],
  quizCorrectCount: savedState?.quizCorrectCount ?? 0,
  lastLoginDate: initialLastLoginDate,
  dailyStreak: initialDailyStreak,
  badges: savedState?.badges ?? badgeList.map((b) => ({ ...b })),

  quizInProgress: false,
  currentQuizAnimalId: null,

  lastViewedAnimalId: savedState?.lastViewedAnimalId ?? null,

  activeGame: null,

  dailyChallengeDate: today,
  dailyChallengeCompleted,

  finishSplash: () => set({ showSplash: false }),

  completeOnboarding: (data) => {
    const todayStr = new Date().toDateString();
    const newState = {
      onboardingComplete: true,
      playerName: data.playerName,
      selectedCharacter: data.selectedCharacter,
      ageRange: data.ageRange,
      favoriteCategories: data.favoriteCategories,
      lastLoginDate: todayStr,
      dailyStreak: 1,
      lastViewedAnimalId: null as string | null,
    };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  setTab: (tab) => set({ currentTab: tab }),

  discoverAnimal: (animalId) => {
    const state = get();
    if (state.discoveredAnimals.includes(animalId)) return;

    const newDiscovered = [...state.discoveredAnimals, animalId];
    const newXP = state.xp + 5;

    const newState = {
      discoveredAnimals: newDiscovered,
      xp: newXP,
    };

    set(newState);
    get().checkBadges();
    saveState({ ...get(), ...newState });
  },

  toggleFavorite: (animalId) => {
    const state = get();
    const isFav = state.favoriteAnimals.includes(animalId);
    const newFavorites = isFav
      ? state.favoriteAnimals.filter((id) => id !== animalId)
      : [...state.favoriteAnimals, animalId];

    const newState = { favoriteAnimals: newFavorites };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  setLastViewedAnimal: (animalId) => {
    const newState = { lastViewedAnimalId: animalId };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  addXP: (amount) => {
    const state = get();
    const newXP = state.xp + amount;
    const newState = { xp: newXP };
    set(newState);
    get().checkBadges();
    saveState({ ...get(), ...newState });
  },

  recordCorrectQuiz: () => {
    const state = get();
    const newCount = state.quizCorrectCount + 1;
    const newState = { quizCorrectCount: newCount };
    set(newState);
    get().checkBadges();
    saveState({ ...get(), ...newState });
  },

  startQuiz: (animalId) => set({ quizInProgress: true, currentQuizAnimalId: animalId }),
  endQuiz: () => set({ quizInProgress: false, currentQuizAnimalId: null }),

  completeDailyChallenge: () => {
    const todayStr = new Date().toDateString();
    const newState = {
      dailyChallengeDate: todayStr,
      dailyChallengeCompleted: true,
    };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  setActiveGame: (game) => set({ activeGame: game }),

  isFamilyComplete: (familyId) => {
    const state = get();
    const family = families.find((f) => f.id === familyId);
    if (!family) return false;
    const existentMembers = family.members.filter((m) => m.exists);
    return existentMembers.every((m) => state.discoveredAnimals.includes(m.animalId));
  },

  checkBadges: () => {
    const state = get();
    let changed = false;
    const updatedBadges = state.badges.map((badge) => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;
      switch (badge.id) {
        case 'explorer':
          shouldUnlock = state.discoveredAnimals.length >= 10;
          break;
        case 'mammal-expert': {
          const mammalCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === 'mamalia'
          ).length;
          shouldUnlock = mammalCount >= 5;
          break;
        }
        case 'ocean-master': {
          const oceanIds = allAnimals.filter((a) => a.category === 'laut').map((a) => a.id);
          const oceanDiscovered = oceanIds.filter((id) =>
            state.discoveredAnimals.includes(id)
          ).length;
          shouldUnlock = oceanDiscovered === oceanIds.length;
          break;
        }
        case 'quiz-champion':
          shouldUnlock = state.quizCorrectCount >= 10;
          break;
        case 'daily-learner':
          shouldUnlock = state.dailyStreak >= 7;
          break;
        case 'reptile-fan': {
          const reptileCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === 'reptil'
          ).length;
          shouldUnlock = reptileCount >= 5;
          break;
        }
        case 'bird-watcher': {
          const birdCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === 'burung'
          ).length;
          shouldUnlock = birdCount >= 5;
          break;
        }
        case 'big-cat-family':
          shouldUnlock = get().isFamilyComplete('big-cat-family');
          break;
      }

      if (shouldUnlock) changed = true;
      return { ...badge, unlocked: badge.unlocked || shouldUnlock };
    });

    if (changed) {
      const newState = { badges: updatedBadges };
      set(newState);
      saveState({ ...get(), ...newState });
    }
  },

  checkNewBadges: () => {
    const state = get();
    const newlyUnlocked: string[] = [];
    const updatedBadges = state.badges.map((badge) => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;
      switch (badge.id) {
        case 'explorer':
          shouldUnlock = state.discoveredAnimals.length >= 10;
          break;
        case 'mammal-expert': {
          const mammalCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === 'mamalia'
          ).length;
          shouldUnlock = mammalCount >= 5;
          break;
        }
        case 'ocean-master': {
          const oceanIds = allAnimals.filter((a) => a.category === 'laut').map((a) => a.id);
          const oceanDiscovered = oceanIds.filter((id) =>
            state.discoveredAnimals.includes(id)
          ).length;
          shouldUnlock = oceanDiscovered === oceanIds.length;
          break;
        }
        case 'quiz-champion':
          shouldUnlock = state.quizCorrectCount >= 10;
          break;
        case 'daily-learner':
          shouldUnlock = state.dailyStreak >= 7;
          break;
        case 'reptile-fan': {
          const reptileCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === 'reptil'
          ).length;
          shouldUnlock = reptileCount >= 5;
          break;
        }
        case 'bird-watcher': {
          const birdCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === 'burung'
          ).length;
          shouldUnlock = birdCount >= 5;
          break;
        }
        case 'big-cat-family':
          shouldUnlock = get().isFamilyComplete('big-cat-family');
          break;
      }

      if (shouldUnlock) newlyUnlocked.push(badge.id);
      return { ...badge, unlocked: badge.unlocked || shouldUnlock };
    });

    if (newlyUnlocked.length > 0) {
      const newState = { badges: updatedBadges };
      set(newState);
      saveState({ ...get(), ...newState });
    }

    return newlyUnlocked;
  },

  getLevel: () => getLevelFromXP(get().xp),
  getAnimals: () => allAnimals,
  isDiscovered: (animalId) => get().discoveredAnimals.includes(animalId),
  isFavorite: (animalId) => get().favoriteAnimals.includes(animalId),
  getCollectionProgress: () => ({
    discovered: get().discoveredAnimals.length,
    total: allAnimals.length,
  }),
}));