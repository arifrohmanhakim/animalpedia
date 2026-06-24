import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals, categories } from '@/data/animals';
import { playAnimalSound } from '@/lib/audio';

export function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const [soundPlayingId, setSoundPlayingId] = useState<string | null>(null);
  const isDiscovered = useGameStore((s) => s.isDiscovered);
  const discoverAnimal = useGameStore((s) => s.discoverAnimal);
  const setLastViewedAnimal = useGameStore((s) => s.setLastViewedAnimal);

  const filteredAnimals = animals.filter((animal) => {
    const matchesCategory = activeCategory === 'semua' || animal.category === activeCategory;
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.englishName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAnimalClick = (animalId: string) => {
    discoverAnimal(animalId);
    setLastViewedAnimal(animalId);
    window.dispatchEvent(new CustomEvent('view-animal', { detail: { animalId } }));
  };

  const handlePlaySound = (e: React.MouseEvent, animalId: string) => {
    e.stopPropagation();
    const animal = animals.find((a) => a.id === animalId);
    if (!animal) return;
    if (soundPlayingId) return;
    setSoundPlayingId(animalId);
    playAnimalSound(animal);
    setTimeout(() => setSoundPlayingId(null), 1500);
  };

  return (
    <div className="screen-container bg-[var(--cream)]">
      {/* Sticky header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-1 bg-[var(--cream)] z-10">
        <h1 className="font-display text-xl font-bold">Jelajah Hewan 🐾</h1>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[var(--paper)] border-[3px] border-[var(--ink)] rounded-2xl px-3.5 py-2.5 mt-3">
          <span className="text-sm">🔎</span>
          <input
            type="text"
            placeholder="Cari hewan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)]"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto py-2.5 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pill-tab flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                    : 'bg-[var(--paper)] border-[var(--line)] text-[var(--ink-soft)]'
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable animal grid */}
      <div className="screen-scroll">
        <div className="px-5 pb-6 grid grid-cols-2 gap-3.5">
          {filteredAnimals.map((animal, index) => {
            const discovered = isDiscovered(animal.id);
            return (
              <button
                key={animal.id}
                onClick={() => handleAnimalClick(animal.id)}
                className={`crayon-card p-3 text-center transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  !discovered ? 'opacity-55' : ''
                }`}
                style={{
                  background: discovered ? animal.color : undefined,
                  animation: `fade-in-up 0.4s ease-out ${index * 0.05}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex justify-end -mt-1 -mr-1">
                  <button
                    onClick={(e) => handlePlaySound(e, animal.id)}
                    className="w-[26px] h-[26px] rounded-full bg-[var(--paper)] border-2 border-[var(--ink)] flex items-center justify-center text-xs shadow-[0_2px_0_var(--ink)] active:translate-y-[1px] active:shadow-none"
                  >
                    {soundPlayingId === animal.id ? '🔊' : '🔈'}
                  </button>
                </div>
                <div
                  className={`text-4xl -mt-2 ${!discovered ? 'grayscale' : ''}`}
                >
                  {discovered ? animal.emoji : '❓'}
                </div>
                <div className="font-bold text-xs mt-1.5">
                  {discovered ? animal.name : '???'}
                </div>
                <div className="text-[10px] font-semibold text-[var(--ink-soft)]">
                  {discovered ? animal.category : 'Belum dibuka'}
                </div>
              </button>
            );
          })}
        </div>

        {filteredAnimals.length === 0 && (
          <div className="text-center py-10 text-sm font-semibold text-[var(--ink-soft)]">
            🧐 Hewan tidak ditemukan. Coba kata kunci lain!
          </div>
        )}
      </div>
    </div>
  );
}