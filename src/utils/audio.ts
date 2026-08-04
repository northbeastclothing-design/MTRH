// Web Audio API High-Tech Tactical UI Sound Effects (SFX) Synthesizer and Player
let audioCtx: AudioContext | null = null;
let bgMusicNode: AudioBufferSourceNode | null = null;
let bgMusicGainNode: GainNode | null = null;
const BG_MUSIC_PATH = '/sfx/background-music-freesound_community-natural-armonics-at-136-25159.mp3';

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      startBackgroundMusic(audioCtx!);
    }).catch(() => {});
  } else if (audioCtx && audioCtx.state === 'running') {
    startBackgroundMusic(audioCtx);
  }
  return audioCtx;
}

function startBackgroundMusic(ctx: AudioContext) {
  if (bgMusicNode) return;

  const buffer = audioBufferCache[BG_MUSIC_PATH];
  if (buffer) {
    playBgBuffer(ctx, buffer);
  } else {
    loadAudioFile(ctx, BG_MUSIC_PATH).then(buf => {
      playBgBuffer(ctx, buf);
    }).catch(err => {
      console.warn("Could not start background music:", err);
    });
  }
}

function playBgBuffer(ctx: AudioContext, buffer: AudioBuffer) {
  if (bgMusicNode) return;

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gainNode = ctx.createGain();
  // Low background volume (0.02) so UI SFX remain prominent
  gainNode.gain.setValueAtTime(0.02, ctx.currentTime);

  source.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start(0);

  bgMusicNode = source;
  bgMusicGainNode = gainNode;
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

const SFX_PATHS: Record<SFXType, string> = {
  hover: '/sfx/btn-hover-lesiakower-minimalist-button-hover-sound-effect-399749.mp3',
  hover_major: '/sfx/btn-hover-lesiakower-minimalist-button-hover-sound-effect-399749.mp3',
  click: '/sfx/btn-click-universfield-interface-124464.mp3',
  click_major: '/sfx/btn-click-universfield-interface-124464.mp3',
  pin_click: '/sfx/map-btn-click-universfield-ui-interface-03-277552.mp3',
  transition: '/sfx/transition-glitch-soul_serenity_sounds-futuristic-noises-236386.mp3',
  panel: '',
  chime: ''
};

// Cache of decoded AudioBuffers to prevent redundant fetching/decoding
const audioBufferCache: Record<string, AudioBuffer> = {};

// Helper to load and decode an audio asset
async function loadAudioFile(ctx: AudioContext, path: string): Promise<AudioBuffer> {
  if (audioBufferCache[path]) {
    return audioBufferCache[path];
  }
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio file from ${path}: status ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  audioBufferCache[path] = audioBuffer;
  return audioBuffer;
}

// Preload all MP3 files
if (typeof window !== 'undefined') {
  const preloadAllSFX = async () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const pathsToPreload = [
        SFX_PATHS.hover,
        SFX_PATHS.click,
        SFX_PATHS.pin_click,
        SFX_PATHS.transition,
        BG_MUSIC_PATH
      ];

      for (const path of pathsToPreload) {
        if (path) {
          loadAudioFile(ctx, path).catch((err) => {
            console.warn(`Could not preload audio asset ${path}:`, err);
          });
        }
      }
    } catch (e) {
      console.warn("Preloading SFX failed:", e);
    }
  };

  if (document.readyState === 'complete') {
    preloadAllSFX();
  } else {
    window.addEventListener('load', preloadAllSFX);
  }
}

/**
 * Play dynamic techy/digital sound effects
 */
export function playAudio(type: SFXType) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (required by browsers on first interaction)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // If it's a file-backed sound
    const path = SFX_PATHS[type];
    if (path) {
      const buffer = audioBufferCache[path];
      if (buffer) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        // Custom adjustments based on SFX type
        if (type === 'hover_major') {
          source.playbackRate.value = 1.15; // slightly higher pitch
        } else if (type === 'click_major') {
          source.playbackRate.value = 0.85; // heavier, lower pitch
        }
        
        // Create gain node for volume adjustments
        const gainNode = ctx.createGain();
        let volume = 1.0;
        if (type === 'click' || type === 'click_major' || type === 'pin_click') {
          volume = 0.5; // lower click volume by 50%
        }
        gainNode.gain.setValueAtTime(volume, now);
        
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      } else {
        // Fallback: try to fetch and play it asynchronously
        loadAudioFile(ctx, path).then(buf => {
          const source = ctx.createBufferSource();
          source.buffer = buf;
          if (type === 'hover_major') {
            source.playbackRate.value = 1.15;
          } else if (type === 'click_major') {
            source.playbackRate.value = 0.85;
          }
          
          const gainNode = ctx.createGain();
          let volume = 1.0;
          if (type === 'click' || type === 'click_major' || type === 'pin_click') {
            volume = 0.5;
          }
          gainNode.gain.setValueAtTime(volume, ctx.currentTime);
          
          source.connect(gainNode);
          gainNode.connect(ctx.destination);
          source.start(0);
        }).catch(err => {
          console.warn("Async SFX play failed:", err);
        });
        return;
      }
    }

    // Fallbacks for custom synthesizers
    if (type === 'panel') {
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

      playNoise(ctx, now, 0.15, 'bandpass', 1000, 3, 0.008);

    } else if (type === 'chime') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1200, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1800, now + 0.04);

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

      // Find closest interactive element using standard selector
      let interactiveEl = target.closest(
        'button, a, [role="button"], [data-sfx], .cursor-pointer, input[type="submit"], input[type="button"], .mapboxgl-marker, .map-pin'
      ) as HTMLElement | null;

      // Fallback: search up the DOM tree to find the outermost ancestor that has cursor: pointer style.
      // We search for the outermost ancestor to correctly handle CSS cursor inheritance on nested elements.
      if (!interactiveEl) {
        let curr: HTMLElement | null = target;
        let highestPointerEl: HTMLElement | null = null;
        while (curr && curr !== document.body) {
          const style = window.getComputedStyle(curr);
          if (style.cursor === 'pointer') {
            highestPointerEl = curr;
          } else {
            if (highestPointerEl) break;
          }
          curr = curr.parentElement;
        }
        if (highestPointerEl) {
          interactiveEl = highestPointerEl;
        }
      }

      if (!interactiveEl) {
        lastHoveredEl = null;
        return;
      }

      // Avoid double triggers if moving within the same interactive node or its nested children
      if (interactiveEl === lastHoveredEl) return;
      if (lastHoveredEl && (lastHoveredEl.contains(interactiveEl) || interactiveEl.contains(lastHoveredEl))) {
        lastHoveredEl = interactiveEl;
        return;
      }
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

      // Fallback: search up the DOM tree to find the outermost ancestor that has cursor: pointer style
      if (!interactiveEl) {
        let curr: HTMLElement | null = target;
        let highestPointerEl: HTMLElement | null = null;
        while (curr && curr !== document.body) {
          const style = window.getComputedStyle(curr);
          if (style.cursor === 'pointer') {
            highestPointerEl = curr;
          } else {
            if (highestPointerEl) break;
          }
          curr = curr.parentElement;
        }
        if (highestPointerEl) {
          interactiveEl = highestPointerEl;
        }
      }

      if (!interactiveEl) return;

      // Skip click sound entirely for nav clicks, as they trigger page transitions which play transition audio
      const isNavClick =
        interactiveEl.classList.contains('nav-btn') ||
        (interactiveEl.innerText &&
          /^(MAP|TIMELINE|CODEX|CARTOGRAPHY)$/i.test(interactiveEl.innerText.trim()));

      if (isNavClick) return;

      // Determine major vs minor click sound
      const isMajor =
        interactiveEl.getAttribute('data-sfx') === 'major' ||
        (interactiveEl.innerText &&
          /^(ABOUT|CLOSE|SUBMIT|PLAY|FILTER)$/i.test(
            interactiveEl.innerText.trim()
          ));

      playAudio(isMajor ? 'click_major' : 'click');
    } catch (err) {
      // Silent catch
    }
  }, true); // Use capture phase to ensure it triggers before event stopPropagation inside pages
}
