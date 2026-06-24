import { useCallback, useMemo, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals, categories } from '@/data/animals';

export function CollectionScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const isDiscovered = useGameStore((s) => s.isDiscovered);
  const getCollectionProgress = useGameStore((s) => s.getCollectionProgress);

  const viewAnimal = useCallback((animalId: string) => {
    window.dispatchEvent(new CustomEvent('view-animal', { detail: { animalId } }));
  }, []);

  const progress = getCollectionProgress();

  const filteredAnimals = useMemo(() => {
    if (!searchQuery.trim()) return animals;
    const q = searchQuery.toLowerCase();
    return animals.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.englishName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const getAnimalsByCategory = (catId: string) => {
    if (catId === 'semua') return filteredAnimals;
    return filteredAnimals.filter((a) => a.category === catId);
  };

  const getCategoryColor = (catId: string) => {
    switch (catId) {
      case 'laut': return 'var(--blue)';
      case 'mamalia': return 'var(--green)';
      case 'burung': return '#9B6FD1';
      case 'reptil': return 'var(--orange)';
      case 'serangga': return 'var(--yellow-deep)';
      case 'amfibi': return 'var(--green-deep)';
      default: return 'var(--green)';
    }
  };

  return (
    <div className="screen-container bg-[var(--cream)]">
      {/* Sticky header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-2 bg-[var(--cream)] z-10">
        <h1 className="font-display text-xl font-bold">Album Koleksiku 📚</h1>
        <p className="text-xs font-semibold text-[var(--ink-soft)] mt-1">
          {progress.discovered} dari {progress.total} hewan ditemukan
        </p>
        <div className="progress-track mt-2">
          <div
            className="progress-fill"
            style={{ width: `${(progress.discovered / progress.total) * 100}%` }}
          />
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[var(--paper)] border-[3px] border-[var(--ink)] rounded-2xl px-3 py-2 mt-3">
          <span className="text-xs">🔎</span>
          <input
            type="text"
            placeholder="Cari hewan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs font-bold">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Scrollable category sections */}
      <div className="screen-scroll">
        <div className="px-5 pb-6 space-y-5">
          {categories.slice(1).map((cat) => {
            const catAnimals = getAnimalsByCategory(cat.id);
            if (catAnimals.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="sticky top-0 z-10 -mx-5 px-5 pt-0.5 bg-[var(--cream)]">
                  <span
                    className="sticker-badge mb-2.5 inline-block"
                    style={{ background: getCategoryColor(cat.id) }}
                  >
                    {cat.emoji} {cat.name.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {catAnimals.map((animal) => {
                    const discovered = isDiscovered(animal.id);
                    return (
                      <button
                        key={animal.id}
                        onClick={() => viewAnimal(animal.id)}
                        className={`crayon-card aspect-square flex items-center justify-center text-[34px] sm:text-[40px] transition-transform active:scale-90 hover:scale-105 ${
                          discovered
                            ? 'cursor-pointer'
                            : 'bg-[var(--cream-deep)] text-[var(--ink-soft)] opacity-60 cursor-pointer'
                        }`}
                        style={{
                          background: discovered ? animal.color : undefined,
                        }}
                      >
                        {discovered ? animal.emoji : '❓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {searchQuery && filteredAnimals.length === 0 && (
            <div className="text-center py-16 text-sm font-semibold text-[var(--ink-soft)]">
              <div className="text-5xl mb-3">🔍</div>
              Hewan tidak ditemukan. Coba kata kunci lain!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
