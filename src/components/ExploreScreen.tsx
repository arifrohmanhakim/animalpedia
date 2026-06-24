import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals, PROGRESSION_ORDER } from '@/data/animals';
import type { Animal } from '@/data/animals/types';
import type { ProgressionState } from '@/data/animals';
import { playAnimalSound } from '@/lib/audio';
import { showToastInfo } from '@/components/ToastNotification';

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

type PlantType = keyof typeof PLANT_SVGS;

const SIDE_PLANTS: PlantType[] = ['treeA', 'treeB', 'treeA', 'fern', 'bush', 'treeB', 'grassA', 'grassB', 'grassC', 'flower'];

function PlantIllustration({ type, side, top, scale }: { type: PlantType; side: string; top: number; scale: number }) {
  const svg = PLANT_SVGS[type];
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        [side as 'left' | 'right']: type === 'treeA' || type === 'treeB' ? '4px' : '12px',
        top: `${top}px`,
        transform: `scale(${scale})`,
        opacity: type.startsWith('tree') ? 0.55 : 0.5,
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.12))',
        zIndex: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/* ======== SMOOTH ZIGZAG PATH GENERATOR ======== */

function generatePathD(count: number): string {
  if (count === 0) return '';
  const h = count * 160 + 300;
  const cX = 60;
  const amp = 28;
  const segments = count * 20 + 20;
  const segY = h / segments;

  let d = '';
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = Math.round(t * h);
    const angle = t * count * Math.PI * 0.4;
    const x = Math.round(cX + Math.sin(angle) * amp);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}

/* ======== PLANT POSITIONS ======== */

function generatePlants(count: number) {
  const totalHeight = count * 160 + 300;
  const placements: Array<{ type: PlantType; side: 'left' | 'right'; top: number; scale: number }> = [];
  const density = Math.max(4, Math.ceil(count / 2.5));

  for (let i = 0; i < density; i++) {
    for (let side = 0; side < 2; side++) {
      const idx = (i * 2 + side) % SIDE_PLANTS.length;
      const topOffset = (i / density) * totalHeight + 20 + (side * 50) + Math.random() * 40;
      placements.push({
        type: SIDE_PLANTS[idx],
        side: side === 0 ? 'left' : 'right',
        top: Math.floor(topOffset),
        scale: 0.75 + (i % 4) * 0.12,
      });
    }
  }
  return placements;
}

/* ======== ZONE CONFIG ======== */

const ZONE_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  semua:   { emoji: '🧭', label: 'Semua Wilayah', color: '#5B3E2B' },
  mamalia: { emoji: '🦁', label: 'Hutan Rimba',   color: '#2E7D32' },
  burung:  { emoji: '🕊️', label: 'Langit Biru',    color: '#1565C0' },
  reptil:  { emoji: '🦎', label: 'Padang Pasir',  color: '#BF8A4A' },
  laut:    { emoji: '🐠', label: 'Lautan Lepas',  color: '#0D6E9E' },
  serangga:{ emoji: '🐝', label: 'Kebun Bunga',   color: '#689F38' },
  amfibi:  { emoji: '🐸', label: 'Tepi Danau',    color: '#3B8E5E' },
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
  // If the earliest animal in this zone is at or beyond completedCount, zone is locked
  return earliestIdx >= completedCount;
}

/* ======== MAIN COMPONENT ======== */

export function ExploreScreen() {
  const [soundPlayingId, setSoundPlayingId] = useState<string | null>(null);
  const [currentZone, setCurrentZone] = useState('semua');

  const isDiscovered = useGameStore((s) => s.isDiscovered);
  const discoverAnimal = useGameStore((s) => s.discoverAnimal);
  const setLastViewedAnimal = useGameStore((s) => s.setLastViewedAnimal);
  const completedQuizzes = useGameStore((s) => s.completedQuizzes);
  const getProgressionState = useGameStore((s) => s.getProgressionState);
  const getCurrentAnimalId = useGameStore((s) => s.getCurrentAnimalId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionPositions = useRef<Array<{ id: string; top: number }>>([]);

  const currentAnimalId = getCurrentAnimalId();
  const completedCount = completedQuizzes.length;

  /* Build animal lookup map */
  const animalMap = useMemo(() => {
    const map = new Map<string, Animal>();
    animals.forEach((a) => map.set(a.id, a));
    return map;
  }, []);

  /* Build flat order from progression list, grouped by category */
  const flatOrder = useMemo(() => {
    const result: Array<{ type: 'header'; category: string } | { type: 'animal'; animal: Animal; state: ProgressionState }> = [];
    let lastCategory = '';

    for (const id of PROGRESSION_ORDER) {
      const animal = animalMap.get(id);
      if (!animal) continue;

      const state = getProgressionState(id);

      if (animal.category !== lastCategory) {
        result.push({ type: 'header', category: animal.category });
        lastCategory = animal.category;
      }
      result.push({ type: 'animal', animal, state });
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

  const plants = useMemo(() => generatePlants(flatOrder.length), [flatOrder.length]);
  const svgPath = useMemo(() => generatePathD(flatOrder.length), [flatOrder.length]);
  const pathHeight = flatOrder.length * 160 + 300;

  /* Scroll-based category detection */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const measure = () => {
      const positions: Array<{ id: string; top: number }> = [];
      container.querySelectorAll('[data-section]').forEach((el) => {
        const id = el.getAttribute('data-section');
        if (id) positions.push({ id, top: (el as HTMLElement).offsetTop });
      });
      positions.sort((a, b) => a.top - b.top);
      sectionPositions.current = positions;
    };
    measure();
    const handleScroll = () => {
      const scrollTop = container.scrollTop + 60;
      let current = 'semua';
      for (const pos of sectionPositions.current) {
        if (pos.top <= scrollTop) current = pos.id;
      }
      if (current !== currentZone) setCurrentZone(current);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      ro.disconnect();
    };
  }, [currentZone, flatOrder.length]);

  const handleAnimalClick = useCallback((animalId: string, state: ProgressionState) => {
    if (state === 'locked') {
      const currentName = currentAnimalId
        ? animalMap.get(currentAnimalId)?.name ?? 'hewan saat ini'
        : 'hewan saat ini';
      showToastInfo(`🔒 Selesaikan kuis ${currentName} dulu!`);
      return;
    }

    // current or completed → navigate
    discoverAnimal(animalId);
    setLastViewedAnimal(animalId);
    window.dispatchEvent(new CustomEvent('view-animal', { detail: { animalId } }));
  }, [currentAnimalId, animalMap, discoverAnimal, setLastViewedAnimal]);

  const handlePlaySound = useCallback((e: React.MouseEvent, animalId: string, state: ProgressionState) => {
    e.stopPropagation();
    if (state === 'locked') return; // no sound for locked
    const animal = animalMap.get(animalId);
    if (!animal || soundPlayingId) return;
    setSoundPlayingId(animalId);
    playAnimalSound(animal);
    setTimeout(() => setSoundPlayingId(null), 1500);
  }, [animalMap, soundPlayingId]);

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
              Target: <span className="text-[var(--ink)]">{animalMap.get(currentAnimalId)?.name ?? '—'}</span>
              <span className="ml-auto">🐾 {completedCount}/{PROGRESSION_ORDER.length}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ======== FOREST PATH ======== */}
      <div ref={scrollRef} className="screen-scroll relative">
        {/* Ground texture */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#E8F0D6] via-[#DCE8C8] to-[#C8D9A8]" />

        {/* Grass edge strips */}
        <div className="absolute left-0 top-0 bottom-0 w-2/12 bg-gradient-to-r from-[#8BC34A]/15 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-2/12 bg-gradient-to-l from-[#8BC34A]/15 to-transparent pointer-events-none" />

        {/* SVG plant illustrations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {plants.map((p, i) => (
            <PlantIllustration key={i} type={p.type} side={p.side} top={p.top} scale={p.scale} />
          ))}
        </div>

        {/* SVG smooth zigzag road */}
        {svgPath && (
          <svg
            className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-[2]"
            width="120"
            height={pathHeight}
            viewBox={`0 0 120 ${pathHeight}`}
            preserveAspectRatio="xMidYMin slice"
          >
            {/* Road shadow */}
            <path d={svgPath} stroke="#6D4C2A" strokeWidth="52" fill="none" strokeLinecap="round" opacity="0.25" transform="translate(0, 5)" />
            {/* Road base (dirt) */}
            <path d={svgPath} stroke="#A0722A" strokeWidth="44" fill="none" strokeLinecap="round" opacity="0.85" />
            {/* Road inner (lighter dirt) */}
            <path d={svgPath} stroke="#BF9345" strokeWidth="30" fill="none" strokeLinecap="round" opacity="0.7" />
            {/* Road top highlight */}
            <path d={svgPath} stroke="#D4A853" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.45" />
            {/* Center dashed line */}
            <path d={svgPath} stroke="#E8D5B5" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="10 16" opacity="0.6" />
          </svg>
        )}

        {/* Content layer */}
        <div className="relative z-10 pt-6 pb-32">
          {flatOrder.map((item, index) => {
            if (item.type === 'header') {
              const zc = ZONE_CONFIG[item.category];
              const locked = zoneLockedCache[item.category] ?? false;
              return (
                <div key={`hdr-${item.category}`} data-section={item.category} className="flex items-center justify-center pt-6 pb-2">
                  <div
                    className="crayon-card px-4 py-1.5 flex items-center gap-2 text-xs font-bold border-[2px] shadow-none transition-all"
                    style={{
                      background: locked ? '#B0B0B0' : (zc?.color || 'var(--paper)'),
                      color: locked ? '#777' : '#fff',
                      borderColor: 'var(--ink)',
                      opacity: locked ? 0.55 : 1,
                    }}
                  >
                    <span className="text-sm">{zc?.emoji}</span>
                    {locked ? '🔒 Wilayah Tertutup' : zc?.label}
                  </div>
                </div>
              );
            }

            const side = index % 2 === 0 ? 'left' : 'right';
            const { animal, state } = item;

            return (
              <div
                key={`${animal.id}`}
                className="flex items-center min-h-[150px] px-4 py-4"
                style={{ animation: `fade-in-up 0.4s ease-out ${index * 0.03}s forwards`, opacity: 0 }}
              >
                <div className="w-[calc(50%-60px)] sm:w-[calc(50%-70px)] flex" style={{ justifyContent: side === 'left' ? 'flex-end' : 'flex-start' }}>
                  {side === 'left' && (
                    <AnimalCircleCard
                      animal={animal}
                      state={state}
                      soundPlayingId={soundPlayingId}
                      onPlaySound={(e) => handlePlaySound(e, animal.id, state)}
                      onClick={() => handleAnimalClick(animal.id, state)}
                    />
                  )}
                </div>
                <div className="w-[120px] flex-shrink-0" />
                <div className="w-[calc(50%-60px)] sm:w-[calc(50%-70px)] flex" style={{ justifyContent: side === 'right' ? 'flex-start' : 'flex-end' }}>
                  {side === 'right' && (
                    <AnimalCircleCard
                      animal={animal}
                      state={state}
                      soundPlayingId={soundPlayingId}
                      onPlaySound={(e) => handlePlaySound(e, animal.id, state)}
                      onClick={() => handleAnimalClick(animal.id, state)}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {flatOrder.length > 0 && (
            <div className="flex flex-col items-center justify-center py-8 pt-12">
              {allDone ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-[var(--green-deep)] border-[3px] border-[var(--ink)] flex items-center justify-center text-white text-lg shadow-[0_3px_0_var(--ink)]">🏆</div>
                  <div className="text-[11px] font-bold text-[var(--green-deep)] mt-2">Selamat! Semua hewan selesai! 🎉</div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#A0722A] border-[3px] border-[var(--ink)] flex items-center justify-center text-white text-sm shadow-[0_3px_0_var(--ink)]">🏁</div>
                  <div className="text-[10px] font-bold text-[var(--ink-soft)] mt-2">Akhir perjalanan</div>
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
  animal, state, soundPlayingId, onPlaySound, onClick,
}: {
  animal: Animal;
  state: ProgressionState;
  soundPlayingId: string | null;
  onPlaySound: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const isPlaying = soundPlayingId === animal.id;

  /* Visual treatment per state */
  let cardClasses = 'relative w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] rounded-full border-[4px] border-[var(--ink)] flex items-center justify-center shadow-[0_4px_0_var(--ink)] transition-all active:scale-95';
  let cardBg = animal.color;
  let showEmoji = animal.emoji;
  let showName = animal.name;
  let showEnglish = animal.englishName;

  if (state === 'locked') {
    cardClasses += ' grayscale opacity-40 cursor-not-allowed';
    cardBg = 'var(--cream)';
    showEmoji = '❓';
    showName = '???';
    showEnglish = '';
  } else if (state === 'current') {
    cardClasses += ' hover:scale-105 cursor-pointer ring-[3px] ring-[var(--orange)] ring-offset-2 animate-pulse';
    showEmoji = animal.emoji;
  } else {
    // completed
    cardClasses += ' hover:scale-105 cursor-pointer';
  }

  return (
    <div className="relative flex flex-col items-center gap-1.5">
      <div className="relative">
        <button
          onClick={onClick}
          className={cardClasses}
          style={{ background: cardBg }}
          disabled={state === 'locked'}
        >
          <span className="text-4xl sm:text-[44px] leading-none select-none">
            {showEmoji}
          </span>

          {/* Lock overlay */}
          {state === 'locked' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/10">
              <span className="text-2xl">🔒</span>
            </div>
          )}

          {/* Completed check badge */}
          {state === 'completed' && (
            <div className="absolute -top-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[var(--green-deep)] border-[2px] border-[var(--ink)] flex items-center justify-center text-white text-[10px] shadow-[0_1px_0_var(--ink)]">
              ✓
            </div>
          )}

          {/* Current indicator arrow */}
          {state === 'current' && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <div className="text-[10px] animate-bounce">👇</div>
            </div>
          )}
        </button>

        {/* Sound button — only for non-locked */}
        {state !== 'locked' && (
          <button
            onClick={onPlaySound}
            className="absolute -bottom-1 -right-1 w-[30px] h-[30px] rounded-full bg-[var(--green)] border-[2.5px] border-[var(--ink)] flex items-center justify-center shadow-[0_2px_0_var(--ink)] active:translate-y-[1px] active:shadow-none transition-all text-xs"
          >
            {isPlaying ? '🔊' : '🔈'}
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <span className="font-bold text-[11px] leading-tight bg-[var(--paper)] px-2.5 py-0.5 rounded-full border border-[var(--ink)]/30 shadow-[0_1px_0_var(--ink)]/10"
          style={{ opacity: state === 'locked' ? 0.5 : 1 }}
        >
          {showName}
        </span>
        {showEnglish && (
          <span className="text-[9px] font-semibold text-[var(--ink-soft)] mt-0.5 leading-tight">
            {showEnglish}
          </span>
        )}
      </div>
    </div>
  );
}
