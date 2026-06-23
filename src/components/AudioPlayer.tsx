import { useState } from 'react';
import { playAnimalSound, speakAnimalDescription } from '@/lib/audio';
import { Animal } from '@/data/animals';

interface Props {
  animal: Animal;
  variant?: 'sound' | 'narration' | 'both';
  size?: 'sm' | 'md' | 'lg';
}

export function AudioPlayer({ animal, variant = 'sound', size = 'md' }: Props) {
  const [playing, setPlaying] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const sizeClasses = {
    sm: 'w-[36px] h-[36px] text-sm',
    md: 'w-[46px] h-[46px] text-lg',
    lg: 'w-[60px] h-[60px] text-xl',
  };

  const handleSound = () => {
    if (playing) return;
    setPlaying(true);
    playAnimalSound(animal);
    setTimeout(() => setPlaying(false), 1500);
  };

  const handleNarration = () => {
    if (speaking) return;
    setSpeaking(true);
    speakAnimalDescription(animal);
    // Estimate narration duration
    setTimeout(() => setSpeaking(false), 15000);
  };

  if (variant === 'narration') {
    return (
      <button
        onClick={handleNarration}
        disabled={speaking}
        className={`${sizeClasses[size]} rounded-full bg-[var(--green)] border-[3px] border-[var(--ink)] flex items-center justify-center shadow-[0_3px_0_var(--ink)] text-white flex-shrink-0 transition-all active:translate-y-[2px] active:shadow-[0_1px_0_var(--ink)] ${
          speaking ? 'opacity-70 animate-pulse' : ''
        }`}
      >
        {speaking ? '🎤' : '📖'}
      </button>
    );
  }

  if (variant === 'both') {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleSound}
          disabled={playing}
          className={`${sizeClasses[size]} rounded-full bg-[var(--green)] border-[3px] border-[var(--ink)] flex items-center justify-center shadow-[0_3px_0_var(--ink)] text-white flex-shrink-0 transition-all active:translate-y-[2px] active:shadow-[0_1px_0_var(--ink)] ${
            playing ? 'opacity-70' : ''
          }`}
        >
          {playing ? '🔊' : '🔈'}
        </button>
        <button
          onClick={handleNarration}
          disabled={speaking}
          className={`${sizeClasses[size]} rounded-full bg-[var(--orange)] border-[3px] border-[var(--ink)] flex items-center justify-center shadow-[0_3px_0_var(--ink)] text-white flex-shrink-0 transition-all active:translate-y-[2px] active:shadow-[0_1px_0_var(--ink)] ${
            speaking ? 'opacity-70 animate-pulse' : ''
          }`}
        >
          {speaking ? '🎤' : '📖'}
        </button>
      </div>
    );
  }

  // Default: sound only
  return (
    <button
      onClick={handleSound}
      disabled={playing}
      className={`${sizeClasses[size]} rounded-full bg-[var(--green)] border-[3px] border-[var(--ink)] flex items-center justify-center shadow-[0_3px_0_var(--ink)] text-white flex-shrink-0 transition-all active:translate-y-[2px] active:shadow-[0_1px_0_var(--ink)] ${
        playing ? 'opacity-70' : ''
      }`}
    >
      {playing ? '🔊' : '🔈'}
    </button>
  );
}