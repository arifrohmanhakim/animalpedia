import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals } from '@/data/animals';
import { showToastXP } from '@/components/ToastNotification';

type GameState = 'playing' | 'correct' | 'wrong' | 'finished';

function getCroppedSvg(svgString: string, size: number): string {
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${svgString.replace(/<svg[^>]*>/g, '').replace(/<\/svg>/g, '')}</svg>`;
  }

  const parts = viewBoxMatch[1].split(' ').map(Number);
  if (parts.length !== 4) return svgString;
  const [vx, vy, vw, vh] = parts;

  const cropW = Math.round(vw * 0.3 + Math.random() * vw * 0.15);
  const cropH = Math.round(vh * 0.3 + Math.random() * vh * 0.15);
  const cropX = Math.round(vx + Math.random() * Math.max(0, vw - cropW));
  const cropY = Math.round(vy + Math.random() * Math.max(0, vh - cropH));

  const inner = svgString.replace(/<svg[^>]*>/g, '').replace(/<\/svg>/g, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cropX} ${cropY} ${cropW} ${cropH}" width="${size}" height="${size}">${inner}</svg>`;
}

export function ImageGuessGame({ onBack }: { onBack?: () => void }) {
  const addXP = useGameStore((s) => s.addXP);

  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [options, setOptions] = useState<typeof animals>([]);
  const [correctAnimal, setCorrectAnimal] = useState<(typeof animals)[0] | null>(null);
  const [croppedSvg, setCroppedSvg] = useState<string>('');
  const [imageCrop, setImageCrop] = useState({ x: 50, y: 50 });

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

    if (correct.illustrationSvg) {
      setCroppedSvg(getCroppedSvg(correct.illustrationSvg, 200));
    }
    setImageCrop({
      x: Math.round(15 + Math.random() * 70),
      y: Math.round(15 + Math.random() * 70),
    });
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

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
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setScore(0);
                setStreak(0);
                setCurrentRound(0);
                generateRound();
              }}
              className="flex-1 crayon-btn bg-[var(--orange)] text-white text-sm py-3"
            >
              Main Lagi 🔄
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 crayon-btn bg-[var(--green)] text-white text-sm py-3"
              >
                Kembali 🏠
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!correctAnimal) return null;

  const renderCroppedImage = () => {
    if (correctAnimal.illustrationSvg && croppedSvg) {
      return (
        <div
          className="w-[200px] h-[200px] rounded-2xl border-[4px] border-[var(--ink)] shadow-[0_4px_0_var(--ink)] overflow-hidden bg-[var(--paper)]"
        >
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: croppedSvg }}
          />
        </div>
      );
    }

    if (correctAnimal.imageUrl && !correctAnimal.imageUrl.includes('emoji-datasource')) {
      return (
        <div className="w-[200px] h-[200px] rounded-2xl border-[4px] border-[var(--ink)] shadow-[0_4px_0_var(--ink)] overflow-hidden bg-[var(--paper)]">
          <img
            src={correctAnimal.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{
              objectPosition: `${imageCrop.x}% ${imageCrop.y}%`,
              transform: 'scale(2)',
            }}
          />
        </div>
      );
    }

    return (
      <div className="w-[200px] h-[200px] rounded-2xl border-[4px] border-[var(--ink)] shadow-[0_4px_0_var(--ink)] overflow-hidden bg-[var(--paper)] flex items-center justify-center">
        <span
          className="select-none leading-none"
          style={{
            fontSize: 240,
            transform: `translate(${(imageCrop.x - 50) * 3}px, ${(imageCrop.y - 50) * 3}px)`,
            display: 'block',
          }}
        >
          {correctAnimal.emoji}
        </span>
      </div>
    );
  };

  return (
    <div className="screen-container bg-[var(--cream)]">
      <div className="screen-scroll">
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-[var(--paper)] border-2 border-[var(--ink)] flex items-center justify-center text-xs"
              >
                ←
              </button>
            )}
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Tebak Gambar 🖼️</h1>
              <p className="text-xs font-semibold text-[var(--ink-soft)]">
                Tebak hewan dari bagian gambarnya!
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--yellow)] border-2 border-[var(--ink)] rounded-full px-3 py-1.5">
              <span className="text-sm">⭐</span>
              <span className="text-xs font-bold">Skor: {score}</span>
            </div>
          </div>

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

        <div className="flex flex-col items-center py-6 animate-fade-in-up">
          <p className="text-xs font-semibold text-[var(--ink-soft)] mb-4 text-center px-8">
            Perhatikan baik-baik bagian hewan ini, lalu tebak!
          </p>

          <div className="animate-float">
            {renderCroppedImage()}
          </div>
        </div>

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
