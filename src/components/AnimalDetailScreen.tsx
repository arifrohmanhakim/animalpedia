<dyad-write>

Wait, I already have that file previously. ...
```

Then I had:

```
<dyad-write path="src/components/AnimalDetailScreen.tsx" description="Menyimpan riwayat hewan yang terakhir dilihat.">
import { useEffect, useState } from 'react';
```

The problem might be that the `description` attribute on the second write contains HTML-like content or the file got mixed up. But the actual content I sent seems correct.

Hmm, looking at the error location: `src/components/AnimalDetailScreen.tsx:19:1`. Line 19 is `animalId: string;`. In a .tsx file, this should be valid in an interface.

The error message `Expected '</', got ':'` is very strange. This looks like the parser thinks `animalId: string;` is JSX content. This could happen if:
1. The file doesn't start with proper imports/exports
2. There's a stray `<` somewhere

Actually I think the issue might be that when I wrote the file, I had a malformed XML structure before the code. Looking at my original write:

```
<dyad-write path="src/components/AnimalDetailScreen.tsx" description="Menyimpan riwayat hewan yang terakhir dilihat.">
import { useEffect, useState } from 'react';
```

But I see in my earlier response, I had TWO files targeting the same path. The first one I wrote was for the full AnimalDetailScreen with audio integration. Then I wrote ANOTHER one for AnimalDetailScreen with setLastViewedAnimal. The second one overwrites the first, which is fine. But maybe the first one had some issue.

Wait, I see in my messages I actually wrote AnimalDetailScreen three times:
1. First one: `AnimalDetailScreen.tsx` with audio integration (complete file)
2. Second one: `AnimalDetailScreen.tsx` with setLastViewedAnimal - but this was a `<dyad-write>` with text "Wait, I already have that file previously..." and then another write.
3. Third one: `AnimalDetailScreen.tsx` with setLastViewedAnimal (full file)

The problem might be that the second write (the one with "Wait, I already have that file previously...") got corrupted. Let me check...

Actually looking at my output carefully:

```
<dyad-write path="src/components/AnimalDetailScreen.tsx" description="Menyimpan riwayat hewan yang terakhir dilihat.">
<dyad-write>

Wait, I already have that file previously. I need to add a call to `setLastViewedAnimal` in the AnimalDetailScreen. Let's edit it.

<dyad-write path="src/components/AnimalDetailScreen.tsx" description="Menambahkan setLastViewedAnimal saat halaman detail dibuka.">
(I will modify the file to include a call to setLastViewedAnimal)

Actually, since the component already exists, I need to add `useEffect` to call `setLastViewedAnimal`. Let's write the full file.

<dyad-write path="src/components/AnimalDetailScreen.tsx" description="Menyimpan riwayat hewan yang terakhir dilihat.">
import { useEffect, useState } from 'react';
...
```

I see the problem! I have an unclosed `<dyad-write>` tag followed by text, then another `<dyad-write>`. The first `<dyad-write>` with no content and no closing tag might cause the parser to treat the subsequent text as file content.

The first line:
```
<dyad-write path="src/components/AnimalDetailScreen.tsx" description="Menyimpan riwayat hewan yang terakhir dilihat.">
```

has no closing tag before the next write. This merges the two files, causing the second file's content to have "Wait, I already have that file previously..." text prepended to it. That explains the syntax error.

I need to rewrite the AnimalDetailScreen.tsx file with correct content. But I should just write the correct file now.

Let me write a clean version of AnimalDetailScreen.tsx.</think>Sepertinya ada file yang rusak karena tag `<dyad-write>` ganda. Saya perbaiki file `AnimalDetailScreen.tsx` dengan konten yang benar.

<dyad-write path="src/components/AnimalDetailScreen.tsx" description="Memperbaiki AnimalDetailScreen yang rusak.">
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals } from '@/data/animals';
import { showToastXP, showToastBadge } from '@/components/ToastNotification';
import { AudioPlayer } from '@/components/AudioPlayer';
import { AudioNarrationModal } from '@/components/AudioNarrationModal';

interface Props {
  animalId: string;
  onBack: () => void;
}

export function AnimalDetailScreen({ animalId, onBack }: Props) {
  const animal = animals.find((a) => a.id === animalId);
  const discoverAnimal = useGameStore((s) => s.discoverAnimal);
  const startQuiz = useGameStore((s) => s.startQuiz);
  const isFavorite = useGameStore((s) => s.isFavorite);
  const toggleFavorite = useGameStore((s) => s.toggleFavorite);
  const checkNewBadges = useGameStore((s) => s.checkNewBadges);
  const setLastViewedAnimal = useGameStore((s) => s.setLastViewedAnimal);
  const [showNarration, setShowNarration] = useState(false);

  // Save as last viewed
  useEffect(() => {
    if (animal) {
      setLastViewedAnimal(animal.id);
    }
  }, [animal, setLastViewedAnimal]);

  if (!animal) return null;

  // Discover on view + check badges
  const isNew = !useGameStore.getState().discoveredAnimals.includes(animalId);
  if (isNew) {
    discoverAnimal(animal.id);
    setTimeout(() => {
      const newBadges = checkNewBadges();
      showToastXP(5, `Kamu menemukan ${animal.name}!`);
      newBadges.forEach((badgeId) => showToastBadge(badgeId));
    }, 100);
  }

  const fav = isFavorite(animal.id);

  const getConservationColor = (status: string) => {
    switch (status) {
      case 'aman': return 'var(--green)';
      case 'rentan': return 'var(--yellow-deep)';
      case 'terancam': return 'var(--red)';
      default: return 'var(--green)';
    }
  };

  const getConservationEmoji = (status: string) => {
    switch (status) {
      case 'aman': return '🟢';
      case 'rentan': return '🟡';
      case 'terancam': return '🔴';
      default: return '🟢';
    }
  };

  const getConservationLabel = (status: string) => {
    switch (status) {
      case 'aman': return 'Aman';
      case 'rentan': return 'Rentan';
      case 'terancam': return 'Terancam';
      default: return 'Aman';
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-[var(--cream)] flex flex-col animate-fade-in-up">
      <div className="screen-scroll flex-1">
        {/* Header image area */}
        <div
          className="px-5 pt-6 pb-4 relative"
          style={{
            background: `linear-gradient(180deg, ${animal.color}, var(--orange-pale))`,
            borderRadius: '0 0 32px 32px',
          }}
        >
          {/* Back button */}
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="w-[34px] h-[34px] rounded-full bg-[var(--paper)] border-2 border-[var(--ink)] flex items-center justify-center text-sm"
            >
              ←
            </button>
            <button
              onClick={() => toggleFavorite(animal.id)}
              className={`w-[34px] h-[34px] rounded-full border-2 flex items-center justify-center text-sm transition-all active:scale-90 ${
                fav
                  ? 'bg-[var(--red-pale)] border-[var(--red)]'
                  : 'bg-[var(--paper)] border-[var(--ink)]'
              }`}
            >
              {fav ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Animal emoji */}
          <div className="text-center mt-1">
            <div className="text-[84px] leading-none animate-float">{animal.emoji}</div>
            <span
              className="sticker-badge inline-block -mt-1"
              style={{
                background: getConservationColor(animal.conservationStatus),
              }}
            >
              {getConservationEmoji(animal.conservationStatus)} {getConservationLabel(animal.conservationStatus)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-6">
          {/* Name and audio buttons */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-display text-2xl font-extrabold">{animal.name}</h2>
              <p className="text-xs font-semibold text-[var(--ink-soft)]">
                {animal.englishName} · <span className="italic">{animal.scientificName}</span>
              </p>
            </div>
            <AudioPlayer animal={animal} variant="both" size="md" />
          </div>

          {/* Narration button */}
          <button
            onClick={() => setShowNarration(true)}
            className="mt-2 w-full crayon-btn py-2 text-xs font-bold bg-[var(--blue-pale)] text-[var(--blue-deep)] border-[var(--blue-deep)] shadow-[0_3px_0_var(--blue-deep)]"
          >
            🎤 Dengarkan {animal.name} bercerita!
          </button>

          {/* Info cards */}
          <div className="flex gap-2.5 mt-4">
            <div className="flex-1 crayon-card p-2.5 text-center bg-[var(--green-pale)]">
              <div className="text-xl">{animal.habitatEmoji}</div>
              <div className="text-[10px] font-bold text-[var(--green-deep)] mt-0.5">{animal.habitat}</div>
            </div>
            <div className="flex-1 crayon-card p-2.5 text-center bg-[var(--red-pale)]">
              <div className="text-xl">{animal.foodEmoji}</div>
              <div className="text-[10px] font-bold text-[#A23F2C] mt-0.5">{animal.food}</div>
            </div>
            <div className="flex-1 crayon-card p-2.5 text-center bg-[var(--blue-pale)]">
              <div className="text-xl">⏳</div>
              <div className="text-[10px] font-bold text-[var(--blue-deep)] mt-0.5">{animal.lifespan}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h3 className="font-display text-sm font-bold mb-2">📖 Tentang {animal.name}</h3>
            <div className="crayon-card p-3.5 bg-[var(--paper)]">
              <p className="text-xs font-semibold leading-relaxed">{animal.description}</p>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="mt-5">
            <h3 className="font-display text-sm font-bold mb-2.5">✨ Fakta Menarik</h3>
            <div className="space-y-2.5">
              {animal.funFacts.map((fact, i) => (
                <div
                  key={i}
                  className="crayon-card p-3 px-4"
                  style={{
                    background: i === 0 ? 'var(--yellow)' : 'var(--paper)',
                    animation: `fade-in-up 0.4s ease-out ${i * 0.1}s forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="text-xs font-semibold leading-relaxed">{fact}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Size comparison */}
          <div className="mt-5">
            <h3 className="font-display text-sm font-bold mb-2.5">📏 Ukuran</h3>
            <div className="crayon-card p-3.5 bg-[var(--paper)]">
              <div className="flex items-center gap-3">
                <div className="text-2xl">👤</div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-3 bg-[var(--orange)] rounded-full" style={{ width: '60%' }} />
                  <span className="text-[10px] font-bold">Manusia</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-2xl">{animal.emoji}</div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-4 bg-[var(--blue)] rounded-full" style={{ width: '85%' }} />
                  <span className="text-[10px] font-bold">{animal.weight}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conservation status */}
          <div className="mt-5">
            <h3 className="font-display text-sm font-bold mb-2.5">🌍 Status Konservasi</h3>
            <div className="crayon-card p-3.5 bg-[var(--paper)] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-[2px] border-[var(--ink)] flex items-center justify-center"
                style={{ background: getConservationColor(animal.conservationStatus) }}
              >
                <span className="text-lg">{getConservationEmoji(animal.conservationStatus)}</span>
              </div>
              <div>
                <div className="font-bold text-sm">{getConservationLabel(animal.conservationStatus)}</div>
                <div className="text-[10px] font-semibold text-[var(--ink-soft)]">
                  {animal.conservationStatus === 'aman'
                    ? 'Populasi hewan ini masih stabil di alam liar.'
                    : animal.conservationStatus === 'rentan'
                    ? 'Hewan ini perlu perhatian agar tidak terancam punah.'
                    : 'Hewan ini terancam punah dan perlu dilindungi!'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Quiz Button */}
          <button
            onClick={() => {
              showToastXP(10, `Mulai kuis ${animal.name}!`);
              startQuiz(animal.id);
            }}
            className="mt-6 w-full crayon-btn bg-[var(--orange)] text-white text-sm py-3"
          >
            Mulai Kuis Cepat 🎯
          </button>

          <div className="h-8" />
        </div>
      </div>

      {/* Narration Modal */}
      {showNarration && (
        <AudioNarrationModal
          animal={animal}
          onClose={() => setShowNarration(false)}
        />
      )}
    </div>
  );
}