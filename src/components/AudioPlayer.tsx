import { useState, useRef, useEffect } from 'react';
import { playAnimalSound, speakAnimalDescription, type SoundPlayback } from '@/lib/audio';
import type { Animal } from '@/data/animals';

interface Props {
  animal: Animal;
  variant?: 'sound' | 'narration' | 'both';
  size?: 'sm' | 'md' | 'lg';
}

type ButtonState = 'idle' | 'loading' | 'playing';

export function AudioPlayer({ animal, variant = 'sound', size = 'md' }: Props) {
  const [soundState, setSoundState] = useState<ButtonState>('idle');
  const [speaking, setSpeaking] = useState(false);
  const soundRef = useRef<SoundPlayback | null>(null);

  // Cleanup saat unmount
  useEffect(() => {
    return () => soundRef.current?.stop();
  }, []);

  const sizeClasses = {
    sm: 'w-[36px] h-[36px] text-sm',
    md: 'w-[46px] h-[46px] text-lg',
    lg: 'w-[60px] h-[60px] text-xl',
  };

  const handleSound = () => {
    if (soundState === 'loading') return;

    // Toggle: stop jika sedang playing
    if (soundState === 'playing' && soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
      setSoundState('idle');
      return;
    }

    setSoundState('loading');
    soundRef.current = playAnimalSound(animal, {
      onLoad: () => setSoundState('playing'),
      onEnd: () => {
        setSoundState('idle');
        soundRef.current = null;
      },
    });
  };

  const handleNarration = () => {
    if (speaking) return;
    setSpeaking(true);
    speakAnimalDescription(animal);
    setTimeout(() => setSpeaking(false), 15000);
  };

  const soundIcon = () => {
    switch (soundState) {
      case 'loading': return '⏳';
      case 'playing': return '⏸';
      default: return '🔈';
    }
  };

  const soundDisabled = soundState === 'loading';
  const soundExtraClass = soundState === 'playing' ? 'opacity-70 ring-2 ring-white' : '';

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
          disabled={soundDisabled}
          className={`${sizeClasses[size]} rounded-full bg-[var(--green)] border-[3px] border-[var(--ink)] flex items-center justify-center shadow-[0_3px_0_var(--ink)] text-white flex-shrink-0 transition-all active:translate-y-[2px] active:shadow-[0_1px_0_var(--ink)] ${soundExtraClass}`}
        >
          {soundIcon()}
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
      disabled={soundDisabled}
      className={`${sizeClasses[size]} rounded-full bg-[var(--green)] border-[3px] border-[var(--ink)] flex items-center justify-center shadow-[0_3px_0_var(--ink)] text-white flex-shrink-0 transition-all active:translate-y-[2px] active:shadow-[0_1px_0_var(--ink)] ${soundExtraClass}`}
    >
      {soundIcon()}
    </button>
  );
}