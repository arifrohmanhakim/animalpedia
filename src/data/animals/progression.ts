/**
 * Progression order for gamified exploration.
 * Animals must be completed (quiz finished) in this exact order.
 * The first uncompleted animal is the "current" target;
 * everything after it is "locked".
 *
 * NOTE: Order is grouped by category (mamalia -> burung -> reptil ->
 * laut -> serangga -> amfibi) to match the visual zone grouping in
 * ExploreScreen. This ensures the next unlockable animal is always
 * visible in the same zone the player just completed, instead of
 * jumping to a different zone the player has not scrolled to yet.
 */
export const PROGRESSION_ORDER: string[] = [
  "singa",
  "gajah",
  "harimau",
  "jerapah",
  "panda",
  "kanguru",
  "beruang",
  "monyet",
  "kambing",
  "sapi",
  "kambing-gunung",
  "zebra",
  "kucing",
  "anjing",
  "kelinci",
  "kuda",
  "domba",
  "rubah",
  "rusa",
  "unta",
  "badak",
  "gorila",
  "macan-tutul",
  "serigala",
  "tikus",
  "kelelawar",
  "elang",
  "penguin",
  "bebek",
  "kakaktua",
  "merak",
  "flamingo",
  "angsa",
  "burung-hantu",
  "cendrawasih",
  "elang-laut",
  "buaya",
  "ular",
  "komodo",
  "tokek",
  "penyu",
  "iguana",
  "kura-kura",
  "bunglon",
  "kobra",
  "kadal",
  "lumba-lumba",
  "paus",
  "gurita",
  "hiu",
  "ikan-badut",
  "bintang-laut",
  "kuda-laut",
  "kepiting",
  "ubur-ubur",
  "paus-pembunuh",
  "singa-laut",
  "kupu-kupu",
  "lebah",
  "semut",
  "capung",
  "kunang-kunang",
  "belalang",
  "kumbang",
  "laba-laba",
  "katak",
  "salamander",
  "axolotl",
  "kodok",
];

export type ProgressionState = "locked" | "current" | "completed";

export function getProgressionState(
  animalId: string,
  completedQuizzes: string[],
): ProgressionState {
  const idx = PROGRESSION_ORDER.indexOf(animalId);
  if (idx === -1) return "locked"; // not in progression → treat as locked

  const completedSet = new Set(completedQuizzes);

  // Already completed? → completed
  if (completedSet.has(animalId)) return "completed";

  // Find the first incomplete animal in progression order → that's 'current'
  const firstIncomplete = PROGRESSION_ORDER.find((id) => !completedSet.has(id));
  if (!firstIncomplete) return "locked"; // all done (shouldn't reach this branch)

  const currentIdx = PROGRESSION_ORDER.indexOf(firstIncomplete);

  if (idx < currentIdx) return "completed"; // before current → must be completed
  if (idx === currentIdx) return "current";
  return "locked";
}

export function getCurrentAnimalId(completedQuizzes: string[]): string | null {
  const completedSet = new Set(completedQuizzes);
  for (const id of PROGRESSION_ORDER) {
    if (!completedSet.has(id)) return id;
  }
  return null; // all done
}

/**
 * Returns how many animals from the start of PROGRESSION_ORDER
 * have been completed (in-sequence). Animals completed out of order
 * are ignored for this count.
 */
export function getInSequenceCompletedCount(
  completedQuizzes: string[],
): number {
  const completedSet = new Set(completedQuizzes);
  let count = 0;
  for (const id of PROGRESSION_ORDER) {
    if (completedSet.has(id)) count++;
    else break;
  }
  return count;
}
