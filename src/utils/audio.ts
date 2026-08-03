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

export type SFXType = 'hover' | 'hover_major' | 'click' | 'click_major' | 'transition' | 'panel' | 'chime' | 'pin_click';

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
      // Futuristic digital/sci-fi glitch whoosh (inspired by futuristic noises 236386)
      const duration = 0.35; // 350ms total
      
      // 1. Stuttering Glitch Carrier
      const carrier = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const carrierGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(650, now);
      carrier.frequency.exponentialRampToValueAtTime(120, now + duration - 0.05);

      modulator.type = 'square';
      modulator.frequency.setValueAtTime(55, now); // Stutter rate 55Hz
      modulator.frequency.linearRampToValueAtTime(30, now + duration);

      modGain.gain.setValueAtTime(250, now); // FM depth
      modGain.gain.exponentialRampToValueAtTime(80, now + duration);

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.5, now);
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + duration);

      carrierGain.gain.setValueAtTime(0.015, now);
      carrierGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(filter);
      filter.connect(carrierGain);
      carrierGain.connect(ctx.destination);

      modulator.start(now);
      carrier.start(now);
      modulator.stop(now + duration);
      carrier.stop(now + duration);

      // 2. High-Tech Cyber Chirp Header (staggered micro-ticks)
      const chirpFreqs = [3200, 4000, 4800];
      chirpFreqs.forEach((freq, idx) => {
        const time = now + idx * 0.015;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.008, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.015);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.018);
      });

      // 3. Stuttering White Noise Burst
      // We will play 5 short noise bursts to create a texturized digital static "crackle"
      const burstCount = 5;
      const burstDuration = 0.03;
      const burstSpacing = 0.06;
      for (let i = 0; i < burstCount; i++) {
        const time = now + i * burstSpacing;
        const noiseFreq = 3000 - i * 500;
        playNoise(ctx, time, burstDuration, 'bandpass', noiseFreq, 4, 0.008);
      }

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

    } else if (type === 'pin_click') {
      // Resonant, glassy AI system confirmation chime (inspired by ui-ai-system-notification-537631)
      const duration = 0.35;
      const chimeGain = ctx.createGain();
      chimeGain.gain.setValueAtTime(0.015, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      chimeGain.connect(ctx.destination);

      // Glassy Triad: B5 (987.77Hz), E6 (1318.51Hz), B6 (1975.53Hz)
      const notes = [
        { freq: 987.77, delay: 0.0 },
        { freq: 1318.51, delay: 0.03 },
        { freq: 1975.53, delay: 0.06 }
      ];

      notes.forEach((note) => {
        const time = now + note.delay;
        const osc = ctx.createOscillator();
        const localGain = ctx.createGain();

        osc.type = 'sine';
        
        // Pitch attack sweep for digital feel
        osc.frequency.setValueAtTime(note.freq * 1.3, time);
        osc.frequency.exponentialRampToValueAtTime(note.freq, time + 0.02);

        localGain.gain.setValueAtTime(1.0, time);
        localGain.gain.exponentialRampToValueAtTime(0.0001, time + duration - note.delay);

        osc.connect(localGain);
        localGain.connect(chimeGain);

        osc.start(time);
        osc.stop(time + duration - note.delay + 0.01);
      });

      // Air strike transient (glassy hammer touch)
      playNoise(ctx, now, 0.02, 'bandpass', 2400, 3.5, 0.01);
      playNoise(ctx, now + 0.03, 0.015, 'bandpass', 3200, 4.0, 0.006);
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

      // Find closest interactive element using standard selector
      let interactiveEl = target.closest(
        'button, a, [role="button"], [data-sfx], .cursor-pointer, input[type="submit"], input[type="button"], .mapboxgl-marker, .map-pin'
      ) as HTMLElement | null;

      // Fallback: search up the DOM tree to see if any element has cursor: pointer style
      if (!interactiveEl) {
        let curr: HTMLElement | null = target;
        while (curr && curr !== document.body) {
          const style = window.getComputedStyle(curr);
          if (style.cursor === 'pointer') {
            interactiveEl = curr;
            break;
          }
          curr = curr.parentElement;
        }
      }

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

      let interactiveEl = target.closest(
        'button, a, [role="button"], [data-sfx], .cursor-pointer, input[type="submit"], input[type="button"], .mapboxgl-marker, .map-pin'
      ) as HTMLElement | null;

      // Fallback: search up the DOM tree to see if any element has cursor: pointer style
      if (!interactiveEl) {
        let curr: HTMLElement | null = target;
        while (curr && curr !== document.body) {
          const style = window.getComputedStyle(curr);
          if (style.cursor === 'pointer') {
            interactiveEl = curr;
            break;
          }
          curr = curr.parentElement;
        }
      }

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
