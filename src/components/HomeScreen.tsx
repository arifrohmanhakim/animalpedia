import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals } from '@/data/animals';

export function HomeScreen() {
  const playerName = useGameStore((s) => s.playerName);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const xp = useGameStore((s) => s.xp);
  const getLevel = useGameStore((s) => s.getLevel);
  const getCollectionProgress = useGameStore((s) => s.getCollectionProgress);
  const discoverAnimal = useGameStore((s) => s.discoverAnimal);

  const setTab = useGameStore((s) => s.setTab);
  const startQuiz = useGameStore((s) => s.startQuiz);
  const [dailyAnimal] = useState(() => {
    const today = new Date().toDateString();
    const hash = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return animals[hash % animals.length];
  });

  const characterEmojis: Record<string, string> = {
    fox: '🦊',
    dolphin: '🐬',
    owl: '🦉',
  };

  const level = getLevel();
  const progress = getCollectionProgress();

  useEffect(() => {
    discoverAnimal(dailyAnimal.id);
  }, []);

  return (
    <div className="screen-container bg-[var(--cream)]">
      <div className="screen-scroll">
        {/* Top bar */}
        <div className="flex justify-between items-center px-5 pt-4 pb-2">
          <div>
            <div className="text-xs font-semibold text-[var(--ink-soft)]">Halo,</div>
            <h1 className="font-display text-xl font-bold text-[var(--ink)]">
              {playerName || 'Kak Naila'}! 👋
            </h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-[var(--yellow)] border-[3px] border-[var(--ink)] flex items-center justify-center text-xl">
            {characterEmojis[selectedCharacter] || '🦊'}
          </div>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Hero Card */}
          <div className="crayon-card p-4 bg-[var(--green-pale)] animate-fade-in-up">
            <p className="text-xs font-bold text-[var(--green-deep)]">Hari ini kita belajar hewan apa?</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-16 h-16 rounded-full bg-[var(--paper)] border-[3px] border-[var(--ink)] flex items-center justify-center text-3xl flex-shrink-0">
                {dailyAnimal.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold">{dailyAnimal.name}</h3>
                <p className="text-xs font-semibold text-[var(--ink-soft)]">{dailyAnimal.habitat}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setTab('explore');
              }}
              className="mt-3 w-full crayon-btn bg-[var(--orange)] text-white text-sm py-2.5"
            >
              Kenalan Yuk! →
            </button>
          </div>

          {/* Continue learning */}
          <div className="animate-fade-in-up animate-stagger-1">
            <h3 className="font-display text-sm font-bold mb-2">📖 Lanjutkan Belajar</h3>
            <div className="crayon-card p-3 flex items-center gap-3">
              <div className="w-[46px] h-[46px] rounded-xl bg-[var(--blue-pale)] flex items-center justify-center text-2xl">
                🐬
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">Lumba-lumba</div>
                <div className="progress-track mt-1 h-[9px]">
                  <div className="progress-fill" style={{ width: '60%', background: 'var(--blue)' }} />
                </div>
              </div>
              <div className="text-lg">›</div>
            </div>
          </div>

          {/* Daily Challenge */}
          <div className="animate-fade-in-up animate-stagger-2">
            <h3 className="font-display text-sm font-bold mb-2">⭐ Misi Harian</h3>
            <button
              onClick={() => {
                const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
                startQuiz(randomAnimal.id);
              }}
              className="w-full crayon-card p-3.5 bg-[var(--orange-pale)] flex items-center gap-3"
            >
              <div className="text-3xl">🎯</div>
              <div className="flex-1 text-left">
                <div className="font-bold text-xs text-[var(--orange-deep)]">Kuis Hari Ini</div>
                <div className="text-[11px] font-semibold text-[var(--ink-soft)]">+10 XP menanti kamu!</div>
              </div>
              <span className="sticker-badge">BARU</span>
            </button>
          </div>

          {/* Progress */}
          <div className="animate-fade-in-up animate-stagger-3">
            <div className="crayon-card p-3.5 bg-[var(--paper)]">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>🐾 Hewan ditemukan</span>
                <span style={{ color: 'var(--green-deep)' }}>
                  {progress.discovered} / {progress.total}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${(progress.discovered / progress.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Level & XP */}
          <div className="animate-fade-in-up animate-stagger-4">
            <div className="crayon-card p-3.5 bg-[var(--paper)]">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⭐</div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Level {level.level} — {level.title}</span>
                    <span style={{ color: 'var(--orange-deep)' }}>{xp} XP</span>
                  </div>
                  <div className="progress-track mt-1.5 h-[9px]">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${level.progress * 100}%`,
                        background: 'var(--orange)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
