// Web Audio API High-Tech Tactical UI Sound Effects (SFX) Synthesizer
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a short burst of filtered white noise for tactile transient clicks/ticks
 */
function playNoise(
  ctx: AudioContext,
  now: number,
  duration: number,
  filterType: BiquadFilterType,
  freq: number,
  q: number,
  gainVal: number
) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(freq, now);
  filter.Q.setValueAtTime(q, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainVal, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.002);

  noiseNode.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseNode.start(now);
  noiseNode.stop(now + duration);
}

export type SFXType = 'hover' | 'hover_major' | 'click' | 'click_major' | 'transition' | 'panel' | 'chime';

/**
 * Play dynamic techy/digital sound effects
 */
export function playAudio(type: SFXType) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'hover') {
      // Extremely subtle high-frequency tactical tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);

      gain.gain.setValueAtTime(0.005, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.015);

      // Accent tick noise
      playNoise(ctx, now, 0.006, 'highpass', 5000, 1.2, 0.004);

    } else if (type === 'hover_major') {
      // Distinct dual-tick ("dudut") telemetry notification
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      // Tick 1
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1800, now);
      gain1.gain.setValueAtTime(0.006, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.015);

      // Tick 2 (staggered & pitched higher)
      const delay = 0.035;
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2400, now + delay);
      gain2.gain.setValueAtTime(0.006, now + delay);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.012);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + delay);
      osc2.stop(now + delay + 0.015);

      // Mini noise burst for both
      playNoise(ctx, now, 0.005, 'highpass', 4500, 1, 0.003);
      playNoise(ctx, now + delay, 0.005, 'highpass', 5500, 1.5, 0.003);

    } else if (type === 'click') {
      // Premium dampened digital button release / mechanical tick
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.exponentialRampToValueAtTime(400, now + 0.018);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(600, now);
      osc2.frequency.exponentialRampToValueAtTime(150, now + 0.025);

      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.02);
      osc2.stop(now + 0.028);

      // High quality contact sound click transient
      playNoise(ctx, now, 0.012, 'bandpass', 1800, 2.5, 0.008);

    } else if (type === 'click_major') {
      // Solid digital command console activation
      const oscSub = ctx.createOscillator();
      const oscHigh1 = ctx.createOscillator();
      const oscHigh2 = ctx.createOscillator();
      const gain = ctx.createGain();

      // Low freq thud
      oscSub.type = 'triangle';
      oscSub.frequency.setValueAtTime(75, now);
      oscSub.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      // High beeps
      oscHigh1.type = 'sine';
      oscHigh1.frequency.setValueAtTime(1600, now);
      oscHigh2.type = 'sine';
      oscHigh2.frequency.setValueAtTime(2400, now);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

      oscSub.connect(gain);
      oscHigh1.connect(gain);
      oscHigh2.connect(gain);
      gain.connect(ctx.destination);

      oscSub.start(now);
      oscHigh1.start(now);
      oscHigh2.start(now);
      
      oscSub.stop(now + 0.09);
      oscHigh1.stop(now + 0.025);
      oscHigh2.stop(now + 0.025);

      // Clean transient click
      playNoise(ctx, now, 0.015, 'highpass', 4000, 1.5, 0.01);

    } else if (type === 'transition') {
      // Low static LFO telemetry sweep
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(24, now); // 24Hz speed

      lfoGain.gain.setValueAtTime(30, now); // pitch flutter depth

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(7, now);
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.3);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 0.32);
      osc.stop(now + 0.32);

      // Sweep resonant bandpass noise
      playNoise(ctx, now, 0.3, 'bandpass', 1500, 5, 0.015);

    } else if (type === 'panel') {
      // High-tech slide/whoosh pneumatic feedback
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.5, now);
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.15);

      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);

      // Slide noise sweep
      playNoise(ctx, now, 0.15, 'bandpass', 1000, 3, 0.008);

    } else if (type === 'chime') {
      // High-tech alert or bookmark sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1200, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1800, now + 0.04); // Perfect fifth ratio

      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.04);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    }
  } catch (error) {
    console.warn('Tactical SFX failed to play:', error);
  }
}

// Global Event Listeners setup for automatic hover and click coverage
if (typeof window !== 'undefined' && !(window as any).__MTRH_AUDIO_LISTENERS_INITIALIZED__) {
  (window as any).__MTRH_AUDIO_LISTENERS_INITIALIZED__ = true;

  let lastHoveredEl: HTMLElement | null = null;

  // Global mouseover listener for techy button hover audio
  window.addEventListener('mouseover', (e) => {
    try {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find closest interactive element
      const interactiveEl = target.closest(
        'button, a, [role="button"], [data-sfx], .cursor-pointer, input[type="submit"], input[type="button"], .mapboxgl-marker, .map-pin'
      ) as HTMLElement | null;

      if (!interactiveEl) {
        lastHoveredEl = null;
        return;
      }

      // Avoid double triggers if moving within the same interactive node
      if (interactiveEl === lastHoveredEl) return;
      lastHoveredEl = interactiveEl;

      // Determine major vs minor hover sound
      const isMajor =
        interactiveEl.getAttribute('data-sfx') === 'major' ||
        interactiveEl.classList.contains('nav-btn') ||
        (interactiveEl.innerText &&
          /^(MAP|TIMELINE|CODEX|CARTOGRAPHY|ABOUT|CLOSE|SUBMIT|PLAY|FILTER)$/i.test(
            interactiveEl.innerText.trim()
          ));

      playAudio(isMajor ? 'hover_major' : 'hover');
    } catch (err) {
      // Silent catch to prevent interference with user flows
    }
  });

  // Global click listener for app-wide tactile button click audio
  window.addEventListener('click', (e) => {
    try {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, [role="button"], [data-sfx], .cursor-pointer, input[type="submit"], input[type="button"], .mapboxgl-marker, .map-pin'
      ) as HTMLElement | null;

      if (!interactiveEl) return;

      // Determine major vs minor click sound
      const isMajor =
        interactiveEl.getAttribute('data-sfx') === 'major' ||
        interactiveEl.classList.contains('nav-btn') ||
        (interactiveEl.innerText &&
          /^(MAP|TIMELINE|CODEX|CARTOGRAPHY|ABOUT|CLOSE|SUBMIT|PLAY|FILTER)$/i.test(
            interactiveEl.innerText.trim()
          ));

      playAudio(isMajor ? 'click_major' : 'click');
    } catch (err) {
      // Silent catch
    }
  }, true); // Use capture phase to ensure it triggers before event stopPropagation inside pages
}
