// --- Family Groups ---

export interface FamilyMember {
  animalId: string;
  name: string;
  emoji: string;
  exists: boolean;
}

export interface FamilyGroup {
  id: string;
  name: string;
  emoji: string;
  members: FamilyMember[];
}

export const families: FamilyGroup[] = [
  {
    id: 'big-cat-family',
    name: 'Kucing Besar',
    emoji: '🐅',
    members: [
      { animalId: 'singa', name: 'Singa', emoji: '🦁', exists: true },
      { animalId: 'harimau', name: 'Harimau', emoji: '🐅', exists: true },
      { animalId: 'kucing', name: 'Kucing', emoji: '🐱', exists: true },
      { animalId: 'macan-tutul', name: 'Macan Tutul', emoji: '🐆', exists: false },
      { animalId: 'jaguar', name: 'Jaguar', emoji: '🐆', exists: false },
    ],
  },
  {
    id: 'elephant-family',
    name: 'Gajah & Sahabat',
    emoji: '🐘',
    members: [
      { animalId: 'gajah', name: 'Gajah', emoji: '🐘', exists: true },
      { animalId: 'badak', name: 'Badak', emoji: '🦏', exists: false },
      { animalId: 'kuda-nil', name: 'Kuda Nil', emoji: '🦛', exists: false },
    ],
  },
  {
    id: 'giraffe-family',
    name: 'Jerapah & Zebra',
    emoji: '🦒',
    members: [
      { animalId: 'jerapah', name: 'Jerapah', emoji: '🦒', exists: true },
      { animalId: 'zebra', name: 'Zebra', emoji: '🦓', exists: true },
    ],
  },
  {
    id: 'bear-family',
    name: 'Beruang & Panda',
    emoji: '🐻',
    members: [
      { animalId: 'beruang', name: 'Beruang', emoji: '🐻', exists: true },
      { animalId: 'panda', name: 'Panda', emoji: '🐼', exists: true },
    ],
  },
  {
    id: 'farm-family',
    name: 'Hewan Ternak',
    emoji: '🐄',
    members: [
      { animalId: 'kambing', name: 'Kambing', emoji: '🐐', exists: true },
      { animalId: 'sapi', name: 'Sapi', emoji: '🐄', exists: true },
      { animalId: 'kuda', name: 'Kuda', emoji: '🐴', exists: true },
    ],
  },
  {
    id: 'australia-family',
    name: 'Hewan Australia',
    emoji: '🦘',
    members: [
      { animalId: 'kanguru', name: 'Kanguru', emoji: '🦘', exists: true },
      { animalId: 'koala', name: 'Koala', emoji: '🐨', exists: false },
    ],
  },
  {
    id: 'primate-family',
    name: 'Primata',
    emoji: '🐒',
    members: [
      { animalId: 'monyet', name: 'Monyet', emoji: '🐒', exists: true },
      { animalId: 'orangutan', name: 'Orangutan', emoji: '🦧', exists: false },
      { animalId: 'gorila', name: 'Gorila', emoji: '🦍', exists: false },
    ],
  },
  {
    id: 'beautiful-birds',
    name: 'Burung Cantik',
    emoji: '🦚',
    members: [
      { animalId: 'merak', name: 'Merak', emoji: '🦚', exists: true },
      { animalId: 'kakaktua', name: 'Kakaktua', emoji: '🦜', exists: true },
      { animalId: 'elang', name: 'Elang', emoji: '🦅', exists: true },
      { animalId: 'burung-hantu', name: 'Burung Hantu', emoji: '🦉', exists: true },
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
    id: 'reptile-family',
    name: 'Reptil',
    emoji: '🐊',
    members: [
      { animalId: 'buaya', name: 'Buaya', emoji: '🐊', exists: true },
      { animalId: 'komodo', name: 'Komodo', emoji: '🦎', exists: true },
      { animalId: 'kura-kura', name: 'Kura-kura', emoji: '🐢', exists: true },
      { animalId: 'ular', name: 'Ular', emoji: '🐍', exists: true },
      { animalId: 'bunglon', name: 'Bunglon', emoji: '🦎', exists: true },
      { animalId: 'tokek', name: 'Tokek', emoji: '🦎', exists: true },
      { animalId: 'iguana', name: 'Iguana', emoji: '🦎', exists: true },
    ],
  },
  {
    id: 'whale-family',
    name: 'Paus & Teman',
    emoji: '🐳',
    members: [
      { animalId: 'paus', name: 'Paus', emoji: '🐳', exists: true },
      { animalId: 'lumba-lumba', name: 'Lumba-lumba', emoji: '🐬', exists: true },
      { animalId: 'hiu', name: 'Hiu', emoji: '🦈', exists: true },
    ],
  },
  {
    id: 'sea-creatures',
    name: 'Hewan Laut',
    emoji: '🐙',
    members: [
      { animalId: 'gurita', name: 'Gurita', emoji: '🐙', exists: true },
      { animalId: 'ikan-badut', name: 'Ikan Badut', emoji: '🐠', exists: true },
      { animalId: 'bintang-laut', name: 'Bintang Laut', emoji: '⭐', exists: true },
      { animalId: 'kuda-laut', name: 'Kuda Laut', emoji: '🐠', exists: true },
      { animalId: 'penyu', name: 'Penyu', emoji: '🐢', exists: true },
    ],
  },
  {
    id: 'insect-family',
    name: 'Serangga',
    emoji: '🦋',
    members: [
      { animalId: 'kupu-kupu', name: 'Kupu-kupu', emoji: '🦋', exists: true },
      { animalId: 'lebah', name: 'Lebah', emoji: '🐝', exists: true },
      { animalId: 'semut', name: 'Semut', emoji: '🐜', exists: true },
      { animalId: 'capung', name: 'Capung', emoji: '🪰', exists: true },
      { animalId: 'kunang-kunang', name: 'Kunang-kunang', emoji: '🪲', exists: true },
    ],
  },
  {
    id: 'amphibian-family',
    name: 'Amfibi',
    emoji: '🐸',
    members: [
      { animalId: 'katak', name: 'Katak', emoji: '🐸', exists: true },
      { animalId: 'salamander', name: 'Salamander', emoji: '🦎', exists: true },
      { animalId: 'axolotl', name: 'Axolotl', emoji: '🦎', exists: true },
    ],
  },
];

export function findFamilyForAnimal(animalId: string): FamilyGroup | null {
  return families.find((family) =>
    family.members.some((m) => m.animalId === animalId)
  ) ?? null;
}