export interface BadgeData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export const badges: BadgeData[] = [
  {
    id: 'explorer',
    name: 'Penjelajah Muda',
    emoji: '🧭',
    description: 'Temukan 10 hewan berbeda',
    color: '#6C63FF',
  },
  {
    id: 'mammal-expert',
    name: 'Ahli Mamalia',
    emoji: '🐘',
    description: 'Kumpulkan 5 hewan mamalia',
    color: '#3FA66C',
  },
  {
    id: 'ocean-master',
    name: 'Penguasa Laut',
    emoji: '🌊',
    description: 'Kumpulkan semua hewan laut',
    color: '#4FA8D8',
  },
  {
    id: 'quiz-champion',
    name: 'Juara Kuis',
    emoji: '🏆',
    description: 'Jawab 10 pertanyaan kuis dengan benar',
    color: '#F2994A',
  },
  {
    id: 'daily-learner',
    name: 'Rajin Belajar',
    emoji: '📅',
    description: 'Main 7 hari berturut-turut',
    color: '#FFC857',
  },
  {
    id: 'reptile-fan',
    name: 'Pecinta Reptil',
    emoji: '🦎',
    description: 'Kumpulkan 5 hewan reptil',
    color: '#8B4513',
  },
  {
    id: 'bird-watcher',
    name: 'Pengamat Burung',
    emoji: '🐦',
    description: 'Kumpulkan 5 hewan burung',
    color: '#9B6FD1',
  },
  {
    id: 'big-cat-family',
    name: 'Keluarga Kucing Besar',
    emoji: '🐅',
    description: 'Temukan semua anggota keluarga kucing besar',
    color: '#FF6B35',
  },
];