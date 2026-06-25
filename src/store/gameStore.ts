import { create } from "zustand";
import {
  animals as allAnimals,
  families,
  getProgressionState,
  getCurrentAnimalId,
} from "../data/animals";
import type { ProgressionState } from "../data/animals";
import { badges as badgeList } from "../data/badges";

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  unlocked: boolean;
}

interface PetData {
  adoptedAt: string; // ISO date string
  lastFed: string | null;
  lastPlayed: string | null;
  lastPetted: string | null;
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
  petAnimals: string[];
  petData: Record<string, PetData>;
  quizCorrectCount: number;
  completedQuizzes: string[];
  animalScores: Record<string, { score: number; total: number }>;
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
  adoptPet: (animalId: string) => "adopted" | "already-owned" | "slots-full";
  setLastViewedAnimal: (animalId: string) => void;
  addXP: (amount: number) => void;
  recordCorrectQuiz: () => void;
  startQuiz: (animalId: string) => void;
  endQuiz: () => void;
  checkBadges: () => void;
  checkNewBadges: () => string[];
  completeDailyChallenge: () => void;
  setActiveGame: (game: string | null) => void;
  getLevel: () => {
    level: number;
    title: string;
    xpForNext: number;
    progress: number;
  };
  getAnimals: () => typeof allAnimals;
  recordCompletedQuiz: (animalId: string) => void;
  recordQuizScore: (animalId: string, score: number, total: number) => void;
  getQuizScore: (
    animalId: string,
  ) => { score: number; total: number } | undefined;
  getProgressionState: (animalId: string) => ProgressionState;
  getCurrentAnimalId: () => string | null;
  isDiscovered: (animalId: string) => boolean;
  isFavorite: (animalId: string) => boolean;
  isPetOwned: (animalId: string) => boolean;
  feedPet: (animalId: string) => void;
  playWithPet: (animalId: string) => void;
  petPet: (animalId: string) => void;
  releasePet: (animalId: string) => void;
  swapPet: (releaseId: string, adoptId: string) => void;
  getPetHunger: (animalId: string) => number;
  getPetHappiness: (animalId: string) => number;
  getPetAffection: (animalId: string) => number;
  getPetDaysSinceAdopted: (animalId: string) => number;
  getPetSlots: () => number;
  getCollectionProgress: () => { discovered: number; total: number };
  isFamilyComplete: (familyId: string) => boolean;
}

const STORAGE_KEY = "animalpedia-kids-save";

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
      petAnimals: state.petAnimals,
      petData: state.petData,
      quizCorrectCount: state.quizCorrectCount,
      completedQuizzes: state.completedQuizzes,
      animalScores: state.animalScores,
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
    { level: 1, title: "Penjelajah Kecil", xpNeeded: 0 },
    { level: 5, title: "Penjelajah Aktif", xpNeeded: 100 },
    { level: 10, title: "Penjelajah Hebat", xpNeeded: 300 },
    { level: 15, title: "Ahli Satwa", xpNeeded: 600 },
    { level: 25, title: "Master Animalpedia", xpNeeded: 1200 },
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

/** Compute pet stat percentage based on hours since last interaction */
function getPetStatPercentage(
  lastInteraction: string | null,
  decayPerHour: number,
): number {
  if (!lastInteraction) return 0;
  const hoursSince =
    (Date.now() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60);
  return Math.max(
    0,
    Math.min(100, Math.round(100 - hoursSince * decayPerHour)),
  );
}

/** How many pet slots the player has based on level */
function getPetSlotsForLevel(level: number): number {
  if (level >= 10) return 3;
  if (level >= 5) return 2;
  return 1;
}

const savedState = loadState();
const today = new Date().toDateString();
const dailyChallengeCompleted =
  savedState?.dailyChallengeDate === today
    ? (savedState?.dailyChallengeCompleted ?? false)
    : false;

let initialDailyStreak = savedState?.dailyStreak ?? 0;
let initialLastLoginDate = savedState?.lastLoginDate ?? "";

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

// Migrate old petAnimals to petData if needed
let initialPetData = savedState?.petData ?? {};
const oldPetAnimals: string[] = savedState?.petAnimals ?? [];
if (oldPetAnimals.length > 0 && Object.keys(initialPetData).length === 0) {
  const now = new Date().toISOString();
  initialPetData = {};
  for (const id of oldPetAnimals) {
    initialPetData[id] = {
      adoptedAt: now,
      lastFed: null,
      lastPlayed: null,
      lastPetted: null,
    };
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  showSplash: true,
  onboardingComplete: savedState?.onboardingComplete ?? false,
  currentTab: "home",

  playerName: savedState?.playerName ?? "",
  selectedCharacter: savedState?.selectedCharacter ?? "",
  ageRange: savedState?.ageRange ?? "",
  favoriteCategories: savedState?.favoriteCategories ?? [],

  xp: savedState?.xp ?? 0,
  discoveredAnimals: savedState?.discoveredAnimals ?? [],
  favoriteAnimals: savedState?.favoriteAnimals ?? [],
  petAnimals: savedState?.petAnimals ?? [],
  petData: initialPetData,
  quizCorrectCount: savedState?.quizCorrectCount ?? 0,
  completedQuizzes: savedState?.completedQuizzes ?? [],
  animalScores: savedState?.animalScores ?? {},
  lastLoginDate: initialLastLoginDate,
  dailyStreak: initialDailyStreak,
  badges:
    savedState?.badges ?? badgeList.map((b) => ({ ...b, unlocked: false })),

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

  adoptPet: (animalId) => {
    const state = get();
    if (state.petAnimals.includes(animalId)) return "already-owned";
    if (
      state.petAnimals.length >=
      getPetSlotsForLevel(getLevelFromXP(state.xp).level)
    )
      return "slots-full";

    const now = new Date().toISOString();
    const newPetAnimals = [...state.petAnimals, animalId];
    const newPetData = {
      ...state.petData,
      [animalId]: {
        adoptedAt: now,
        lastFed: null,
        lastPlayed: null,
        lastPetted: null,
      },
    };
    const newState = { petAnimals: newPetAnimals, petData: newPetData };
    set(newState);
    saveState({ ...get(), ...newState });
    return "adopted";
  },

  feedPet: (animalId) => {
    const state = get();
    const now = new Date().toISOString();
    const pet = state.petData[animalId];
    if (!pet) return;
    const newPetData = {
      ...state.petData,
      [animalId]: { ...pet, lastFed: now },
    };
    const newState = { petData: newPetData, xp: state.xp + 5 };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  playWithPet: (animalId) => {
    const state = get();
    const now = new Date().toISOString();
    const pet = state.petData[animalId];
    if (!pet) return;
    const newPetData = {
      ...state.petData,
      [animalId]: { ...pet, lastPlayed: now },
    };
    const newState = { petData: newPetData, xp: state.xp + 5 };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  petPet: (animalId) => {
    const state = get();
    const now = new Date().toISOString();
    const pet = state.petData[animalId];
    if (!pet) return;
    const newPetData = {
      ...state.petData,
      [animalId]: { ...pet, lastPetted: now },
    };
    const newState = { petData: newPetData, xp: state.xp + 5 };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  releasePet: (animalId) => {
    const state = get();
    const newPetAnimals = state.petAnimals.filter((id) => id !== animalId);
    const newPetData = { ...state.petData };
    delete newPetData[animalId];
    const newState = { petAnimals: newPetAnimals, petData: newPetData };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  swapPet: (releaseId, adoptId) => {
    const state = get();
    const now = new Date().toISOString();
    const newPetAnimals = state.petAnimals
      .filter((id) => id !== releaseId)
      .concat(adoptId);
    const newPetData = { ...state.petData };
    delete newPetData[releaseId];
    newPetData[adoptId] = {
      adoptedAt: now,
      lastFed: null,
      lastPlayed: null,
      lastPetted: null,
    };
    const newState = { petAnimals: newPetAnimals, petData: newPetData };
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

  recordCompletedQuiz: (animalId: string) => {
    const state = get();
    if (state.completedQuizzes.includes(animalId)) return;

    const newCompleted = [...state.completedQuizzes, animalId];
    const newState = { completedQuizzes: newCompleted };
    set(newState);
    get().checkBadges();
    saveState({ ...get(), ...newState });
  },

  recordQuizScore: (animalId: string, score: number, total: number) => {
    const state = get();
    const prev = state.animalScores[animalId];
    // Only keep the best score
    if (prev && prev.score >= score) return;
    const newScores = { ...state.animalScores, [animalId]: { score, total } };
    const newState = { animalScores: newScores };
    set(newState);
    saveState({ ...get(), ...newState });
  },

  getQuizScore: (animalId: string) => {
    return get().animalScores[animalId];
  },

  getProgressionState: (animalId: string) =>
    getProgressionState(animalId, get().completedQuizzes),

  getCurrentAnimalId: () => getCurrentAnimalId(get().completedQuizzes),

  startQuiz: (animalId) =>
    set({ quizInProgress: true, currentQuizAnimalId: animalId }),
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
    return existentMembers.every((m) =>
      state.discoveredAnimals.includes(m.animalId),
    );
  },

  checkBadges: () => {
    const state = get();
    let changed = false;
    const updatedBadges = state.badges.map((badge) => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;
      switch (badge.id) {
        case "first-discovery":
          shouldUnlock = state.discoveredAnimals.length >= 1;
          break;
        case "explorer":
          shouldUnlock = state.discoveredAnimals.length >= 10;
          break;
        case "collector":
          shouldUnlock = state.discoveredAnimals.length >= 25;
          break;
        case "complete-collection":
          shouldUnlock = state.discoveredAnimals.length === allAnimals.length;
          break;
        case "mammal-expert": {
          const mammalCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === "mamalia",
          ).length;
          shouldUnlock = mammalCount >= 5;
          break;
        }
        case "ocean-master": {
          const oceanIds = allAnimals
            .filter((a) => a.category === "laut")
            .map((a) => a.id);
          const oceanDiscovered = oceanIds.filter((id) =>
            state.discoveredAnimals.includes(id),
          ).length;
          shouldUnlock = oceanDiscovered === oceanIds.length;
          break;
        }
        case "reptile-fan": {
          const reptileCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === "reptil",
          ).length;
          shouldUnlock = reptileCount >= 5;
          break;
        }
        case "reptile-master": {
          const reptileIds = allAnimals
            .filter((a) => a.category === "reptil")
            .map((a) => a.id);
          const reptileDiscovered = reptileIds.filter((id) =>
            state.discoveredAnimals.includes(id),
          ).length;
          shouldUnlock = reptileDiscovered === reptileIds.length;
          break;
        }
        case "bird-watcher": {
          const birdCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === "burung",
          ).length;
          shouldUnlock = birdCount >= 5;
          break;
        }
        case "bird-master": {
          const birdIds = allAnimals
            .filter((a) => a.category === "burung")
            .map((a) => a.id);
          const birdDiscovered = birdIds.filter((id) =>
            state.discoveredAnimals.includes(id),
          ).length;
          shouldUnlock = birdDiscovered === birdIds.length;
          break;
        }
        case "insect-collector": {
          const insectCount = state.discoveredAnimals.filter(
            (id) =>
              allAnimals.find((a) => a.id === id)?.category === "serangga",
          ).length;
          shouldUnlock = insectCount >= 5;
          break;
        }
        case "amphibian-friend": {
          const amphibianCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === "amfibi",
          ).length;
          shouldUnlock = amphibianCount >= 3;
          break;
        }
        case "big-cat-family":
          shouldUnlock = get().isFamilyComplete("big-cat-family");
          break;
        case "farm-friends":
          shouldUnlock = get().isFamilyComplete("farm-animals");
          break;
        case "night-explorer":
          shouldUnlock = get().isFamilyComplete("nocturnal");
          break;
        case "water-birds":
          shouldUnlock = get().isFamilyComplete("water-birds");
          break;
        case "first-quiz":
          shouldUnlock = state.completedQuizzes.length >= 1;
          break;
        case "quiz-champion":
          shouldUnlock = state.quizCorrectCount >= 10;
          break;
        case "quiz-master": {
          const threeStarCount = Object.values(state.animalScores).filter(
            (s) => s.score === s.total && s.total > 0,
          ).length;
          shouldUnlock = threeStarCount >= 5;
          break;
        }
        case "streak-3":
          shouldUnlock = state.dailyStreak >= 3;
          break;
        case "daily-learner":
          shouldUnlock = state.dailyStreak >= 7;
          break;
        case "streak-30":
          shouldUnlock = state.dailyStreak >= 30;
          break;
        case "level-5":
          shouldUnlock = getLevelFromXP(state.xp).level >= 5;
          break;
        case "level-10":
          shouldUnlock = getLevelFromXP(state.xp).level >= 10;
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
        case "first-discovery":
          shouldUnlock = state.discoveredAnimals.length >= 1;
          break;
        case "explorer":
          shouldUnlock = state.discoveredAnimals.length >= 10;
          break;
        case "collector":
          shouldUnlock = state.discoveredAnimals.length >= 25;
          break;
        case "complete-collection":
          shouldUnlock = state.discoveredAnimals.length === allAnimals.length;
          break;
        case "mammal-expert": {
          const mammalCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === "mamalia",
          ).length;
          shouldUnlock = mammalCount >= 5;
          break;
        }
        case "ocean-master": {
          const oceanIds = allAnimals
            .filter((a) => a.category === "laut")
            .map((a) => a.id);
          const oceanDiscovered = oceanIds.filter((id) =>
            state.discoveredAnimals.includes(id),
          ).length;
          shouldUnlock = oceanDiscovered === oceanIds.length;
          break;
        }
        case "reptile-fan": {
          const reptileCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === "reptil",
          ).length;
          shouldUnlock = reptileCount >= 5;
          break;
        }
        case "reptile-master": {
          const reptileIds = allAnimals
            .filter((a) => a.category === "reptil")
            .map((a) => a.id);
          const reptileDiscovered = reptileIds.filter((id) =>
            state.discoveredAnimals.includes(id),
          ).length;
          shouldUnlock = reptileDiscovered === reptileIds.length;
          break;
        }
        case "bird-watcher": {
          const birdCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === "burung",
          ).length;
          shouldUnlock = birdCount >= 5;
          break;
        }
        case "bird-master": {
          const birdIds = allAnimals
            .filter((a) => a.category === "burung")
            .map((a) => a.id);
          const birdDiscovered = birdIds.filter((id) =>
            state.discoveredAnimals.includes(id),
          ).length;
          shouldUnlock = birdDiscovered === birdIds.length;
          break;
        }
        case "insect-collector": {
          const insectCount = state.discoveredAnimals.filter(
            (id) =>
              allAnimals.find((a) => a.id === id)?.category === "serangga",
          ).length;
          shouldUnlock = insectCount >= 5;
          break;
        }
        case "amphibian-friend": {
          const amphibianCount = state.discoveredAnimals.filter(
            (id) => allAnimals.find((a) => a.id === id)?.category === "amfibi",
          ).length;
          shouldUnlock = amphibianCount >= 3;
          break;
        }
        case "big-cat-family":
          shouldUnlock = get().isFamilyComplete("big-cat-family");
          break;
        case "farm-friends":
          shouldUnlock = get().isFamilyComplete("farm-animals");
          break;
        case "night-explorer":
          shouldUnlock = get().isFamilyComplete("nocturnal");
          break;
        case "water-birds":
          shouldUnlock = get().isFamilyComplete("water-birds");
          break;
        case "first-quiz":
          shouldUnlock = state.completedQuizzes.length >= 1;
          break;
        case "quiz-champion":
          shouldUnlock = state.quizCorrectCount >= 10;
          break;
        case "quiz-master": {
          const threeStarCount = Object.values(state.animalScores).filter(
            (s) => s.score === s.total && s.total > 0,
          ).length;
          shouldUnlock = threeStarCount >= 5;
          break;
        }
        case "streak-3":
          shouldUnlock = state.dailyStreak >= 3;
          break;
        case "daily-learner":
          shouldUnlock = state.dailyStreak >= 7;
          break;
        case "streak-30":
          shouldUnlock = state.dailyStreak >= 30;
          break;
        case "level-5":
          shouldUnlock = getLevelFromXP(state.xp).level >= 5;
          break;
        case "level-10":
          shouldUnlock = getLevelFromXP(state.xp).level >= 10;
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
  isPetOwned: (animalId) => get().petAnimals.includes(animalId),
  getPetHunger: (animalId) => {
    const pet = get().petData[animalId];
    if (!pet) return 0;
    return getPetStatPercentage(pet.lastFed, 3);
  },
  getPetHappiness: (animalId) => {
    const pet = get().petData[animalId];
    if (!pet) return 0;
    return getPetStatPercentage(pet.lastPlayed, 3);
  },
  getPetAffection: (animalId) => {
    const pet = get().petData[animalId];
    if (!pet) return 0;
    return getPetStatPercentage(pet.lastPetted, 2);
  },
  getPetDaysSinceAdopted: (animalId) => {
    const pet = get().petData[animalId];
    if (!pet) return 0;
    const msSince = Date.now() - new Date(pet.adoptedAt).getTime();
    return Math.max(1, Math.floor(msSince / (1000 * 60 * 60 * 24)));
  },
  getPetSlots: () => {
    return getPetSlotsForLevel(getLevelFromXP(get().xp).level);
  },
  getCollectionProgress: () => ({
    discovered: get().discoveredAnimals.length,
    total: allAnimals.length,
  }),
}));
