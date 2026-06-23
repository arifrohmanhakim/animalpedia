import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals } from '@/data/animals';
import { playAnimalSound } from '@/lib/audio';
import { showToastXP, showToastBadge } from '@/components/ToastNotification';

type GameState = 'playing' | 'correct' | 'wrong' | 'finished';

export function GameScreen() {
  const addXP = useGameStore((s) => s.addXP);

  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [options, setOptions] = useState<typeof animals>([]);
  const [correctAnimal, setCorrectAnimal] = useState<(typeof animals)[0] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const soundPlayedRef = useRef(false);

  const MAX_ROUNDS = 5;

  const generateRound = useCallback(() => {
    const pool = [...animals].sort(() => Math.random() - 0.5);
    const correct = pool[0];

    const wrongPool = animals.filter((a) => a.id !== correct.id);
    const shuffledWrong = wrongPool.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledWrong.slice(0, 3);

    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCorrectAnimal(correct);
    setOptions(allOptions);
    setGameState('playing');
    setShowHint(false);
    soundPlayedRef.current = false;
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handlePlaySound = () => {
    if (!correctAnimal || soundPlaying) return;
    setSoundPlaying(true);
    playAnimalSound(correctAnimal);
    soundPlayedRef.current = true;
    setTimeout(() => {
      setSoundPlaying(false);
      setShowHint(true);
    }, 1500);
  };

  // Auto-play sound when round starts
  useEffect(() => {
    if (correctAnimal && !soundPlayedRef.current) {
      const timer = setTimeout(() => {
        handlePlaySound();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [correctAnimal]);

  const handleAnswer = (animalId: string) => {
    if (gameState !== 'playing' || !correctAnimal) return;

    if (animalId === correctAnimal.id) {
      setGameState('correct');
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
      showToastXP(10, `Tebakan benar! ${correctAnimal.name}`);
    } else {
      setGameState('wrong');
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentRound < MAX_ROUNDS - 1) {
      setCurrentRound((r) => r + 1);
      generateRound();
    } else {
      setGameState('finished');
      const bonusXP = streak >= 3 ? 5 : 0;
      addXP(score + bonusXP);
    }
  };

  if (gameState === 'finished') {
    return (
      <div className="screen-container bg-[var(--cream)] items-center justify-center px-8">
        <div className="text-center animate-scale-in">
          <div className="text-8xl mb-4">
            {score >= 40 ? '🏆' : score >= 20 ? '🎉' : '💪'}
          </div>
          <h2 className="font-display text-2xl font-extrabold">
            {score >= 40 ? 'Luar Biasa!' : score >= 20 ? 'Kerenn!' : 'Ayo Latihan Lagi!'}
          </h2>
          <p className="text-sm font-semibold text-[var(--ink-soft)] mt-2">
            Skor akhir: {score}
            {streak >= 3 && ' — Streak terbakar! 🔥'}
          </p>
          <div className="mt-4 text-lg font-bold" style={{ color: 'var(--green-deep)' }}>
            +{score + (streak >= 3 ? 5 : 0)} XP ⭐
          </div>
          <button
            onClick={() => {
              setScore(0);
              setStreak(0);
              setCurrentRound(0);
              generateRound();
            }}
            className="mt-8 crayon-btn bg-[var(--orange)] text-white text-sm py-3.5 px-8"
          >
            Main Lagi 🔄
          </button>
        </div>
      </div>
    );
  }

  if (!correctAnimal) return null;

  return (
    <div className="screen-container bg-[var(--cream)]">
      <div className="screen-scroll">
        {/* Header */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Tebak Suara 🔊</h1>
              <p className="text-xs font-semibold text-[var(--ink-soft)]">
                Tebak hewan dari suaranya!
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--yellow)] border-2 border-[var(--ink)] rounded-full px-3 py-1.5">
              <span className="text-sm">⭐</span>
              <span className="text-xs font-bold">Skor: {score}</span>
            </div>
          </div>

          {/* Round progress */}
          <div className="flex gap-1.5 mt-3">
            {Array.from({ length: MAX_ROUNDS }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full transition-colors"
                style={{
                  background:
                    i < currentRound
                      ? 'var(--green)'
                      : i === currentRound
                      ? 'var(--orange)'
                      : 'var(--cream-deep)',
                  border: '2px solid var(--ink)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Sound button */}
        <div className="flex flex-col items-center py-6 animate-fade-in-up">
          <p className="text-xs font-semibold text-[var(--ink-soft)] mb-4 text-center px-8">
            Dengarkan baik-baik suara hewan ini, lalu tebak!
          </p>

          <button
            onClick={handlePlaySound}
            disabled={soundPlaying}
            className={`w-[140px] h-[140px] rounded-full bg-[var(--blue)] border-[4px] border-[var(--ink)] flex items-center justify-center shadow-[0_5px_0_var(--ink)] transition-transform active:scale-95 ${
              soundPlaying ? 'animate-pulse-glow' : 'hover:scale-105'
            }`}
          >
            {soundPlaying ? (
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            )}
          </button>
          <p className="text-[11px] font-bold text-[var(--blue-deep)] mt-3">
            {soundPlaying ? '🔊 Memutar suara...' : '🎯 Ketuk untuk dengar lagi'}
          </p>

          {/* Hint */}
          {showHint && (
            <div className="mt-3 crayon-card px-4 py-2 bg-[var(--yellow)] animate-scale-in">
              <span className="text-xs font-bold">💡 Petunjuk: </span>
              <span className="text-xs font-semibold">
                {correctAnimal.habitat} · {correctAnimal.category}
              </span>
            </div>
          )}
        </div>

        {/* Animal options grid */}
        <div className="px-5 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {options.map((animal, i) => {
              let bg = 'var(--paper)';
              let border = 'var(--ink)';
              let shadow = 'var(--ink)';

              if (gameState !== 'playing') {
                if (animal.id === correctAnimal.id) {
                  bg = 'var(--green-pale)';
                  border = 'var(--green-deep)';
                  shadow = 'var(--green-deep)';
                } else if (gameState === 'wrong') {
                  bg = 'var(--red-pale)';
                  border = 'var(--red)';
                  shadow = 'var(--red)';
                }
              }

              return (
                <button
                  key={animal.id}
                  onClick={() => handleAnswer(animal.id)}
                  disabled={gameState !== 'playing'}
                  className="crayon-card p-4 text-center transition-all active:scale-95"
                  style={{
                    background: bg,
                    borderColor: border,
                    boxShadow: `0 4px 0 ${shadow}`,
                    animation: `fade-in-up 0.3s ease-out ${i * 0.08}s forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="text-3xl">{animal.emoji}</div>
                  <div className="font-bold text-xs mt-2">{animal.name}</div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {gameState !== 'playing' && (
            <div
              className="mt-4 crayon-card p-3.5 text-center"
              style={{
                background:
                  gameState === 'correct' ? 'var(--green-pale)' : 'var(--red-pale)',
                borderColor:
                  gameState === 'correct' ? 'var(--green-deep)' : 'var(--red)',
              }}
            >
              <div
                className="font-extrabold text-sm"
                style={{
                  color:
                    gameState === 'correct' ? 'var(--green-deep)' : 'var(--red)',
                }}
              >
                {gameState === 'correct'
                  ? `✅ Benar! +10 XP`
                  : `❌ Itu adalah ${correctAnimal.name}!`}
              </div>
              {streak >= 2 && gameState === 'correct' && (
                <div className="text-xs font-bold text-[var(--orange-deep)] mt-1">
                  🔥 Streak {streak}x!
                </div>
              )}
              <button
                onClick={handleNext}
                className="mt-3 w-full crayon-btn bg-[var(--orange)] text-white text-sm py-2.5"
              >
                {currentRound < MAX_ROUNDS - 1
                  ? 'Soal Selanjutnya →'
                  : 'Lihat Skor 🏆'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}