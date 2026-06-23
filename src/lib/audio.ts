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
  } else if (id === 'kanguru') {
    // Thump-thump hopping sound
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.3;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(60, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + delay + 0.05);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + delay + 0.1);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.12);
    }
  } else if (id === 'beruang') {
    // Low growl
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.4);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } else if (id === 'kambing') {
    // Baa sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  } else if (id === 'sapi') {
    // Moo sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } else if (id === 'monyet') {
    // Ooh-ooh-ah-ah chatter
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const freq = i % 2 === 0 ? 500 : 700;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(freq + 200, ctx.currentTime + delay + 0.03);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.06);
    }
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
  if (id === 'elang') {
    // Eagle screech
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } else if (id === 'kakaktua') {
    // Cockatoo squawk
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } else if (id === 'bebek') {
    // Quack quack
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.2;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + delay + 0.05);
      osc.frequency.linearRampToValueAtTime(420, ctx.currentTime + delay + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.1);
    }
  } else if (id === 'angsa') {
    // Swan honk
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(280, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
    // Second honk
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(220, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.15, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.25);
    }, 500);
  } else if (id === 'merak') {
    // Peacock call – descending chirps
    for (let i = 0; i < 2; i++) {
      const delay = i * 0.4;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + delay + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.35);
    }
  } else if (id === 'penguin') {
    // Penguin bray
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.08);
    osc.frequency.linearRampToValueAtTime(250, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (id === 'flamingo') {
    // Flamingo honk
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } else {
    // Generic chirps and whistles
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.2;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 600;
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
    // Hiss + low growl
    playNoise(ctx, 0.8, 200, 0.15);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } else if (id === 'tokek') {
    // Gecko chirp
    for (let i = 0; i < 2; i++) {
      const delay = i * 0.3;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + delay + 0.03);
      osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + delay + 0.06);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.08);
    }
  } else if (id === 'iguana') {
    // Iguana hiss + growl
    playNoise(ctx, 0, 100, 0.15);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + 0.1);
    osc.stop(ctx.currentTime + 0.4);
  } else if (id === 'kura-kura') {
    // Slow deep rumble
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } else if (id === 'ular') {
    // Snake hiss
    playNoise(ctx, 0, 200, 0.15);
  } else if (id === 'bunglon') {
    // Chameleon – short click
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + delay + 0.02);
      gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.04);
    }
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
  } else if (id === 'gurita') {
    // Octopus – bubbling + whoosh
    playBubbleSound(ctx);
    for (let i = 0; i < 2; i++) {
      const delay = i * 0.5;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + delay + 0.15);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + delay + 0.35);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.4);
    }
  } else if (id === 'ikan-badut') {
    // Clownfish – bubbly chirps
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.15;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + i * 100, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(500 + i * 100, ctx.currentTime + delay + 0.04);
      gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.06);
    }
  } else if (id === 'penyu') {
    // Sea turtle – slow deep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
    playBubbleSound(ctx);
  } else if (id === 'bintang-laut') {
    // Starfish – soft clicks and bubbles
    for (let i = 0; i < 5; i++) {
      const delay = i * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200 + Math.random() * 200, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.05, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.08);
    }
    playBubbleSound(ctx);
  } else if (id === 'kuda-laut') {
    // Seahorse – gentle clicking
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.3;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(600 + Math.random() * 200, ctx.currentTime + delay + 0.03);
      gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.05);
    }
    playBubbleSound(ctx);
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
  } else if (id === 'kupu-kupu') {
    // Butterfly – light fluttering
    for (let i = 0; i < 6; i++) {
      const delay = i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100 + Math.random() * 200, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.03, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.05);
    }
  } else if (id === 'semut') {
    // Ant – tiny clicks
    for (let i = 0; i < 8; i++) {
      const delay = i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2000 + Math.random() * 1000, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.02, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.02);
    }
  } else if (id === 'capung') {
    // Dragonfly – rapid wing buzz
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } else if (id === 'kunang-kunang') {
    // Firefly – gentle rhythmic pulses
    for (let i = 0; i < 5; i++) {
      const delay = i * 0.35;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150 + Math.random() * 100, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.1);
    }
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
    // Frog croak
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
      osc2.frequency.setValueAtTime(180, ctx.currentTime + 0.5);
      osc2.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.5 + 0.25);
      gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.5);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5 + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5 + 0.3);
    }, 500);
  } else if (id === 'salamander') {
    // Salamander – wet clicking
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.3;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + delay + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.12);
    }
  } else if (id === 'axolotl') {
    // Axolotl – tiny gurgle
    playBubbleSound(ctx);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
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