import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { categories } from '@/data/animals';

const characters = [
  { id: 'fox', emoji: '🦊', name: 'Rufus si Rubah', desc: 'Cerdik & suka petualangan', bg: 'var(--orange-pale)' },
  { id: 'dolphin', emoji: '🐬', name: 'Bibi si Lumba', desc: 'Ceria & ahli laut dalam', bg: 'var(--blue-pale)' },
  { id: 'owl', emoji: '🦉', name: 'Owi si Burung Hantu', desc: 'Bijak & suka membaca fakta', bg: 'var(--green-pale)' },
];

const ageRanges = [
  { id: '4-6', emoji: '🧒', label: '4–6 tahun' },
  { id: '7-8', emoji: '🧑', label: '7–8 tahun' },
  { id: '9-10', emoji: '🧑‍🎓', label: '9–10 tahun' },
  { id: 'parent', emoji: '👨‍👩‍👧', label: 'Orang tua' },
];

export function OnboardingScreen() {
  const completeOnboarding = useGameStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(1);
  const [selectedChar, setSelectedChar] = useState('fox');
  const [selectedAge, setSelectedAge] = useState('7-8');
  const [favoriteCats, setFavoriteCats] = useState<string[]>(['mamalia']);
  const [playerName, setPlayerName] = useState('');

  const toggleCategory = (catId: string) => {
    setFavoriteCats((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleFinish = () => {
    completeOnboarding({
      playerName: playerName || 'Naila',
      selectedCharacter: selectedChar,
      ageRange: selectedAge,
      favoriteCategories: favoriteCats,
    });
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-[var(--cream)]">
      {/* Step 1: Choose character */}
      {step === 1 && (
        <div className="flex flex-col flex-1">
          <div className="pt-8 pb-4 text-center animate-fade-in-up">
            <h2 className="font-display text-xl font-extrabold leading-tight">
              Pilih sahabat<br />petualanganmu!
            </h2>
            <p className="text-xs font-semibold text-[var(--ink-soft)] mt-2">
              Dia akan menemanimu belajar setiap hari
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-7">
            {characters.map((char) => {
              const isSelected = selectedChar === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedChar(char.id)}
                  className={`w-full crayon-card flex items-center gap-3.5 p-4 transition-all ${
                    isSelected
                      ? 'bg-[var(--orange-pale)] border-[var(--orange-deep)] shadow-[0_4px_0_var(--orange-deep)]'
                      : 'bg-[var(--paper)]'
                  }`}
                >
                  <div
                    className="w-[58px] h-[58px] rounded-full bg-[var(--paper)] border-[3px] border-[var(--ink)] flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: isSelected ? char.bg : 'var(--paper)' }}
                  >
                    {char.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-sm">{char.name}</div>
                    <div className="text-[11px] text-[var(--ink-soft)] font-semibold">
                      {char.desc}
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[var(--orange)] border-[var(--ink)] text-white'
                        : 'border-[var(--line)] text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-5 pb-5 pt-2">
            <button
              onClick={() => setStep(2)}
              className="w-full crayon-btn bg-[var(--orange)] text-white text-sm py-3.5"
            >
              Lanjut →
            </button>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-[9px] h-[9px] rounded-full bg-[var(--ink)]" />
              <div className="w-[9px] h-[9px] rounded-full bg-[var(--line)]" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Age & interests */}
      {step === 2 && (
        <div className="flex flex-col flex-1">
          <div className="pt-8 pb-2 text-center animate-fade-in-up">
            <div className="text-5xl">{characters.find((c) => c.id === selectedChar)?.emoji}</div>
            <h2 className="font-display text-lg font-extrabold mt-2">Berapa usiamu?</h2>
            <p className="text-xs font-semibold text-[var(--ink-soft)] mt-1.5">
              Biar kami kasih cerita yang pas buatmu
            </p>
          </div>

          {/* Name input */}
          <div className="px-6 mt-3">
            <div className="bg-[var(--paper)] border-[3px] border-[var(--ink)] rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <span>✏️</span>
              <input
                type="text"
                placeholder="Nama kamu..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)]"
                maxLength={20}
              />
            </div>
          </div>

          {/* Age grid */}
          <div className="px-6 mt-4 grid grid-cols-2 gap-3">
            {ageRanges.map((age) => {
              const isSelected = selectedAge === age.id;
              return (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(age.id)}
                  className={`crayon-card p-4 text-center transition-all ${
                    isSelected
                      ? 'bg-[var(--green-pale)] border-[var(--green-deep)] shadow-[0_4px_0_var(--green-deep)]'
                      : 'bg-[var(--paper)]'
                  }`}
                >
                  <div className="text-2xl">{age.emoji}</div>
                  <div
                    className={`font-bold text-xs mt-1 ${
                      isSelected ? 'text-[var(--green-deep)]' : ''
                    }`}
                  >
                    {age.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Favorite categories */}
          <div className="px-6 mt-5">
            <h3 className="font-display text-sm font-bold mb-2.5">
              Hewan favoritmu?{' '}
              <span className="text-[11px] text-[var(--ink-soft)] font-semibold">
                (pilih beberapa)
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.slice(1).map((cat) => {
                const isSelected = favoriteCats.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`pill-tab transition-all ${
                      isSelected
                        ? 'bg-[var(--orange)] text-white border-[var(--ink)]'
                        : 'bg-[var(--paper)] border-[var(--line)] text-[var(--ink-soft)]'
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-5 pt-4 mt-auto">
            <button
              onClick={handleFinish}
              className="w-full crayon-btn bg-[var(--orange)] text-white text-sm py-3.5"
            >
              Mulai Berpetualang! 🚀
            </button>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-[9px] h-[9px] rounded-full bg-[var(--line)]" />
              <div className="w-[9px] h-[9px] rounded-full bg-[var(--ink)]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
