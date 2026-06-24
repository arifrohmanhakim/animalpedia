import type { FamilyGroup, FamilyMember } from './types';

// ===== FAMILY GROUPS =====
export const families: FamilyGroup[] = [
  {
    id: 'big-cat-family',
    name: 'Kucing Besar',
    emoji: '🐅',
    members: [
      { animalId: 'singa', name: 'Singa', emoji: '🦁', exists: true },
      { animalId: 'harimau', name: 'Harimau', emoji: '🐅', exists: true },
      { animalId: 'macan-tutul', name: 'Macan Tutul', emoji: '🐆', exists: false },
      { animalId: 'jaguar', name: 'Jaguar', emoji: '🐆', exists: false },
    ],
  },
  {
    id: 'farm-animals',
    name: 'Hewan Ternak',
    emoji: '🐄',
    members: [
      { animalId: 'sapi', name: 'Sapi', emoji: '🐄', exists: true },
      { animalId: 'kambing', name: 'Kambing', emoji: '🐐', exists: true },
      { animalId: 'bebek', name: 'Bebek', emoji: '🦆', exists: true },
      { animalId: 'domba', name: 'Domba', emoji: '🐑', exists: true },
    ],
  },
  {
    id: 'primates',
    name: 'Primata',
    emoji: '🐒',
    members: [
      { animalId: 'monyet', name: 'Monyet', emoji: '🐒', exists: true },
      { animalId: 'gorila', name: 'Gorila', emoji: '🦍', exists: false },
      { animalId: 'orangutan', name: 'Orangutan', emoji: '🦧', exists: false },
    ],
  },
  {
    id: 'ocean-mammals',
    name: 'Mamalia Laut',
    emoji: '🐬',
    members: [
      { animalId: 'lumba-lumba', name: 'Lumba-lumba', emoji: '🐬', exists: true },
      { animalId: 'paus', name: 'Paus Biru', emoji: '🐋', exists: true },
    ],
  },
  {
    id: 'birds-of-prey',
    name: 'Burung Pemangsa',
    emoji: '🦅',
    members: [
      { animalId: 'elang', name: 'Elang', emoji: '🦅', exists: true },
      { animalId: 'elang-laut', name: 'Elang Laut', emoji: '🦅', exists: false },
    ],
  },
  {
    id: 'parrots',
    name: 'Burung Paruh Bengkok',
    emoji: '🦜',
    members: [
      { animalId: 'kakaktua', name: 'Kakatua', emoji: '🦜', exists: true },
      { animalId: 'merak', name: 'Merak', emoji: '🦚', exists: true },
    ],
  },
  {
    id: 'water-birds',
    name: 'Burung Air',
    emoji: '🦆',
    members: [
      { animalId: 'bebek', name: 'Bebek', emoji: '🦆', exists: true },
      { animalId: 'angsa', name: 'Angsa', emoji: '🦢', exists: true },
      { animalId: 'flamingo', name: 'Flamingo', emoji: '🦩', exists: true },
      { animalId: 'penguin', name: 'Penguin', emoji: '🐧', exists: true },
    ],
  },
  {
    id: 'reptiles',
    name: 'Reptil',
    emoji: '🦎',
    members: [
      { animalId: 'buaya', name: 'Buaya', emoji: '🐊', exists: true },
      { animalId: 'komodo', name: 'Komodo', emoji: '🦎', exists: true },
      { animalId: 'tokek', name: 'Tokek', emoji: '🦎', exists: true },
      { animalId: 'iguana', name: 'Iguana', emoji: '🦎', exists: true },
      { animalId: 'bunglon', name: 'Bunglon', emoji: '🦎', exists: true },
      { animalId: 'kura-kura', name: 'Kura-kura', emoji: '🐢', exists: true },
      { animalId: 'ular', name: 'Ular', emoji: '🐍', exists: true },
    ],
  },
  {
    id: 'insects',
    name: 'Serangga',
    emoji: '🦋',
    members: [
      { animalId: 'kupu-kupu', name: 'Kupu-kupu', emoji: '🦋', exists: true },
      { animalId: 'lebah', name: 'Lebah Madu', emoji: '🐝', exists: true },
      { animalId: 'semut', name: 'Semut', emoji: '🐜', exists: true },
      { animalId: 'capung', name: 'Capung', emoji: '🪰', exists: true },
      { animalId: 'kunang-kunang', name: 'Kunang-kunang', emoji: '✨', exists: true },
    ],
  },
  {
    id: 'amphibians',
    name: 'Amfibi',
    emoji: '🐸',
    members: [
      { animalId: 'katak', name: 'Katak', emoji: '🐸', exists: true },
      { animalId: 'salamander', name: 'Salamander', emoji: '🦎', exists: true },
      { animalId: 'axolotl', name: 'Axolotl', emoji: '🦎', exists: true },
    ],
  },
  {
    id: 'reef-creatures',
    name: 'Penghuni Karang',
    emoji: '🪸',
    members: [
      { animalId: 'ikan-badut', name: 'Ikan Badut', emoji: '🐠', exists: true },
      { animalId: 'kuda-laut', name: 'Kuda Laut', emoji: '🦑', exists: true },
      { animalId: 'bintang-laut', name: 'Bintang Laut', emoji: '⭐', exists: true },
      { animalId: 'gurita', name: 'Gurita', emoji: '🐙', exists: true },
    ],
  },
  {
    id: 'large-sharks',
    name: 'Hiu Besar',
    emoji: '🦈',
    members: [
      { animalId: 'hiu', name: 'Hiu', emoji: '🦈', exists: true },
    ],
  },
  {
    id: 'big-herbivores',
    name: 'Herbivora Besar',
    emoji: '🐘',
    members: [
      { animalId: 'gajah', name: 'Gajah', emoji: '🐘', exists: true },
      { animalId: 'jerapah', name: 'Jerapah', emoji: '🦒', exists: true },
    ],
  },
  {
    id: 'bears',
    name: 'Keluarga Beruang',
    emoji: '🐻',
    members: [
      { animalId: 'beruang', name: 'Beruang', emoji: '🐻', exists: true },
      { animalId: 'panda', name: 'Panda', emoji: '🐼', exists: true },
    ],
  },
];

/**
 * Cari group keluarga yang berisi animalId tertentu
 */
export function findFamilyForAnimal(animalId: string): FamilyGroup | null {
  return families.find((f) => f.members.some((m) => m.animalId === animalId)) ?? null;
}
