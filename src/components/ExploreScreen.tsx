import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals, categories } from '@/data/animals';

export function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const isDiscovered = useGameStore((s) => s.isDiscovered);
  const discoverAnimal = useGameStore((s) => s.discoverAnimal);
  const startQuiz = useGameStore((s) => s.startQuiz);
  const setTab = useGameStore((s) => s.setTab);

  const filteredAnimals = animals.filter((animal) => {
    const matchesCategory = activeCategory === 'semua' || animal.category === activeCategory;
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.englishName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAnimalClick = (animalId: string) => {
    discoverAnimal(animalId);
    setTab('home'); // We'll use the setAnimalDetail action instead
    // For now, we set it to trigger the detail view
    window.dispatchEvent(new CustomEvent('view-animal', { detail: { animalId } }));
  };

  return (
    <div className="screen-container bg-[var(--cream)]">
      <div className="screen-scroll">
        {/* Header */}
        <div className="px-5 pt-4 pb-2">
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
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto px-5 py-2.5 -mx-2 px-2 scrollbar-hide">
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

        {/* Animal grid */}
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
                <div
                  className={`text-4xl ${!discovered ? 'grayscale' : ''}`}
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
