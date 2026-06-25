import { useState, useEffect } from 'react';
import { Animal } from '@/data/animals';

interface Props {
  animal: Animal;
  onClose: () => void;
}

export function AudioNarrationModal({ animal, onClose }: Props) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Split story into sentences, filter empty, prepend greeting + append closing
  const storyParts = animal.story
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s + ".");
  const lines = [
    `Halo, aku ${animal.name}! Senang berkenalan denganmu!`,
    ...storyParts,
    `Sekian dulu cerita tentang aku, ${animal.name}. Sampai jumpa lagi!`,
  ];

  useEffect(() => {
    if (currentLine < lines.length - 1) {
      const timer = setTimeout(() => setCurrentLine((i) => i + 1), 4000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsFinished(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentLine, lines.length]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="crayon-card mx-5 p-6 bg-[var(--paper)] max-w-sm w-full animate-scale-in">
        <div className="text-center">
          {/* Animal avatar */}
          <div className="w-[80px] h-[80px] rounded-full bg-[var(--yellow)] border-[4px] border-[var(--ink)] flex items-center justify-center text-4xl mx-auto shadow-[0_4px_0_var(--ink)] animate-float">
            {animal.emoji}
          </div>

          <h3 className="font-display text-lg font-bold mt-2">
            {animal.name} bercerita...
          </h3>

          {/* Speech bubble */}
          <div className="mt-4 crayon-card p-4 bg-[var(--blue-pale)] min-h-[100px] flex items-center justify-center">
            <p className="text-xs font-semibold leading-relaxed animate-fade-in-up" key={currentLine}>
              {lines[currentLine] || lines[0]}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-1.5 mt-4">
            {!isFinished ? (
              <span className="text-[10px] font-bold text-[var(--ink-soft)]">
                {currentLine + 1} / {lines.length}
              </span>
            ) : (
              <span className="text-xs font-semibold text-[var(--ink-soft)]">Selesai ✅</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleClose}
              className="flex-1 crayon-btn bg-[var(--orange)] text-white text-sm py-2.5"
            >
              ✕ Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}