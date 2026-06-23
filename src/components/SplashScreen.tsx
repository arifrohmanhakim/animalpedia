import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export function SplashScreen() {
  const finishSplash = useGameStore((s) => s.finishSplash);
  const [show, setShow] = useState(true);
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotIndex((i) => (i + 1) % 3);
    }, 500);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(finishSplash, 400);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(dotInterval);
    };
  }, [finishSplash]);

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--green)] transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute top-[60px] left-[30px] text-3xl opacity-25 -rotate-12">🌿</div>
      <div className="absolute top-[120px] right-[36px] text-2xl opacity-22 rotate-12">⭐</div>
      <div className="absolute bottom-[140px] left-[46px] text-2xl opacity-20 rotate-8">🍃</div>
      <div className="absolute bottom-[90px] right-[50px] text-3xl opacity-22 -rotate-6">⭐</div>

      {/* Logo circle */}
      <div className="w-[128px] h-[128px] rounded-full bg-[var(--yellow)] border-[5px] border-[var(--ink)] flex items-center justify-center text-6xl shadow-[0_6px_0_var(--ink)] animate-float">
        🦁
      </div>

      {/* Title */}
      <h1
        className="font-display text-[30px] font-extrabold text-white mt-5"
        style={{ textShadow: '0 3px 0 var(--green-deep)' }}
      >
        Animalpedia
      </h1>
      <h1
        className="font-display text-[30px] font-extrabold text-[var(--yellow)] -mt-1.5"
        style={{ textShadow: '0 3px 0 var(--green-deep)' }}
      >
        Kids
      </h1>

      {/* Subtitle */}
      <p className="text-xs font-bold text-[var(--green-pale)] mt-2.5 tracking-wide">
        Yuk, jelajahi dunia hewan!
      </p>

      {/* Loading dots */}
      <div className="absolute bottom-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-[9px] h-[9px] rounded-full transition-all duration-300 ${
              i === dotIndex ? 'bg-white scale-110' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
