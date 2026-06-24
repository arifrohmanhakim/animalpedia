/**
 * Ambient environment sounds per habitat category.
 * Uses procedural Web Audio API — no audio files needed.
 * Each habitat has a unique looping ambience (wind, waves, etc.).
 */

export interface AmbienceController {
  stop: () => void;
  setVolume: (vol: number) => void;
}

/**
 * Map animal habitat string → ambience type.
 * Handles all ~52 unique habitat values in the data.
 */
function getAmbienceForHabitat(habitat: string): string {
  const h = habitat.toLowerCase();
  if (h.includes('laut') || h.includes('pantai') || h.includes('terumbu')) return 'ocean';
  if (h.includes('sungai') || h.includes('danau') || h.includes('kolam') || h.includes('rawa') || h.includes('pesisir')) return 'lake';
  if (h.includes('savan') || h.includes('sabana') || h.includes('padang rumput') || h.includes('padang sabana')) return 'savanna';
  if (h.includes('gurun')) return 'desert';
  if (h.includes('rumah') || h.includes('ladang') || h.includes('pemukiman') || h.includes('taman')) return 'garden';
  if (h.includes('hutan') || h.includes('pegunungan') || h.includes('gua') || h.includes('pohon') || h.includes('tundra') || h.includes('bambu') || h.includes('lembab')) return 'forest';
  return 'forest'; // default
}

let sharedCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function getCtx(): AudioContext {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new AudioContext();
    masterGain = sharedCtx.createGain();
    masterGain.gain.setValueAtTime(0.15, sharedCtx.currentTime);
    masterGain.connect(sharedCtx.destination);
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
}

/**
 * Play ambient sound for a given animal habitat.
 * Returns a controller to stop or adjust volume.
 */
export function playAmbience(habitat: string): AmbienceController {
  const ctx = getCtx();
  const ambientType = getAmbienceForHabitat(habitat);
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
  if (masterGain) gainNode.connect(masterGain);

  const nodes: AudioNode[] = [gainNode];
  const intervals: number[] = [];
  const stoppedRef = { current: false };

  switch (ambientType) {
    case 'forest':
      nodes.push(...createWind(ctx, gainNode, 'pink', 600, 0.04));
      scheduleAccent(() => playForestChirp(ctx, gainNode), intervals, stoppedRef);
      break;
    case 'savanna':
      nodes.push(...createWind(ctx, gainNode, 'brown', 350, 0.04));
      scheduleAccent(() => playSavannaRumble(ctx, gainNode), intervals, stoppedRef, 4000, 8000);
      break;
    case 'desert':
      nodes.push(...createWind(ctx, gainNode, 'brown', 250, 0.05));
      break;
    case 'ocean':
      nodes.push(...createOcean(ctx, gainNode));
      break;
    case 'garden':
      nodes.push(...createWind(ctx, gainNode, 'white', 1200, 0.025));
      scheduleAccent(() => playGardenBuzz(ctx, gainNode), intervals, stoppedRef);
      break;
    case 'lake':
      nodes.push(...createLake(ctx, gainNode));
      scheduleAccent(() => playLakeCroak(ctx, gainNode), intervals, stoppedRef);
      break;
  }

  return {
    stop: () => {
      stoppedRef.current = true;
      intervals.forEach(clearTimeout);
      // Fade out then disconnect
      const now = ctx.currentTime;
      gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      setTimeout(() => {
        nodes.forEach((n) => {
          try { n.disconnect(); } catch {}
        });
      }, 600);
    },
    setVolume: (vol: number) => {
      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    },
  };
}

/* ─── Wind / Noise ─── */

function createWind(
  ctx: AudioContext,
  dest: AudioNode,
  color: 'white' | 'pink' | 'brown',
  cutoff: number,
  volume: number,
): AudioNode[] {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    // Colored noise
    const white = Math.random() * 2 - 1;
    if (color === 'pink') {
      // Simple pink noise approximation
      last = last + (white - last) * 0.01;
      data[i] = last;
    } else if (color === 'brown') {
      last = last + (white - last) * 0.005;
      data[i] = last * 0.5;
    } else {
      data[i] = white;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoff, ctx.currentTime);
  filter.Q.setValueAtTime(0.5, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  // Slow modulation for natural variation
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.08 + Math.random() * 0.04, ctx.currentTime);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(cutoff * 0.15, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  source.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  source.start();

  return [source, filter, gain, lfo, lfoGain];
}

/* ─── Ocean Waves ─── */

function createOcean(ctx: AudioContext, dest: AudioNode): AudioNode[] {
  // Wave sound: amplitude-modulated noise
  const bufferSize = ctx.sampleRate * 3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    // Wave envelope: slow sine modulates amplitude
    const wave = Math.sin(t * 0.15 * Math.PI) * 0.5 + 0.5;
    const noise = (Math.random() * 2 - 1) * wave;
    data[i] = noise * 0.3;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05, ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  source.start();

  return [source, filter, gain];
}

/* ─── Lake Water ─── */

function createLake(ctx: AudioContext, dest: AudioNode): AudioNode[] {
  // Gentle water with slower modulation than ocean
  const nodes = createOcean(ctx, dest);
  // Reduce volume further
  if (nodes.length > 2) {
    const gain = nodes[2] as GainNode;
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
  }
  return nodes;
}

/* ─── Forest Bird Chirps ─── */

function playForestChirp(ctx: AudioContext, dest: AudioNode) {
  if (ctx.state === 'closed') return;
  const now = ctx.currentTime;
  for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
    const t = now + i * (0.05 + Math.random() * 0.1);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500 + Math.random() * 1500, t);
    osc.frequency.linearRampToValueAtTime(2000 + Math.random() * 1000, t + 0.04);
    gain.gain.setValueAtTime(0.015, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.06);
  }
}

/* ─── Garden Insect Buzz ─── */

function playGardenBuzz(ctx: AudioContext, dest: AudioNode) {
  if (ctx.state === 'closed') return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120 + Math.random() * 60, now);
  osc.frequency.linearRampToValueAtTime(180 + Math.random() * 60, now + 0.3);
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.02, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(now);
  osc.stop(now + 0.6);
}

/* ─── Lake Frog Croak ─── */

function playLakeCroak(ctx: AudioContext, dest: AudioNode) {
  if (ctx.state === 'closed') return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180 + Math.random() * 60, now);
  osc.frequency.exponentialRampToValueAtTime(80 + Math.random() * 30, now + 0.2);
  gain.gain.setValueAtTime(0.02, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(now);
  osc.stop(now + 0.25);

  // Second croak
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(160 + Math.random() * 60, now + 0.35);
  osc2.frequency.exponentialRampToValueAtTime(80 + Math.random() * 30, now + 0.55);
  gain2.gain.setValueAtTime(0.015, now + 0.35);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  osc2.connect(gain2);
  gain2.connect(dest);
  osc2.start(now + 0.35);
  osc2.stop(now + 0.6);
}

/* ─── Savanna Rumble ─── */

function playSavannaRumble(ctx: AudioContext, dest: AudioNode) {
  if (ctx.state === 'closed') return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(40 + Math.random() * 30, now);
  osc.frequency.linearRampToValueAtTime(60 + Math.random() * 20, now + 0.3);
  osc.frequency.linearRampToValueAtTime(30 + Math.random() * 20, now + 0.7);
  gain.gain.setValueAtTime(0.025, now);
  gain.gain.linearRampToValueAtTime(0.04, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(now);
  osc.stop(now + 0.8);
}

/* ─── Schedule Helpers ─── */

/** Repeatedly schedule an accent sound with random delay between plays. */
function scheduleAccent(
  play: () => void,             // plays one accent sound
  intervals: number[],          // collects all timeout ids for cleanup
  stopped: { current: boolean }, // shared stop flag
  delayMin = 2000,
  delayMax = 5000,
) {
  if (stopped.current) return;
  const delay = delayMin + Math.random() * (delayMax - delayMin);
  const id = setTimeout(() => {
    if (stopped.current) return;
    play();
    // schedule next
    scheduleAccent(play, intervals, stopped, delayMin, delayMax);
  }, delay);
  intervals.push(id);
}
