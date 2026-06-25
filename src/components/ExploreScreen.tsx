import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { useGameStore } from "@/store/gameStore";
import {
  animals,
  PROGRESSION_ORDER,
  getInSequenceCompletedCount,
} from "@/data/animals";
import type { Animal } from "@/data/animals/types";
import type { ProgressionState } from "@/data/animals";
import { playAnimalSound } from "@/lib/audio";
import { showToastInfo } from "@/components/ToastNotification";
import { useSectionOffsets } from "@/hooks/useSectionOffsets";

/* ======== SVG PLANT ILLUSTRATIONS ======== */

const PLANT_SVGS = {
  grassA: `<svg viewBox="0 0 30 36" width="30" height="36"><path d="M15 36 Q6 18 3 2" stroke="#4CAF50" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M15 36 Q16 14 15 1" stroke="#66BB6A" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M15 36 Q24 18 27 3" stroke="#388E3C" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
  grassB: `<svg viewBox="0 0 36 30" width="36" height="30"><path d="M18 30 Q\t8 16 4 2" stroke="#66BB6A" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18 30 Q18 12 18 1" stroke="#81C784" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18 30 Q28 16 32 3" stroke="#4CAF50" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18 30 Q12 18 6 8" stroke="#2E7D32" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18 30 Q24 18 30 8" stroke="#388E3C" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  grassC: `<svg viewBox="0 0 24 28" width="24" height="28"><path d="M12 28 Q6 16 4 4" stroke="#8BC34A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12 28 Q12 14 12 2" stroke="#66BB6A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12 28 Q18 16 20 5" stroke="#4CAF50" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  bush: `<svg viewBox="0 0 50 36" width="50" height="36"><ellipse cx="18" cy="20" rx="16" ry="14" fill="#43A047" opacity="0.8"/><ellipse cx="34" cy="22" rx="14" ry="12" fill="#66BB6A" opacity="0.8"/><ellipse cx="25" cy="18" rx="18" ry="15" fill="#388E3C" opacity="0.7"/><ellipse cx="22" cy="14" rx="8" ry="7" fill="#81C784" opacity="0.5"/></svg>`,
  treeA: `<svg viewBox="0 0 50 70" width="50" height="70"><rect x="22" y="38" width="6" height="32" rx="2" fill="#8D6E63"/><ellipse cx="25" cy="30" rx="22" ry="20" fill="#388E3C"/><ellipse cx="18" cy="24" rx="14" ry="12" fill="#4CAF50"/><ellipse cx="34" cy="28" rx="12" ry="10" fill="#43A047"/><ellipse cx="25" cy="20" rx="8" ry="6" fill="#66BB6A"/></svg>`,
  treeB: `<svg viewBox="0 0 42 65" width="42" height="65"><rect x="18" y="36" width="6" height="29" rx="2" fill="#A1887F"/><ellipse cx="21" cy="20" rx="18" ry="24" fill="#2E7D32"/><ellipse cx="21" cy="28" rx="20" ry="16" fill="#388E3C"/><circle cx="14" cy="16" r="8" fill="#43A047"/><circle cx="28" cy="18" r="7" fill="#4CAF50"/></svg>`,
  flower: `<svg viewBox="0 0 24 34" width="24" height="34"><path d="M12 34 Q10 22 12 12" stroke="#4CAF50" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="10" cy="9" r="4" fill="#FF7043"/><circle cx="14" cy="11" r="4" fill="#FF8A65"/><circle cx="12" cy="7" r="4" fill="#FF5722"/><circle cx="12" cy="10" r="2" fill="#FDD835"/></svg>`,
  fern: `<svg viewBox="0 0 40 32" width="40" height="32"><path d="M20 32 Q18 20 20 2" stroke="#388E3C" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M20 20 Q28 16 34 14" stroke="#4CAF50" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M20 16 Q12 12 6 10" stroke="#43A047" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M20 24 Q30 22 36 22" stroke="#66BB6A" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M20 12 Q10 8 4 6" stroke="#66BB6A" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
};

const TILE_NATIVE_WIDTH = 1224;
const TILE_NATIVE_HEIGHT = 800;

const MAP_BACKGROUND_IMAGE: Record<string, string> = {
  mamalia: "/bg-mamalia.png",
  burung: "/bg-burung.png",
  reptil: "/bg-reptil.png",
  laut: "/bg-laut.png",
  serangga: "/bg-serangga.png",
  amfibi: "/bg-amfibi.png",
};

const ZONE_TINT: Record<string, string> = {
  mamalia: "#9fc20f",
  burung: "#b8d4a0",
  reptil: "#e3c98a",
  laut: "#1a6f96",
  serangga: "#a9d66a",
  amfibi: "#7fc4a8",
};

type PlantType = keyof typeof PLANT_SVGS;

function ZoneDecoration({
  type,
  side,
  top,
  scale,
  svg,
}: {
  type: string;
  side: string;
  top: number;
  scale: number;
  svg?: string;
}) {
  const isCustom = !!svg;
  const svgContent = isCustom ? svg! : PLANT_SVGS[type as PlantType];
  if (!svgContent) return null;

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        [side as "left" | "right"]:
          !isCustom && (type === "treeA" || type === "treeB") ? "4px" : "8px",
        top: `${top}px`,
        transform: `scale(${scale})`,
        opacity: isCustom ? 0.45 : type.startsWith("tree") ? 0.55 : 0.5,
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.12))",
        zIndex: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

/* ======== THEMED ZONE SECTION ======== */

function ThemedZoneSection({
  groupKey,
  category,
  topOffset,
  containerWidth,
  isFirst,
  prevCategory,
  registerRef,
  children,
}: {
  groupKey: string;
  category: string;
  topOffset: number | undefined;
  containerWidth: number;
  isFirst: boolean;
  prevCategory: string | null;
  registerRef: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}) {
  const bgImage = MAP_BACKGROUND_IMAGE[category];

  const renderedTileWidth = containerWidth * 1.2;
  const renderedTileHeight =
    renderedTileWidth * (TILE_NATIVE_HEIGHT / TILE_NATIVE_WIDTH);
  const offsetY = topOffset !== undefined ? topOffset % renderedTileHeight : 0;

  return (
    <div
      ref={registerRef}
      data-section={category}
      style={{ position: "relative" }}
    >
      {/* Background layer — posisinya "tahu" lokasi globalnya */}
      {bgImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundRepeat: "repeat",
            backgroundSize: `${renderedTileWidth}px ${renderedTileHeight}px`,
            backgroundPosition: `center -${offsetY}px`,
            zIndex: 0,
          }}
        />
      )}

      {/* Transisi blend dari kategori sebelumnya */}
      {!isFirst && prevCategory && (
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "64px",
            background: `linear-gradient(to bottom, ${ZONE_TINT[prevCategory]}, transparent)`,
            opacity: 0.55,
            zIndex: 1,
          }}
        />
      )}

      {/* Konten section (header + animal cards) */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

/* ======== SMOOTH ZIGZAG PATH GENERATOR ======== */

function generatePathD(count: number): string {
  if (count === 0) return "";
  const h = count * 160 + 300;
  const cX = 60;
  const amp = 28;
  const segments = count * 20 + 20;
  const segY = h / segments;

  let d = "";
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = Math.round(t * h);
    const angle = t * count * Math.PI * 0.4;
    const x = Math.round(cX + Math.sin(angle) * amp);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}

/* ======== DECORATION POSITIONS ======== */

type DecorationItem = {
  type: string;
  side: "left" | "right";
  top: number;
  scale: number;
  svg?: string;
};

function generateDecorations(count: number, zone: string): DecorationItem[] {
  const totalHeight = count * 160 + 300;
  const items = ZONE_DECORATIONS[zone] || ZONE_DECORATIONS.mamalia;
  const placements: DecorationItem[] = [];
  const density = Math.max(4, Math.ceil(count / 2.5));

  for (let i = 0; i < density; i++) {
    for (let side = 0; side < 2; side++) {
      const idx = (i * 2 + side) % items.length;
      const topOffset =
        (i / density) * totalHeight + 20 + side * 50 + Math.random() * 40;
      const item = items[idx];
      const isSvg = item.startsWith("<svg");
      placements.push({
        type: isSvg ? "custom" : item,
        side: side === 0 ? "left" : "right",
        top: Math.floor(topOffset),
        scale: isSvg ? 0.6 + (i % 4) * 0.1 : 0.75 + (i % 4) * 0.12,
        svg: isSvg ? item : undefined,
      });
    }
  }
  return placements;
}

/* ======== ZONE CONFIG ======== */

const ZONE_CONFIG: Record<
  string,
  { emoji: string; label: string; color: string }
> = {
  semua: { emoji: "🧭", label: "Semua Wilayah", color: "#5B3E2B" },
  mamalia: { emoji: "🦁", label: "Hutan Rimba", color: "#2E7D32" },
  burung: { emoji: "🕊️", label: "Langit Biru", color: "#1565C0" },
  reptil: { emoji: "🦎", label: "Padang Pasir", color: "#BF8A4A" },
  laut: { emoji: "🐠", label: "Lautan Lepas", color: "#0D6E9E" },
  serangga: { emoji: "🐝", label: "Kebun Bunga", color: "#689F38" },
  amfibi: { emoji: "🐸", label: "Tepi Danau", color: "#3B8E5E" },
};

/* ======== ZONE BACKGROUND THEMES ======== */

type ZoneTheme = {
  bg: string;
  road: { base: string; inner: string; highlight: string };
  edge: string;
};

const ZONE_THEME: Record<string, ZoneTheme> = {
  mamalia: {
    bg: "#E8F0D6, #DCE8C8, #C5D9A8",
    road: { base: "#A0722A", inner: "#BF9345", highlight: "#D4A853" },
    edge: "rgba(139,195,74,0.15)",
  },
  burung: {
    bg: "#B3E5FC, #81D4FA, #4FC3F7",
    road: { base: "#90A4AE", inner: "#B0BEC5", highlight: "#CFD8DC" },
    edge: "rgba(255,255,255,0.2)",
  },
  reptil: {
    bg: "#FDEBD0, #F5CBA7, #E59866",
    road: { base: "#C9A96E", inner: "#D4B88A", highlight: "#E0C9A6" },
    edge: "rgba(230,126,34,0.1)",
  },
  laut: {
    bg: "#B3D9F2, #5DADE2, #1A5276",
    road: { base: "#5D7B8C", inner: "#7A9BAE", highlight: "#9FBAC9" },
    edge: "rgba(255,255,255,0.15)",
  },
  serangga: {
    bg: "#E8F5E9, #C8E6C9, #A5D6A7",
    road: { base: "#8D6E63", inner: "#A1887F", highlight: "#BCAAA4" },
    edge: "rgba(244,143,177,0.15)",
  },
  amfibi: {
    bg: "#B2DFDB, #80CBC4, #4DB6AC",
    road: { base: "#7B8D6E", inner: "#9AAA8A", highlight: "#B8C9A8" },
    edge: "rgba(255,255,255,0.2)",
  },
};

/* ======== ZONE SVG DECORATIONS ======== */

const ZONE_DECORATIONS: Record<string, string[]> = {
  mamalia: [
    "treeA",
    "treeB",
    "treeA",
    "fern",
    "bush",
    "treeB",
    "grassA",
    "grassB",
    "grassC",
    "flower",
  ],
  burung: [
    `<svg viewBox="0 0 60 36" width="60" height="36"><ellipse cx="20" cy="20" rx="18" ry="12" fill="white" opacity="0.7"/><ellipse cx="36" cy="18" rx="16" ry="14" fill="white" opacity="0.7"/><ellipse cx="28" cy="16" rx="22" ry="13" fill="white" opacity="0.8"/></svg>`,
    `<svg viewBox="0 0 40 24" width="40" height="24"><ellipse cx="15" cy="12" rx="12" ry="8" fill="white" opacity="0.5"/><ellipse cx="25" cy="10" rx="10" ry="9" fill="white" opacity="0.5"/><ellipse cx="19" cy="9" rx="14" ry="8" fill="white" opacity="0.6"/></svg>`,
    `<svg viewBox="0 0 30 30" width="30" height="30"><circle cx="15" cy="15" r="12" fill="#FFD54F" opacity="0.8"/><circle cx="15" cy="15" r="10" fill="#FFEB3B" opacity="0.6"/></svg>`,
  ],
  reptil: [
    `<svg viewBox="0 0 36 50" width="36" height="50"><rect x="14" y="5" width="8" height="30" rx="4" fill="#5D4037"/><path d="M14 10 Q2 15 4 25" stroke="#5D4037" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M22 10 Q34 15 32 25" stroke="#5D4037" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M14 35 Q10 45 12 50" stroke="#5D4037" stroke-width="2" fill="none"/><path d="M22 35 Q26 45 24 50" stroke="#5D4037" stroke-width="2" fill="none"/></svg>`,
    `<svg viewBox="0 0 30 20" width="30" height="20"><path d="M0 15 Q8 5 15 10 Q22 5 30 15" stroke="#C9A96E" stroke-width="1.5" fill="none" opacity="0.5"/></svg>`,
    `<svg viewBox="0 0 50 30" width="50" height="30"><ellipse cx="25" cy="25" rx="23" ry="4" fill="#E67E22" opacity="0.15"/><ellipse cx="15" cy="22" rx="12" ry="3" fill="#E67E22" opacity="0.1"/></svg>`,
  ],
  laut: [
    `<svg viewBox="0 0 50 16" width="50" height="16"><path d="M0 12 Q10 2 25 8 Q40 14 50 4" stroke="white" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 40 12" width="40" height="12"><path d="M0 8 Q8 0 20 5 Q32 10 40 2" stroke="white" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="8" cy="10" r="3" fill="white" opacity="0.25"/><circle cx="13" cy="7" r="2" fill="white" opacity="0.2"/><circle cx="6" cy="14" r="1.5" fill="white" opacity="0.15"/></svg>`,
  ],
  serangga: [
    "flower",
    "grassA",
    "grassB",
    `<svg viewBox="0 0 24 24" width="24" height="24"><ellipse cx="8" cy="8" rx="6" ry="4" fill="#F48FB1" opacity="0.7"/><ellipse cx="16" cy="8" rx="6" ry="4" fill="#CE93D8" opacity="0.7"/><rect x="11" y="6" width="2" height="10" fill="#66BB6A"/></svg>`,
    `<svg viewBox="0 0 20 18" width="20" height="18"><ellipse cx="10" cy="10" rx="8" ry="6" fill="#FF7043" opacity="0.6"/><circle cx="8" cy="8" r="2" fill="#FFB74D"/><circle cx="12" cy="8" r="2" fill="#FFB74D"/></svg>`,
  ],
  amfibi: [
    `<svg viewBox="0 0 30 36" width="30" height="36"><path d="M8 36 Q4 20 8 4" stroke="#66BB6A" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M22 36 Q26 20 22 4" stroke="#66BB6A" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M8 20 Q15 16 22 20" stroke="#66BB6A" stroke-width="1.5" fill="none"/></svg>`,
    `<svg viewBox="0 0 40 12" width="40" height="12"><path d="M0 10 Q10 4 20 8 Q30 12 40 6" stroke="white" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 24 14" width="24" height="14"><ellipse cx="12" cy="8" rx="10" ry="5" fill="#4DB6AC" opacity="0.25"/><circle cx="8" cy="7" r="3" fill="#F8BBD0" opacity="0.35"/><circle cx="16" cy="7" r="2.5" fill="#F8BBD0" opacity="0.3"/></svg>`,
  ],
};

/* ======== ZONE LOCK HELPER ======== */

function isZoneLocked(category: string, completedCount: number): boolean {
  // Find the earliest progression index among animals in this zone
  let earliestIdx = Infinity;
  for (const animal of animals) {
    if (animal.category !== category) continue;
    const idx = PROGRESSION_ORDER.indexOf(animal.id);
    if (idx !== -1 && idx < earliestIdx) earliestIdx = idx;
  }
  // If the earliest animal in this zone is beyond completedCount, zone is locked
  return earliestIdx > completedCount;
}

/* ======== MAIN COMPONENT ======== */

export function ExploreScreen() {
  const [soundPlayingId, setSoundPlayingId] = useState<string | null>(null);
  const [currentZone, setCurrentZone] = useState("semua");

  const isDiscovered = useGameStore((s) => s.isDiscovered);
  const discoverAnimal = useGameStore((s) => s.discoverAnimal);
  const setLastViewedAnimal = useGameStore((s) => s.setLastViewedAnimal);
  const completedQuizzes = useGameStore((s) => s.completedQuizzes);
  const animalScores = useGameStore((s) => s.animalScores);
  const getProgressionState = useGameStore((s) => s.getProgressionState);
  const getCurrentAnimalId = useGameStore((s) => s.getCurrentAnimalId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionPositions = useRef<Array<{ id: string; top: number }>>([]);

  const currentAnimalId = getCurrentAnimalId();
  const completedCount = getInSequenceCompletedCount(completedQuizzes);

  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (scrollRef.current) setContainerWidth(scrollRef.current.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (scrollRef.current) ro.observe(scrollRef.current);
    return () => ro.disconnect();
  }, []);

  /* Build animal lookup map */
  const animalMap = useMemo(() => {
    const map = new Map<string, Animal>();
    animals.forEach((a) => map.set(a.id, a));
    return map;
  }, []);

  /* Build flat order — group by category so each zone is contiguous */
  const flatOrder = useMemo(() => {
    const grouped = new Map<string, Animal[]>();
    for (const id of PROGRESSION_ORDER) {
      const animal = animalMap.get(id);
      if (!animal) continue;
      const list = grouped.get(animal.category);
      if (list) list.push(animal);
      else grouped.set(animal.category, [animal]);
    }

    const categoryOrder = Object.keys(ZONE_CONFIG).filter(
      (c) => c !== "semua" && grouped.has(c),
    );

    const result: Array<
      | { type: "header"; category: string }
      | { type: "animal"; animal: Animal; state: ProgressionState }
    > = [];

    for (const cat of categoryOrder) {
      const animals = grouped.get(cat);
      if (!animals || animals.length === 0) continue;
      result.push({ type: "header", category: cat });
      for (const animal of animals) {
        const state = getProgressionState(animal.id);
        result.push({ type: "animal", animal, state });
      }
    }

    return result;
  }, [animalMap, getProgressionState, completedQuizzes]);

  /* Zone locked state for header dimming */
  const zoneLockedCache = useMemo(() => {
    const cache: Record<string, boolean> = {};
    for (const animal of animals) {
      const cat = animal.category;
      if (cache[cat] === undefined) {
        cache[cat] = isZoneLocked(cat, completedCount);
      }
    }
    return cache;
  }, [completedCount]);

  const groups = useMemo(() => {
    const result: Array<{
      category: string;
      items: Array<{ animal: Animal; state: ProgressionState; index: number }>;
    }> = [];
    flatOrder.forEach((item, index) => {
      if (item.type === "header") {
        result.push({ category: item.category, items: [] });
        return;
      }
      const last = result[result.length - 1];
      if (last)
        last.items.push({ animal: item.animal, state: item.state, index });
    });
    return result;
  }, [flatOrder]);

  const groupKeys = useMemo(
    () => groups.map((g, i) => `${g.category}-${i}`),
    [groups],
  );

  const { offsets, sectionRefs } = useSectionOffsets(scrollRef, groupKeys);

  const zoneDecorations = useMemo(
    () =>
      generateDecorations(
        flatOrder.length,
        currentZone === "semua" ? "mamalia" : currentZone,
      ),
    [flatOrder.length, currentZone],
  );
  const svgPath = useMemo(
    () => generatePathD(flatOrder.length),
    [flatOrder.length],
  );
  const pathHeight = flatOrder.length * 160 + 300;

  /* Scroll-based category detection */
  const currentZoneRef = useRef(currentZone);
  currentZoneRef.current = currentZone;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollTop = container.scrollTop + 60;
      let current = "semua";
      for (const [i, g] of groups.entries()) {
        const offset = offsets[groupKeys[i]];
        if (offset !== undefined && offset <= scrollTop) {
          current = g.category;
        }
      }
      if (current !== currentZoneRef.current) setCurrentZone(current);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [offsets, groups, groupKeys]);

  const handleAnimalClick = useCallback(
    (animalId: string, state: ProgressionState) => {
      if (state === "locked") {
        const currentName = currentAnimalId
          ? (animalMap.get(currentAnimalId)?.name ?? "hewan saat ini")
          : "hewan saat ini";
        showToastInfo(`🔒 Selesaikan kuis ${currentName} dulu!`);
        return;
      }

      // current or completed → navigate
      discoverAnimal(animalId);
      setLastViewedAnimal(animalId);
      window.dispatchEvent(
        new CustomEvent("view-animal", { detail: { animalId } }),
      );
    },
    [currentAnimalId, animalMap, discoverAnimal, setLastViewedAnimal],
  );

  const handlePlaySound = useCallback(
    (e: React.MouseEvent, animalId: string, state: ProgressionState) => {
      e.stopPropagation();
      if (state === "locked") return; // no sound for locked
      const animal = animalMap.get(animalId);
      if (!animal || soundPlayingId) return;
      setSoundPlayingId(animalId);
      playAnimalSound(animal);
      setTimeout(() => setSoundPlayingId(null), 1500);
    },
    [animalMap, soundPlayingId],
  );

  const zone = ZONE_CONFIG[currentZone] || ZONE_CONFIG.semua;
  const allDone = currentAnimalId === null;

  return (
    <div className="screen-container overflow-hidden bg-gradient-to-b from-[#E8F0D6] to-[#C5D9A8]">
      {/* ======== MAP TOOLS HEADER ======== */}
      <div className="flex-shrink-0 relative z-10 px-4 pt-3 pb-1 bg-gradient-to-b from-[#FBF3E7] to-[#E8F0D6] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🧭</span>
            <h1 className="font-display text-lg font-extrabold">Jelajah</h1>
          </div>
          <div className="flex-1" />
          <div
            className="crayon-card px-2.5 py-1 bg-[var(--paper)] flex items-center gap-1.5 text-[10px] font-bold border-[2px] shadow-none"
            style={{ borderColor: zone.color, color: zone.color }}
          >
            <span className="text-xs">{zone.emoji}</span>
            {zone.label}
          </div>
        </div>

        {/* Progression counter */}
        <div className="flex items-center gap-1 mt-1.5 mb-1">
          {allDone ? (
            <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--green-deep)]">
              <span>🏆</span>
              Semua hewan sudah selesai!
            </div>
          ) : currentAnimalId ? (
            <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--ink-soft)]">
              <span>🎯</span>
              Target:{" "}
              <span className="text-[var(--ink)]">
                {animalMap.get(currentAnimalId)?.name ?? "—"}
              </span>
              <span className="ml-auto">
                🐾 {completedCount}/{PROGRESSION_ORDER.length}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ======== FOREST PATH ======== */}
      <div ref={scrollRef} className="screen-scroll relative">
        {/* SVG zone decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {zoneDecorations.map((d, i) => (
            <ZoneDecoration
              key={i}
              type={d.type}
              side={d.side}
              top={d.top}
              scale={d.scale}
              svg={d.svg}
            />
          ))}
        </div>

        {/* Content layer */}
        <div className="relative z-10 pb-32">
          {groups.map((group, gi) => {
            const groupKey = groupKeys[gi];
            const zc = ZONE_CONFIG[group.category];
            const locked = zoneLockedCache[group.category] ?? false;
            const prevCategory = gi > 0 ? groups[gi - 1].category : null;

            return (
              <ThemedZoneSection
                key={groupKey}
                groupKey={groupKey}
                category={group.category}
                topOffset={offsets[groupKey]}
                containerWidth={containerWidth || 400}
                isFirst={gi === 0}
                prevCategory={prevCategory}
                registerRef={(el) => {
                  sectionRefs.current[groupKey] = el;
                }}
              >
                {/* Header kategori */}
                <div className="flex items-center justify-center pt-6 pb-2">
                  <div
                    className="crayon-card px-4 py-1.5 flex items-center gap-2 text-xs font-bold border-[2px] shadow-none transition-all"
                    style={{
                      background: locked
                        ? "#B0B0B0"
                        : zc?.color || "var(--paper)",
                      color: locked ? "#777" : "#fff",
                      borderColor: "var(--ink)",
                    }}
                  >
                    <span className="text-sm">{zc?.emoji}</span>
                    {locked ? "🔒 Wilayah Tertutup" : zc?.label}
                  </div>
                </div>

                {/* Animal cards */}
                {group.items.map(({ animal, state, index }) => {
                  const side = index % 2 === 0 ? "left" : "right";
                  const scoreData = animalScores[animal.id];
                  const starCount = scoreData
                    ? scoreData.score === 0
                      ? 0
                      : scoreData.score === scoreData.total
                        ? 3
                        : scoreData.score / scoreData.total >= 0.5
                          ? 2
                          : 1
                    : 0;

                  return (
                    <div
                      key={animal.id}
                      className="flex items-center min-h-[150px] px-4 py-4"
                      style={{
                        animation: `fade-in-up 0.4s ease-out ${index * 0.03}s forwards`,
                        opacity: 0,
                      }}
                    >
                      <div
                        className="w-[calc(50%-60px)] sm:w-[calc(50%-70px)] flex"
                        style={{
                          justifyContent:
                            side === "left" ? "flex-end" : "flex-start",
                        }}
                      >
                        {side === "left" && (
                          <AnimalCircleCard
                            animal={animal}
                            state={state}
                            starCount={starCount}
                            soundPlayingId={soundPlayingId}
                            onPlaySound={(e) =>
                              handlePlaySound(e, animal.id, state)
                            }
                            onClick={() => handleAnimalClick(animal.id, state)}
                          />
                        )}
                      </div>
                      <div className="w-[120px] flex-shrink-0" />
                      <div
                        className="w-[calc(50%-60px)] sm:w-[calc(50%-70px)] flex"
                        style={{
                          justifyContent:
                            side === "right" ? "flex-start" : "flex-end",
                        }}
                      >
                        {side === "right" && (
                          <AnimalCircleCard
                            animal={animal}
                            state={state}
                            starCount={starCount}
                            soundPlayingId={soundPlayingId}
                            onPlaySound={(e) =>
                              handlePlaySound(e, animal.id, state)
                            }
                            onClick={() => handleAnimalClick(animal.id, state)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </ThemedZoneSection>
            );
          })}

          {flatOrder.length > 0 && (
            <div className="flex flex-col items-center justify-center py-8 pt-12">
              {allDone ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-[var(--green-deep)] border-[3px] border-[var(--ink)] flex items-center justify-center text-white text-lg shadow-[0_3px_0_var(--ink)]">
                    🏆
                  </div>
                  <div className="text-[11px] font-bold text-[var(--green-deep)] mt-2">
                    Selamat! Semua hewan selesai! 🎉
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-[#A0722A] border-[3px] border-[var(--ink)] flex items-center justify-center text-white text-4xl shadow-[0_3px_0_var(--ink)]">
                    🏁
                  </div>
                  <div className="text-[16px] font-bold text-[var(--ink-soft)] mt-2">
                    Akhir perjalanan
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======== CIRCLE CARD ======== */

function AnimalCircleCard({
  animal,
  state,
  starCount,
  soundPlayingId,
  onPlaySound,
  onClick,
}: {
  animal: Animal;
  state: ProgressionState;
  starCount: number;
  soundPlayingId: string | null;
  onPlaySound: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const isPlaying = soundPlayingId === animal.id;

  /* Visual treatment per state */
  let cardClasses =
    "relative w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] rounded-full border-[4px] border-[var(--ink)] flex items-center justify-center shadow-[0_4px_0_var(--ink)] transition-all active:scale-95";
  let cardBg = "#ffffff";
  let showEmoji = animal.emoji;
  let showName = animal.name;

  if (state === "locked") {
    cardClasses += " grayscale cursor-not-allowed";
    cardBg = "#ffffff";
    showEmoji = "❓";
    showName = "???";
  } else if (state === "current") {
    cardClasses +=
      " hover:scale-105 cursor-pointer ring-[3px] ring-[var(--orange)] ring-offset-2 animate-pulse";
    showEmoji = animal.emoji;
  } else {
    // completed
    cardClasses += " hover:scale-105 cursor-pointer";
  }

  return (
    <div className="relative flex flex-col items-center gap-1.5">
      <div className="relative">
        <button
          onClick={onClick}
          className={cardClasses}
          style={{ background: cardBg }}
          disabled={state === "locked"}
        >
          <span className="text-5xl sm:text-[80px] leading-none select-none">
            {showEmoji}
          </span>

          {/* Lock overlay */}
          {state === "locked" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              {/* <span className="text-4xl">🚫</span> */}
            </div>
          )}

          {/* Completed check badge */}
          {state === "completed" && (
            <div className="absolute -top-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[var(--green-deep)] border-[2px] border-[var(--ink)] flex items-center justify-center text-white text-[10px] shadow-[0_1px_0_var(--ink)]">
              ✓
            </div>
          )}

          {/* Current indicator arrow */}
          {state === "current" && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <div className="text-3xl animate-bounce">👇</div>
            </div>
          )}
        </button>

        {/* Sound button — only for non-locked */}
        {state !== "locked" && (
          <button
            onClick={onPlaySound}
            className="absolute -bottom-1 -right-1 w-[30px] h-[30px] rounded-full bg-[var(--green)] border-[2.5px] border-[var(--ink)] flex items-center justify-center shadow-[0_2px_0_var(--ink)] active:translate-y-[1px] active:shadow-none transition-all text-xs"
          >
            {isPlaying ? "🔊" : "🔈"}
          </button>
        )}
      </div>

      {/* Stars — always visible below the card */}
      <div className="flex gap-0.5 mt-0.5 bg-white/80 rounded-md px-1 py-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`text-sm ${
              i === 1 ? "text-[15px]" : "text-sm"
            } leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] ${
              i < starCount ? "text-yellow-500" : "text-[var(--ink-soft)]"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <span className="font-bold text-[11px] leading-tight bg-[var(--paper)] px-2.5 py-0.5 rounded-full border border-[var(--ink)]/30 shadow-[0_1px_0_var(--ink)]/10">
          {showName}
        </span>
      </div>
    </div>
  );
}
