const cueDefinitions = {
  find: { tones: [[440, 660, 0.12]], duration: 0.12, travel: 18 },
  miss: { tones: [[160, 160, 0.07]], duration: 0.07, travel: 10 },
  complete: { tones: [[392, 392, 0.12], [523, 523, 0.12], [659, 659, 0.12]], duration: 0.36, travel: 24 },
};

function browserAudioContextFactory() {
  const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
  return AudioContext ? () => new AudioContext() : null;
}

export function particleFeedbackMode(motion) {
  return motion?.travel === 0 ? 'opacity' : 'burst';
}

export function createFeedbackCleanup(timers = globalThis) {
  const owners = new Map();
  function replace(owner, key, action, delay) {
    const jobs = owners.get(owner) || new Map();
    const previous = jobs.get(key);
    if (previous !== undefined) timers.clearTimeout(previous);
    const handle = timers.setTimeout(() => {
      jobs.delete(key);
      if (!jobs.size) owners.delete(owner);
      action();
    }, delay);
    jobs.set(key, handle);
    owners.set(owner, jobs);
  }
  function clear(owner, key) {
    const jobs = owners.get(owner), handle = jobs?.get(key);
    if (handle === undefined) return;
    timers.clearTimeout(handle);
    jobs.delete(key);
    if (!jobs.size) owners.delete(owner);
  }
  function dispose() {
    for (const jobs of owners.values()) for (const handle of jobs.values()) timers.clearTimeout(handle);
    owners.clear();
  }
  return { replace, clear, dispose };
}

export function reconfigureEffects(previous, options, factory = createEffects) {
  void previous?.dispose?.();
  return factory(options);
}

export function createEffectsLifecycle({ save, dispose, rebuild }) {
  return {
    async pagehide() { save?.(); await dispose?.(); },
    pageshow() { rebuild?.(); },
  };
}

export function createCompletionPresenter({ delay = 550, timers = globalThis, isComplete, isPanelOpen, present }) {
  let timer, pending = false, presented = false;
  function attempt() {
    timer = undefined;
    if (presented || !isComplete()) { pending = false; return; }
    if (isPanelOpen()) { pending = true; return; }
    pending = false;
    presented = true;
    present();
  }
  return {
    schedule() { if (!presented && timer === undefined) timer = timers.setTimeout(attempt, delay); },
    panelClosed() { if (pending) attempt(); },
    cancel() { if (timer !== undefined) timers.clearTimeout(timer); timer = undefined; pending = false; presented = false; },
  };
}

export function createEffects({ sound = true, motion = 'system', prefersReducedMotion = false, audioContextFactory = browserAudioContextFactory() } = {}) {
  const reduced = motion === 'reduced' || Boolean(prefersReducedMotion);
  let context = null;
  let unlocked = false;
  let disposed = false;
  let cueUntil = 0;

  function motionFor(name) {
    const cue = cueDefinitions[name];
    return { duration: reduced ? 0 : Math.round(cue.duration * 1000), travel: reduced ? 0 : cue.travel };
  }

  function playTone(start, frequency, endFrequency, duration) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency !== frequency) oscillator.frequency.linearRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.12, start + Math.min(0.01, duration / 2));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  function play(name) {
    const result = motionFor(name);
    if (!sound || !unlocked || !context || disposed || context.state === 'closed') return result;
    const now = context.currentTime;
    if (now < cueUntil) return result;
    const cue = cueDefinitions[name];
    let offset = 0;
    for (const [frequency, endFrequency, duration] of cue.tones) {
      playTone(now + offset, frequency, endFrequency, duration);
      offset += duration;
    }
    cueUntil = now + cue.duration;
    return result;
  }

  return {
    async unlockAudio() {
      if (disposed || !sound || unlocked || !audioContextFactory) return;
      try { context = audioContextFactory(); } catch { return; }
      if (!context) return;
      unlocked = true;
      if (context.state === 'suspended') await context.resume();
    },
    playFind() { return play('find'); },
    playMiss() { return play('miss'); },
    playComplete() { return play('complete'); },
    async dispose() {
      disposed = true;
      if (context && context.state !== 'closed') await context.close();
      context = null;
    },
  };
}
