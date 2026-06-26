import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals } from '@/data/animals';
import { showToastXP, showToastBadge } from '@/components/ToastNotification';

interface Card {
  id: string;
  animalId: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame({ onBack }: { onBack: () => void }) {
  const addXP = useGameStore((s) => s.addXP);
  const checkNewBadges = useGameStore((s) => s.checkNewBadges);

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const checkingRef = useRef(false); // synchronous lock against rapid tapping

  const initGame = useCallback(() => {
    // Pick 6 random animals
    const shuffledAnimals = [...animals].sort(() => Math.random() - 0.5).slice(0, 6);
    const pairs: Card[] = [];

    shuffledAnimals.forEach((animal, i) => {
      // Each animal appears twice
      pairs.push({
        id: `card-${i}-a`,
        animalId: animal.id,
        emoji: animal.emoji,
        isFlipped: false,
        isMatched: false,
      });
      pairs.push({
        id: `card-${i}-b`,
        animalId: animal.id,
        emoji: animal.emoji,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    setCards(pairs.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchedCount(0);
    setMoves(0);
    setIsChecking(false);
    checkingRef.current = false;
    setGameFinished(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (index: number) => {
    if (checkingRef.current || gameFinished) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      checkingRef.current = true;
      setIsChecking(true);
      const [first, second] = newFlipped;

      if (cards[first].animalId === cards[second].animalId) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setMatchedCount((c) => c + 1);
          setFlippedIndices([]);
          setIsChecking(false);
          checkingRef.current = false;

          // Check if all matched
          if (matchedCount + 1 === 6) {
            setGameFinished(true);
            const xpAmount = 15;
            addXP(xpAmount);
            showToastXP(xpAmount, 'Memory Game selesai!');
            setTimeout(() => {
              const newBadges = checkNewBadges();
              newBadges.forEach((id) => showToastBadge(id));
            }, 300);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          checkingRef.current = false;
          setIsChecking(false);
        }, 800);
      }
    }
  };

  return (
    <div className="screen-container bg-[var(--cream)]">
      <div className="screen-scroll">
        {/* Header */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-[var(--paper)] border-2 border-[var(--ink)] flex items-center justify-center text-xs"
            >
              ←
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Memory Match 🧠</h1>
              <p className="text-xs font-semibold text-[var(--ink-soft)]">
                Cocokkan pasangan hewan yang sama!
              </p>
            </div>
            <div className="bg-[var(--yellow)] border-2 border-[var(--ink)] rounded-full px-3 py-1.5 text-xs font-bold">
              🎯 {moves}
            </div>
          </div>
          <p className="text-[11px] font-semibold text-[var(--ink-soft)] mt-1">
            {matchedCount}/6 pasang ditemukan
          </p>
        </div>

        {/* Grid */}
        <div className="px-4 pb-6 pt-2">
          {gameFinished ? (
            <div className="text-center py-10 animate-scale-in">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="font-display text-2xl font-extrabold">Selamat!</h2>
              <p className="text-sm font-semibold text-[var(--ink-soft)] mt-1">
                Semua pasangan ditemukan dalam {moves} langkah!
              </p>
              <div className="mt-3 text-lg font-bold text-[var(--green-deep)]">+15 XP ⭐</div>
              <button
                onClick={initGame}
                className="mt-6 crayon-btn bg-[var(--orange)] text-white text-sm py-3 px-8"
              >
                Main Lagi 🔄
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5">
              {cards.map((card, index) => {
                const isVisible = card.isFlipped || card.isMatched;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`crayon-card aspect-square flex items-center justify-center text-3xl transition-all active:scale-95 ${
                      isVisible ? 'bg-[var(--green-pale)]' : 'bg-[var(--paper)]'
                    } ${card.isMatched ? 'opacity-60 animate-pulse' : ''}`}
                    style={{
                      animation: `fade-in-up 0.2s ease-out ${index * 0.03}s forwards`,
                      opacity: 0,
                    }}
                  >
                    {isVisible ? card.emoji : '❓'}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}