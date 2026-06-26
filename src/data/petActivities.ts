/**
 * Aktivitas "Main Bareng" yang khas per kategori hewan.
 * Tujuannya supaya memelihara hewan dari kategori berbeda terasa berbeda,
 * tanpa menambah aset/animasi baru per spesies — cukup ganti label, emoji,
 * dan teks interaksi berdasarkan `category` yang sudah ada di data hewan.
 */

export interface CategoryActivity {
  emoji: string;
  label: string;
  /** Kalimat singkat yang muncul sesaat saat aksi ditekan, sebelum reaksi funFact */
  actionText: string;
}

export const CATEGORY_ACTIVITY: Record<string, CategoryActivity> = {
  mamalia: {
    emoji: "🎾",
    label: "Lempar Bola",
    actionText: "melempar bola untuk dikejar",
  },
  burung: {
    emoji: "🪽",
    label: "Latihan Terbang",
    actionText: "mengajak terbang berkeliling",
  },
  reptil: {
    emoji: "☀️",
    label: "Jemur di Batu",
    actionText: "menemani jemur di atas batu hangat",
  },
  laut: {
    emoji: "🌊",
    label: "Main Air",
    actionText: "bermain cipratan air bersama",
  },
  serangga: {
    emoji: "🌼",
    label: "Terbang Bareng Bunga",
    actionText: "mengajak terbang di antara bunga",
  },
  amfibi: {
    emoji: "💧",
    label: "Lompat-lompat",
    actionText: "main lompat-lompat di tepi kolam",
  },
};

export const DEFAULT_ACTIVITY: CategoryActivity = {
  emoji: "🎮",
  label: "Main Bareng",
  actionText: "bermain bersama",
};

export function getCategoryActivity(category: string): CategoryActivity {
  return CATEGORY_ACTIVITY[category] ?? DEFAULT_ACTIVITY;
}

/** Pilih satu funFact secara acak untuk dijadikan reaksi setelah berinteraksi. */
export function pickRandomFunFact(funFacts: string[]): string | null {
  if (!funFacts || funFacts.length === 0) return null;
  return funFacts[Math.floor(Math.random() * funFacts.length)];
}
