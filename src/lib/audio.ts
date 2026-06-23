/**
 * Sistem Audio Animalpedia Kids
 * Menggunakan Web Audio API untuk efek suara hewan
 * dan Speech Synthesis untuk narasi AI
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Memainkan suara hewan berdasarkan karakteristik fisiknya.
 * Menggunakan synthesizer sederhana (oscillator + noise).
 */
export function playAnimalSound(animal: {
  name: string;
  category: string;
  id: string;
}) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (animal.category) {
      case 'mamalia':
        playMammalSound(ctx, animal.id);
        break;
      case 'burung':
        playBirdSound(ctx, animal.id);
        break;
      case 'reptil':
        playReptileSound(ctx, animal.id);
        break;
      case 'laut':
        playWaterSound(ctx, animal.id);
        break;
      case 'serangga':
        playInsectSound(ctx, animal.id);
        break;
      case 'amfibi':
        playAmphibianSound(ctx, animal.id);
        break;
      default:
        playMammalSound(ctx, animal.id);
    }
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

function playMammalSound(ctx: AudioContext, id: string) {
  // Custom per animal
  if (id === 'singa') {
    // Roar: low frequency with growl
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);

    // Add growl noise
    playNoise(ctx, 0.8, 80, 0.2);
  } else if (id === 'gajah') {
    // Elephant trumpet
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } else if (id === 'panda') {
    // Soft humming
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.9);
  } else {
    // Generic mammal
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110 + Math.random() * 90, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80 + Math.random() * 60, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }
}

function playBirdSound(ctx: AudioContext, id: string) {
  // Chirps and whistles
  for (let i = 0; i < 3; i++) {
    const delay = i * 0.2;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const baseFreq = id === 'elang' ? 300 : 600;
    osc.frequency.setValueAtTime(baseFreq + Math.random() * 400, ctx.currentTime + delay);
    osc.frequency.linearRampToValueAtTime(baseFreq + Math.random() * 600, ctx.currentTime + delay + 0.08);
    gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.15);
  }

  if (id === 'kakaktua') {
    // Harsher squawk
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(800, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.12, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.2);
    }, 600);
  }
}

function playReptileSound(ctx: AudioContext, id: string) {
  if (id === 'buaya') {
    // Low rumble + snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    // Snap at end
    playNoise(ctx, 0.5, 300, 0.12);
  } else if (id === 'komodo') {
    // Hiss
    playNoise(ctx, 0.8, 200, 0.15);
  } else {
    // Generic hiss
    playNoise(ctx, 0.6, 100, 0.1);
  }
}

function playWaterSound(ctx: AudioContext, id: string) {
  if (id === 'paus') {
    // Whale song - deep sine with modulation
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
    lfoGain.gain.setValueAtTime(30, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 3);
    lfo.start();
    lfo.stop(ctx.currentTime + 3);

    // Add water bubble effect
    for (let i = 0; i < 5; i++) {
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      bOsc.type = 'sine';
      bOsc.frequency.setValueAtTime(200 + Math.random() * 300, ctx.currentTime + 0.5 + i * 0.4);
      bGain.gain.setValueAtTime(0.06, ctx.currentTime + 0.5 + i * 0.4);
      bGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5 + i * 0.4 + 0.2);
      bOsc.connect(bGain);
      bGain.connect(ctx.destination);
      bOsc.start(ctx.currentTime + 0.5 + i * 0.4);
      bOsc.stop(ctx.currentTime + 0.5 + i * 0.4 + 0.2);
    }
  } else if (id === 'lumba-lumba') {
    // Dolphin clicks and whistles
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    // Clicks
    for (let i = 0; i < 4; i++) {
      playClick(ctx, 0.6 + i * 0.15, 1500 + Math.random() * 500);
    }
  } else if (id === 'hiu') {
    // Menacing rumble
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } else {
    // Generic water/bubble
    playBubbleSound(ctx);
  }
}

function playInsectSound(ctx: AudioContext, id: string) {
  if (id === 'lebah') {
    // Bzzz
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } else {
    // Generic insect buzz
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100 + Math.random() * 100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200 + Math.random() * 100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }
}

function playAmphibianSound(ctx: AudioContext, id: string) {
  if (id === 'katak') {
    // Croak
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);

    // Second croak
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(180, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.25);
      gain2.gain.setValueAtTime(0.18, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.3);
    }, 500);
  } else {
    // Generic croak
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150 + Math.random() * 100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60 + Math.random() * 40, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
}

/* Helper functions */

function playNoise(ctx: AudioContext, startTime: number, frequency: number, duration: number) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(frequency, ctx.currentTime);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime + startTime);
  source.stop(ctx.currentTime + startTime + duration);
}

function playBubbleSound(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300 + Math.random() * 400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function playClick(ctx: AudioContext, startTime: number, frequency: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + 0.05);
}

/**
 * Narasi AI menggunakan Speech Synthesis API
 * Membacakan deskripsi atau fakta dengan suara yang ramah anak
 */
export function speakText(text: string, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.9; // Slower for kids
  utterance.pitch = 1.2; // Slightly higher pitch (friendlier)
  utterance.volume = 1;

  // Try to find a female Indonesian voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) => v.lang.startsWith('id') && v.name.includes('Female')
  ) || voices.find((v) => v.lang.startsWith('id'))
  || voices.find((v) => v.name.includes('Google'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Membacakan fakta menarik tentang hewan
 */
export function speakFunFact(animalName: string, fact: string) {
  const text = `Tahukah kamu? ${fact}`;
  speakText(text);
}

/**
 * Membacakan deskripsi lengkap hewan (narasi AI 15-30 detik)
 */
export function speakAnimalDescription(animal: {
  name: string;
  description: string;
  funFacts: string[];
}) {
  const intro = `Halo, aku ${animal.name}! ${animal.description}`;
  const factPart = animal.funFacts.slice(0, 2).join('. ');
  const fullText = `${intro} ${factPart}`;
  speakText(fullText);
}