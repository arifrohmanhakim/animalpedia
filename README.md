# Animalpedia Kids 🦁

Aplikasi edukasi interaktif anak-anak untuk mengenal dunia hewan. Dibangun dengan **React + TypeScript + Vite**, menggunakan **Zustand** untuk state management dan **Tailwind CSS** untuk styling dengan desain sistem ala crayon (lucu, warna-warni, border tebal khas anak-anak).

## Fitur Utama

### 🔍 Jelajah Hewan
Peta perjalanan tematik berbasis zona (hutan rimba, lautan, peternakan, dll.) dengan progresi linear. Setiap zona memiliki background tile dan dekorasi SVG unik.

### 📖 Detail Hewan
- Info lengkap: habitat, makanan, usia, berat, status konservasi
- Foto asli (real images) saat tersedia
- **Narasi audio** — setiap hewan punya cerita first-person bergaya dongeng
- **Peta penyebaran** — lokasi geografis (Leaflet + peta dunia highlight)
- **Family Tree** — relasi dengan hewan lain dalam satu keluarga
- **Video** — embed YouTube edukatif
- **Suara lingkungan (ambience)** — efek suara habitat

### 🎯 Kuis & Mini Games
- **Kuis 5 soal** per hewan dengan skor bintang (1-3)
- **Tebak Suara** — tebak hewan dari suaranya
- **Tebak Gambar** — tebak hewan dari foto asli
- **Memory Card** — cocokkan pasangan hewan
- Progresi linear: buka hewan satu per satu dalam urutan tertentu

### 🏡 Peliharaan
Adopsi hewan favorit dengan sistem slot (level 1 = 1 slot, level 5 = 2 slot, level 10 = 3 slot):
- **3 stat** — Kenyang (decay 3%/jam), Senang (decay 3%/jam), Sayang (decay 2%/jam)
- **Interaksi** — Beri Makan 🍖🌾, Main Bareng 🎮, Elus-elus 💛
- **Mood** — hewan bisa bahagia 😊 atau kangen 😴
- **Ganti peliharaan** — modal konfirmasi saat slot penuh

### 📚 Koleksi
Album sticker hewan per kategori (Mamalia, Burung, Reptil, Laut, Serangga, Amfibi) dengan progress tracking.

### 🏅 Badge & Pencapaian
22 badge yang bisa di-unlock:
- Eksplorasi: *first-discovery*, *explorer*, *collector*, *complete-collection*
- Kategori: *mammal-expert*, *ocean-master*, *reptile-fan*, *reptile-master*, *bird-watcher*, *bird-master*, *insect-collector*, *amphibian-friend*
- Keluarga: *big-cat-family*, *farm-friends*, *night-explorer*, *water-birds*
- Kuis: *first-quiz*, *quiz-champion*, *quiz-master*
- Streak: *streak-3*, *daily-learner*, *streak-30*
- Level: *level-5*, *level-10*

### 👤 Profil
Avatar karakter (🦊 Rubah / 🐬 Lumba-lumba / 🦉 Burung Hantu), level & XP, streak harian, progres koleksi, dan seluruh badge.

### 🎮 Games Hub
Pusat permainan dengan 4 mode:
- Tebak Suara 🔊
- Tebak Gambar 📸
- Memory Card 🃏
- Kuis Cepat 🎯

### ✨ Lainnya
- **Splash screen** dengan animasi
- **Onboarding** multi-step (pilih karakter, usia, minat/kategori favorit)
- **Misi harian** — kuis hewan acak setiap hari (+10 XP)
- **Bottom navigation** — 5 tab (Home, Jelajah, Games, Koleksi, Profil)
- **PWA** — bisa diinstal ke layar utama HP
- **Animasi ambient** — efek suara habitat per hewan

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Bundler | Vite 8 |
| Routing | Zustand state-based (tanpa React Router) |
| State Management | Zustand 5 (persisted ke localStorage) |
| Styling | Tailwind CSS 3 + CSS custom properties |
| UI Library | shadcn/ui (Radix primitives) |
| Maps | Leaflet + react-leaflet |
| Chart | Recharts |
| PWA | vite-plugin-pwa |
| Font | Baloo 2 (display), Quicksand (body) — Google Fonts |

## Struktur Proyek

```
src/
├── pages/
│   └── Index.tsx              # Root component, routing logic
├── components/
│   ├── HomeScreen.tsx         # Tab Home — hero, lanjutan belajar, misi harian
│   ├── ExploreScreen.tsx      # Tab Jelajah — peta perjalanan zona
│   ├── GamesHub.tsx           # Tab Games — hub permainan
│   ├── CollectionScreen.tsx   # Tab Koleksi — album sticker
│   ├── ProfileScreen.tsx      # Tab Profil — badge, XP, peliharaan
│   ├── PetHouseScreen.tsx     # Rumah Peliharaan — stat, interaksi, mood
│   ├── AnimalDetailScreen.tsx # Detail hewan — overlay penuh
│   ├── QuizScreen.tsx         # Kuis 5 soal
│   ├── GameScreen.tsx         # Sound guessing game
│   ├── ImageGuessGame.tsx     # Image guessing game
│   ├── MemoryGame.tsx         # Card matching game
│   ├── BottomNav.tsx          # Navigasi bawah
│   ├── SplashScreen.tsx       # Splash screen
│   ├── OnboardingScreen.tsx   # Onboarding flow
│   ├── AudioNarrationModal.tsx # Narasi cerita audio
│   ├── FamilyTree.tsx         # Pohon keluarga hewan
│   ├── MapModal.tsx           # Peta penyebaran (Leaflet)
│   ├── SwapPetModal.tsx       # Modal konfirmasi ganti peliharaan
│   ├── AudioPlayer.tsx        # Komponen play suara hewan
│   ├── VideoPlayerModal.tsx   # Modal video YouTube
│   └── ToastNotification.tsx  # Notifikasi XP/badge
├── store/
│   └── gameStore.ts           # Zustand store (state + actions)
├── data/
│   └── animals/
│       ├── types.ts           # Interface Animal, FamilyMember, FamilyGroup
│       ├── index.ts           # Re-export semua data hewan
│       ├── categories.ts      # 7 kategori hewan + emoji
│       ├── families.ts        # 10 family tree (big-cat, farm, nocturnal, dll.)
│       ├── progression.ts     # Urutan progresi linear & helper
│       ├── badges.ts          # 22 definisi badge
│       └── *.ts               # ~69 file data hewan individual
├── hooks/
│   └── useSectionOffsets.ts   # Hook offset untuk background tile zona
├── lib/
│   ├── audio.ts               # Memuat & trigger suara hewan
│   ├── ambience.ts            # Suara lingkungan (habitat ambience)
│   └── utils.ts               # Utility helpers (cn, dll.)
├── globals.css                # Design tokens + utility classes
└── vite-env.d.ts
```

## Data Hewan

69 spesies hewan, masing-masing dengan field:

```typescript
interface Animal {
  id: string;              // unik, misal "singa"
  name: string;            // nama lokal (Indonesia)
  englishName: string;     // nama Inggris
  scientificName: string;  // nama latin (italic)
  emoji: string;           // emoji representasi
  illustrationSvg?: string;// SVG custom (jika ada)
  category: string;        // mamalia | burung | reptil | laut | serangga | amfibi
  habitat: string;         // deskripsi habitat
  habitatEmoji: string;    // emoji habitat
  food: string;            // jenis makanan
  foodEmoji: string;       // emoji makanan
  lifespan: string;        // rentang usia
  weight: string;          // berat
  description: string;     // paragraf deskripsi
  color: string;           // warna tema (hex)
  story: string;           // narasi dongeng first-person (untuk audio)
  funFacts: string[];      // fakta menarik (1-3)
  conservationStatus: string; // aman | rentan | terancam
  videoEmbedUrl: string;   // URL embed YouTube
  videoUrl: string;        // URL video
  distribution: string[];  // daftar wilayah penyebaran
  distributionCountries: string; // string negara
  soundUrl?: string;       // URL suara hewan
  imageUrl?: string;       // URL foto asli
}
```

7 kategori:
- 🐘 Mamalia, 🐦 Burung, 🦎 Reptil, 🐠 Laut, 🦋 Serangga, 🐸 Amfibi

10 family tree:
- Kucing Besar, Anjing Liar, Primata, Hewan Peternakan, Hewan Malam, Unggas Air, Kura-kura, Herbivora Afrika, Karnivora Laut, Laba-laba & Kalajengking

## Level Progresi

| Level | Title | XP Needed | Pet Slots |
|-------|-------|-----------|-----------|
| 1 | Penjelajah Kecil | 0 | 1 |
| 5 | Penjelajah Aktif | 100 | 2 |
| 10 | Penjelajah Hebat | 300 | 3 |
| 15 | Ahli Satwa | 600 | 3 |
| 25 | Master Animalpedia | 1.200 | 3 |

## Instalasi & Menjalankan

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

### PWA Icons

PWA icons perlu di-generate sebelum build:

```bash
npm run generate-icons
```

Ikon sumber: `public/icons/source-icon.png` (direferensi dari `vite.config.ts`).

## State Management

Semua state aplikasi dikelola oleh **Zustand store** (`src/store/gameStore.ts`), otomatis dipersist ke `localStorage` dengan key `animalpedia-kids-save`.

State utama:
- `showSplash`, `onboardingComplete` — flow awal
- `currentTab` — navigasi tab
- `playerName`, `selectedCharacter`, `ageRange`, `favoriteCategories` — profil pengguna
- `xp`, `discoveredAnimals`, `completedQuizzes`, `animalScores` — progres
- `petAnimals`, `petData` — data peliharaan (adoptedAt, lastFed, lastPlayed, lastPetted)
- `badges` — array 22 badge dengan status unlock
- `dailyChallengeDate`, `dailyChallengeCompleted` — misi harian
- `quizInProgress`, `currentQuizAnimalId` — state kuis aktif
- `lastViewedAnimalId` — navigasi "lanjutkan belajar"

## Sistem Peliharaan

Stat dihitung dari **waktu sejak interaksi terakhir** (decay per jam):
- **Kenyang** — decay 3%/jam sejak `lastFed`
- **Senang** — decay 3%/jam sejak `lastPlayed`
- **Sayang** — decay 2%/jam sejak `lastPetted`

Mood:
- **😊 Bahagia** — semua stat ≥ 50%
- **😴 Kangen** — salah satu stat < 50% (speech bubble + reassurance text)

Interaksi memberikan **+5 XP**.

## Arsitektur Navigasi

Navigasi menggunakan **state-based routing** (bukan React Router):
- Tab diatur lewat `currentTab` di Zustand
- Overlay (detail hewan, kuis, game) di-render kondisional di `Index.tsx`
- History management via `window.history.pushState` untuk back gesture
- Custom event `view-animal` untuk navigasi dari komponen dalam ke detail

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--cream` | `#FBF3E7` | Background utama |
| `--cream-deep` | `#F3E4CC` | Progress tracker bg |
| `--paper` | `#FFFCF6` | Card background |
| `--ink` | `#5B3E2B` | Text & border |
| `--ink-soft` | `#8C6B4F` | Secondary text |
| `--green` | `#3FA66C` | Primary/accent |
| `--orange` | `#F2994A` | CTA buttons |
| `--blue` | `#4FA8D8` | Ocean/water theme |
| `--yellow` | `#FFC857` | Highlight/sticker |

### Utility Classes Kustom

- `.crayon-card` — card style (border 3px + shadow 4px)
- `.crayon-btn` — button style (border 3px + shadow 3px, active state turun 2px)
- `.sticker-badge` — badge miring (rotate -4deg)
- `.progress-track` / `.progress-fill` — progress bar
- `.screen-container` / `.screen-scroll` — layout scroll
- `.animate-float`, `.animate-fade-in-up`, `.animate-scale-in`, `.animate-pulse-glow` — keyframe animations
- `.animate-stagger-1` s/d `.animate-stagger-5` — staggered entry animations

## Build

```bash
npm run build
```

Menghasilkan output di `dist/`. Build mencakup:
- Bundle React + TypeScript (SWC)
- CSS Tailwind (purged)
- PWA assets + service worker
- Leaflet styles
- Ikon PWA dari `scripts/generate-pwa-icons.mjs`
