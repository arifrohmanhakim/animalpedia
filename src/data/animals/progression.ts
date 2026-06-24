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

  const completedCount = completedQuizzes.length;

  if (idx < completedCount) return 'completed';
  if (idx === completedCount) return 'current';
  return 'locked';
}

export function getCurrentAnimalId(completedQuizzes: string[]): string | null {
  if (completedQuizzes.length >= PROGRESSION_ORDER.length) return null; // all done
  return PROGRESSION_ORDER[completedQuizzes.length];
}
