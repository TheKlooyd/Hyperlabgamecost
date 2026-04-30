/**
 * Sound effects using the Web Audio API — no external files needed.
 * All sounds are synthesized in real-time.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gainStart = 0.25,
  startTime?: number,
): void {
  try {
    const ctx = getCtx();
    const t = startTime ?? ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(gainStart, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  } catch {
    // Silently ignore if audio not supported
  }
}

/** Short click — generic buttons */
export function playClick(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    tone(900, 0.07, "square", 0.12, t);
  } catch { /* ignore */ }
}

/** Soft tap — selecting an option */
export function playSelect(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    tone(660, 0.09, "sine", 0.18, t);
  } catch { /* ignore */ }
}

/** Forward navigation whoosh */
export function playNavigate(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.12);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.start(t);
    osc.stop(t + 0.22);
  } catch { /* ignore */ }
}

/** App startup / Start button */
export function playStart(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Rising sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.45);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.setValueAtTime(0.3, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    osc.start(t);
    osc.stop(t + 0.6);
    // Harmony
    tone(440, 0.5, "sine", 0.1, t + 0.1);
  } catch { /* ignore */ }
}

/** Correct answer — ascending happy chime */
export function playCorrect(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // C5 - E5 - G5
    tone(523, 0.18, "sine", 0.28, t);
    tone(659, 0.18, "sine", 0.28, t + 0.14);
    tone(784, 0.35, "sine", 0.3, t + 0.28);
    // Soft shimmer on top
    tone(1568, 0.2, "sine", 0.08, t + 0.28);
  } catch { /* ignore */ }
}

/** Wrong answer — low error buzz */
export function playWrong(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    tone(280, 0.15, "sawtooth", 0.18, t);
    tone(200, 0.22, "sawtooth", 0.14, t + 0.15);
  } catch { /* ignore */ }
}

/** Stage unlock / achievement fanfare */
export function playUnlock(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // C5 - E5 - G5 - C6 fanfare
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      tone(freq, 0.22 + i * 0.04, "sine", 0.28, t + i * 0.11);
    });
    // Bass hit
    tone(130, 0.35, "sine", 0.25, t);
  } catch { /* ignore */ }
}

/** Quiz/activity complete — celebration */
export function playComplete(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const pattern = [523, 659, 784, 659, 1047];
    pattern.forEach((freq, i) => {
      tone(freq, i === 4 ? 0.45 : 0.12, "sine", 0.26, t + i * 0.1);
    });
    tone(261, 0.5, "sine", 0.12, t);
  } catch { /* ignore */ }
}

/** Back / cancel — subtle downward tick */
export function playBack(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch { /* ignore */ }
}
