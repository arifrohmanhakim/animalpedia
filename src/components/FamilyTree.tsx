import { useGameStore } from '@/store/gameStore';
import { findFamilyForAnimal } from '@/data/animals';
import { showToastInfo } from '@/components/ToastNotification';

interface Props {
  animalId: string;
  onNavigate: (animalId: string) => void;
}

export function FamilyTree({ animalId, onNavigate }: Props) {
  const discoveredAnimals = useGameStore((s) => s.discoveredAnimals);
  const family = findFamilyForAnimal(animalId);

  if (!family) return null;

  const discoveredCount = family.members.filter((m) =>
    m.exists && discoveredAnimals.includes(m.animalId)
  ).length;
  const totalCount = family.members.length;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="font-display text-sm font-bold">
          {family.emoji} Keluarga {family.name}
        </h3>
        <span className="text-[10px] font-bold text-[var(--ink-soft)] bg-[var(--cream-deep)] px-2 py-0.5 rounded-full">
          {discoveredCount}/{totalCount} ditemukan
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {family.members.map((member) => {
          const isCurrent = member.animalId === animalId;
          const isDiscovered = member.exists
            ? discoveredAnimals.includes(member.animalId)
            : false;

          const handleTap = () => {
            if (isCurrent) return;
            if (isDiscovered) {
              onNavigate(member.animalId);
            } else {
              showToastInfo(
                `${member.name} belum ditemukan! Coba jelajahi lagi. 🧭`
              );
            }
          };

          return (
            <button
              key={member.animalId}
              onClick={handleTap}
              className="flex flex-col items-center gap-1 min-w-[64px] flex-shrink-0 transition-transform active:scale-90"
            >
              <div
                className={`w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center text-xl transition-all ${
                  isCurrent
                    ? 'border-[var(--orange)] bg-[var(--orange-pale)] shadow-lg scale-110'
                    : isDiscovered
                    ? 'border-[var(--green-deep)] bg-[var(--green-pale)]'
                    : 'border-dashed border-[var(--ink-soft)] bg-[var(--cream-deep)] opacity-50'
                }`}
              >
                {isDiscovered || isCurrent ? (
                  <span>{member.emoji}</span>
                ) : (
                  <span className="text-lg">?</span>
                )}
              </div>
              <span
                className={`text-[9px] font-bold text-center leading-tight max-w-[64px] truncate ${
                  isCurrent ? 'text-[var(--orange)]' : ''
                }`}
              >
                {member.name}
                {isCurrent ? ' 👈' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}