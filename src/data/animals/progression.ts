/**
 * Progression order for gamified exploration.
 * Animals must be completed (quiz finished) in this exact order.
 * The first uncompleted animal is the "current" target;
 * everything after it is "locked".
 */
export const PROGRESSION_ORDER: string[] = [
  'singa',
  'gajah',
  'harimau',
  'jerapah',
  'panda',
  'lumba_lumba',
  'elang',
  'paus',
  'kupu_kupu',
  'buaya',
  'kanguru',
  'beruang',
  'katak',
  'ular',
  'gurita',
  'komodo',
  'lebah',
  'penguin',
  'monyet',
  'hiu',
  'kambing',
  'sapi',
  'bebek',
  'kakaktua',
  'tokek',
  'penyu',
  'ikan_badut',
  'merak',
  'bintang_laut',
  'semut',
  'kuda_laut',
  'capung',
  'flamingo',
  'iguana',
  'angsa',
  'kura_kura',
  'bunglon',
  'kunang_kunang',
  'salamander',
  'axolotl',
  'kambing_gunung',
  'zebra',
  'kucing',
  'anjing',
  'kelinci',
  'kuda',
  'domba',
  'rubah',
  'rusa',
  'unta',
  'badak',
  'gorila',
  'macan_tutul',
  'serigala',
  'tikus',
  'kelelawar',
  'burung_hantu',
  'cendrawasih',
  'elang_laut',
  'kobra',
  'kadal',
  'kepiting',
  'ubur_ubur',
  'paus_pembunuh',
  'singa_laut',
  'belalang',
  'kumbang',
  'laba_laba',
  'kodok',
];

export type ProgressionState = 'locked' | 'current' | 'completed';

export function getProgressionState(
  animalId: string,
  completedQuizzes: string[],
): ProgressionState {
  const idx = PROGRESSION_ORDER.indexOf(animalId);
  if (idx === -1) return 'locked'; // not in progression → treat as locked

  const completedSet = new Set(completedQuizzes);

  // Already completed? → completed
  if (completedSet.has(animalId)) return 'completed';

  // Find the first incomplete animal in progression order → that's 'current'
  const firstIncomplete = PROGRESSION_ORDER.find((id) => !completedSet.has(id));
  if (!firstIncomplete) return 'locked'; // all done (shouldn't reach this branch)

  const currentIdx = PROGRESSION_ORDER.indexOf(firstIncomplete);

  if (idx < currentIdx) return 'completed'; // before current → must be completed
  if (idx === currentIdx) return 'current';
  return 'locked';
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
export function getInSequenceCompletedCount(completedQuizzes: string[]): number {
  const completedSet = new Set(completedQuizzes);
  let count = 0;
  for (const id of PROGRESSION_ORDER) {
    if (completedSet.has(id)) count++;
    else break;
  }
  return count;
}
