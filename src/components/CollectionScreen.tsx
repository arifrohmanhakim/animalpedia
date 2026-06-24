import { useGameStore } from '@/store/gameStore';
import { animals, categories } from '@/data/animals';

export function CollectionScreen() {
  const isDiscovered = useGameStore((s) => s.isDiscovered);
  const getCollectionProgress = useGameStore((s) => s.getCollectionProgress);

  const progress = getCollectionProgress();

  const getAnimalsByCategory = (catId: string) => {
    if (catId === 'semua') return animals;
    return animals.filter((a) => a.category === catId);
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
      </div>

      {/* Scrollable category sections */}
      <div className="screen-scroll">
        <div className="px-5 pb-6 space-y-5">
          {categories.slice(1).map((cat) => {
            const catAnimals = getAnimalsByCategory(cat.id);
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
                      <div
                        key={animal.id}
                        className={`crayon-card aspect-square flex items-center justify-center text-2xl ${
                          discovered
                            ? ''
                            : 'bg-[var(--cream-deep)] text-[var(--ink-soft)] opacity-60'
                        }`}
                        style={{
                          background: discovered ? animal.color : undefined,
                        }}
                      >
                        {discovered ? animal.emoji : '❓'}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
