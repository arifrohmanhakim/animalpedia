import { useState, useEffect, useCallback } from 'react';
import { speakText } from '@/lib/audio';
import { Animal } from '@/data/animals';

interface Props {
  animal: Animal;
  onClose: () => void;
}

export function AudioNarrationModal({ animal, onClose }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);

  const lines = [
    `Halo, aku ${animal.name}! Senang berkenalan denganmu!`,
    `${animal.description}`,
    ...animal.funFacts.slice(0, 3).map((f) => `Tahukah kamu? ${f}`),
    `Sekian dulu cerita tentang aku, ${animal.name}. Sampai jumpa lagi!`,
  ];

  const startNarration = useCallback(() => {
    const fullText = lines.join('. ');
    setIsSpeaking(true);
    speakText(fullText, () => {
      setIsSpeaking(false);
    });

    // Animate through lines
    lines.forEach((_, i) => {
      setTimeout(() => {
        setCurrentLine(i);
      }, i * 4000);
    });
  }, []);

  useEffect(() => {
    startNarration();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [startNarration]);

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
            <p className="text-xs font-semibold leading-relaxed animate-fade-in-up">
              {lines[currentLine] || lines[0]}
            </p>
          </div>

          {/* Audio indicator */}
          <div className="flex justify-center gap-1.5 mt-4">
            {isSpeaking ? (
              <>
                <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </>
            ) : (
              <span className="text-xs font-semibold text-[var(--ink-soft)]">Selesai ✅</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 mt-4">
            {!isSpeaking && (
              <button
                onClick={startNarration}
                className="flex-1 crayon-btn bg-[var(--green)] text-white text-sm py-2.5"
              >
                🔄 Ulangi
              </button>
            )}
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                onClose();
              }}
              className={`crayon-btn bg-[var(--orange)] text-white text-sm py-2.5 ${
                isSpeaking ? 'flex-1' : 'flex-1'
              }`}
            >
              {isSpeaking ? '⏹ Berhenti' : '✕ Tutup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}