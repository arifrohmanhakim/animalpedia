export interface BadgeData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export const badges: BadgeData[] = [
  /** ===== PERTEMUAN PERTAMA ===== */
  {
    id: 'first-discovery',
    name: 'Penemu Pemula',
    emoji: '🌱',
    description: 'Temukan hewan pertamamu',
    color: '#A8D5BA',
  },
  {
    id: 'explorer',
    name: 'Penjelajah Muda',
    emoji: '🧭',
    description: 'Temukan 10 hewan berbeda',
    color: '#6C63FF',
  },
  {
    id: 'collector',
    name: 'Kolektor',
    emoji: '🎯',
    description: 'Temukan 25 hewan berbeda',
    color: '#E67E22',
  },
  {
    id: 'complete-collection',
    name: 'Master Koleksi',
    emoji: '👑',
    description: 'Temukan semua hewan di Animalpedia',
    color: '#F1C40F',
  },

  /** ===== KOLEKSI PER KATEGORI ===== */
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
    id: 'reptile-fan',
    name: 'Pecinta Reptil',
    emoji: '🦎',
    description: 'Kumpulkan 5 hewan reptil',
    color: '#8B4513',
  },
  {
    id: 'reptile-master',
    name: 'Master Reptil',
    emoji: '🐊',
    description: 'Kumpulkan semua hewan reptil',
    color: '#5D4037',
  },
  {
    id: 'bird-watcher',
    name: 'Pengamat Burung',
    emoji: '🐦',
    description: 'Kumpulkan 5 hewan burung',
    color: '#9B6FD1',
  },
  {
    id: 'bird-master',
    name: 'Master Burung',
    emoji: '🦅',
    description: 'Kumpulkan semua hewan burung',
    color: '#3E7CB1',
  },
  {
    id: 'insect-collector',
    name: 'Kolektor Serangga',
    emoji: '🦗',
    description: 'Kumpulkan 5 hewan serangga',
    color: '#689F38',
  },
  {
    id: 'amphibian-friend',
    name: 'Sahabat Amfibi',
    emoji: '🐸',
    description: 'Kumpulkan 3 hewan amfibi',
    color: '#4DB6AC',
  },

  /** ===== FAMILI ===== */
  {
    id: 'big-cat-family',
    name: 'Keluarga Kucing Besar',
    emoji: '🐅',
    description: 'Temukan semua anggota keluarga kucing besar',
    color: '#FF6B35',
  },
  {
    id: 'farm-friends',
    name: 'Peternak Cilik',
    emoji: '🐄',
    description: 'Temukan semua hewan ternak',
    color: '#D4A373',
  },
  {
    id: 'night-explorer',
    name: 'Penjelajah Malam',
    emoji: '🦉',
    description: 'Temukan semua hewan malam',
    color: '#2C3E50',
  },
  {
    id: 'water-birds',
    name: 'Pengamat Burung Air',
    emoji: '🦢',
    description: 'Temukan semua burung air',
    color: '#5DADE2',
  },

  /** ===== KUIS ===== */
  {
    id: 'first-quiz',
    name: 'Pertama Kuis',
    emoji: '📝',
    description: 'Selesaikan kuis pertamamu',
    color: '#F8BBD0',
  },
  {
    id: 'quiz-champion',
    name: 'Juara Kuis',
    emoji: '🏆',
    description: 'Jawab 10 pertanyaan kuis dengan benar',
    color: '#F2994A',
  },
  {
    id: 'quiz-master',
    name: 'Master Kuis',
    emoji: '⭐',
    description: 'Dapatkan bintang 3 di 5 kuis',
    color: '#FFC857',
  },

  /** ===== STREAK ===== */
  {
    id: 'streak-3',
    name: 'Konsisten',
    emoji: '📆',
    description: 'Main 3 hari berturut-turut',
    color: '#F39C12',
  },
  {
    id: 'daily-learner',
    name: 'Rajin Belajar',
    emoji: '🔥',
    description: 'Main 7 hari berturut-turut',
    color: '#FFC857',
  },
  {
    id: 'streak-30',
    name: 'Pantang Menyerah',
    emoji: '💪',
    description: 'Main 30 hari berturut-turut',
    color: '#E74C3C',
  },

  /** ===== LEVEL ===== */
  {
    id: 'level-5',
    name: 'Penjelajah Berpengalaman',
    emoji: '⬆️',
    description: 'Capai level 5',
    color: '#9B59B6',
  },
  {
    id: 'level-10',
    name: 'Penjelajah Legendaris',
    emoji: '🌟',
    description: 'Capai level 10',
    color: '#8E44AD',
  },
];