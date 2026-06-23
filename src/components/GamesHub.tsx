import { useGameStore } from '@/store/gameStore';
import { MemoryGame } from '@/components/MemoryGame';
import { GameScreen } from '@/components/GameScreen';

const games = [
  {
    id: 'sound',
    title: 'Tebak Suara',
    emoji: '🔊',
    description: 'Dengar suara hewan & tebak!',
    bg: 'var(--blue-pale)',
    color: 'var(--blue-deep)',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    emoji: '🧠',
    description: 'Cocokkan pasangan hewan!',
    bg: 'var(--green-pale)',
    color: 'var(--green-deep)',
  },
  {
    id: 'quiz',
    title: 'Kuis Cepat',
    emoji: '🎯',
    description: 'Tantangan pengetahuan hewan!',
    bg: 'var(--orange-pale)',
    color: 'var(--orange-deep)',
  },
];

export function GamesHub() {
  const activeGame = useGameStore((s) => s.activeGame);
  const setActiveGame = useGameStore((s) => s.setActiveGame);

  // Render active game
  if (activeGame === 'memory') {
    return <MemoryGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'sound') {
    return <GameScreen onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'quiz') {
    // For quiz we can trigger a random animal quiz
    // We'll use the existing startQuiz action
    // For simplicity, show a message
    const startQuiz = useGameStore.getState().startQuiz;
    const animals = useGameStore.getState().getAnimals();
    const handleQuiz = () => {
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
      startQuiz(randomAnimal.id);
      setActiveGame(null); // The quiz overlay will appear via the main index
    };

    return (
      <div className="screen-container bg-[var(--cream)] items-center justify-center px-8 text-center animate-fade-in-up">
        <div className="text-8xl mb-4">🎯</div>
        <h2 className="font-display text-2xl font-extrabold">Kuis Cepat</h2>
        <p className="text-sm font-semibold text-[var(--ink-soft)] mt-2">
          Ayo uji pengetahuanmu tentang hewan!
        </p>
        <button
          onClick={handleQuiz}
          className="mt-6 crayon-btn bg-[var(--orange)] text-white text-sm py-3 px-8"
        >
          Mulai Sekarang 🚀
        </button>
        <button
          onClick={() => setActiveGame(null)}
          className="mt-3 text-xs font-bold text-[var(--ink-soft)] underline"
        >
          Kembali ke menu
        </button>
      </div>
    );
  }

  return (
    <div className="screen-container bg-[var(--cream)]">
      <div className="screen-scroll">
        <div className="px-5 pt-4 pb-2">
          <h1 className="font-display text-xl font-bold">🎮 Mini Games</h1>
          <p className="text-xs font-semibold text-[var(--ink-soft)] mt-1">
            Pilih game favoritmu!
          </p>
        </div>

        <div className="px-5 pb-6 space-y-3.5">
          {games.map((game, i) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="w-full crayon-card p-4 flex items-center gap-3.5 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              style={{
                background: game.bg,
                animation: `fade-in-up 0.4s ease-out ${i * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              <div
                className="w-[56px] h-[56px] rounded-full bg-[var(--paper)] border-[3px] border-[var(--ink)] flex items-center justify-center text-2xl flex-shrink-0"
              >
                {game.emoji}
              </div>
              <div className="flex-1 text-left">
                <div className="font-display text-base font-bold">{game.title}</div>
                <div className="text-[11px] font-semibold text-[var(--ink-soft)]">
                  {game.description}
                </div>
              </div>
              <div className="text-lg" style={{ color: game.color }}>→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}