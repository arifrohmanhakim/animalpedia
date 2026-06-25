import { animals } from '@/data/animals';
import { useGameStore } from '@/store/gameStore';

interface Props {
  /** The animal the user wants to adopt */
  newAnimalId: string;
  onSwap: (releaseId: string) => void;
  onCancel: () => void;
}

export function SwapPetModal({ newAnimalId, onSwap, onCancel }: Props) {
  const petAnimals = useGameStore((s) => s.petAnimals);
  const newAnimal = animals.find((a) => a.id === newAnimalId);
  const releaseAnimal = animals.find((a) => a.id === petAnimals[0]);
  const releaseName = releaseAnimal?.name ?? 'hewan';
  const newName = newAnimal?.name ?? 'hewan baru';

  if (!newAnimal) return null;

  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center p-6"
      style={{ background: 'rgba(91,62,43,0.45)' }}
      onClick={onCancel}
    >
      <div
        className="crayon-card bg-[var(--paper)] p-5 w-full max-w-[300px] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-2 select-none">
          {releaseAnimal?.emoji ?? '❓'}
          <span className="mx-1 text-2xl opacity-50">💭</span>
          {newAnimal.emoji}
        </div>

        <h3 className="font-display text-base font-extrabold leading-snug mb-2">
          Lepas {releaseName},<br />pelihara {newName}?
        </h3>

        <p className="text-[11.5px] font-semibold text-[var(--ink-soft)] leading-relaxed mb-4">
          {releaseName} akan balik ke Koleksimu, masih bisa kamu lihat dan pelihara lagi kapan saja.
        </p>

        <button
          onClick={() => onSwap(releaseAnimal?.id ?? petAnimals[0])}
          className="w-full bg-[var(--orange)] border-[3px] border-[var(--ink)] text-white font-display font-bold text-sm py-3 rounded-[18px] shadow-[0_3px_0_var(--ink)] mb-2.5"
        >
          Ya, Ganti ke {newName}
        </button>

        <button
          onClick={onCancel}
          className="w-full bg-[var(--paper)] border-[3px] border-[var(--ink-soft)] text-[var(--ink-soft)] font-display font-bold text-sm py-2.5 rounded-[18px]"
        >
          Batal, Tetap {releaseName}
        </button>
      </div>
    </div>
  );
}
