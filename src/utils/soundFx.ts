// ==========================================
// MOTOR DE AUDIO SINTETIZADO (8-BIT WEB AUDIO)
// Cero dependencias externas de archivos de audio
// ==========================================

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Blip corto para selección y drag
   */
  public playBlip(freq = 660, duration = 0.05) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio suppression fallback
    }
  }

  /**
   * Tono de acierto: Arpegio ascendente estilo GameBoy / NES
   */
  public playSuccess() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      const noteDuration = 0.08;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * noteDuration);

        gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * noteDuration);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx + 1) * noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * noteDuration);
        osc.stop(ctx.currentTime + (idx + 1) * noteDuration);
      });
    } catch {
      // Audio suppression fallback
    }
  }

  /**
   * Tono de error: Chispas y zumbido descendente
   */
  public playError() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(45, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio suppression fallback
    }
  }

  /**
   * Fanfarria de victoria y certificación
   */
  public playFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const melody = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.50, d: 0.35 } // C6
      ];

      let elapsed = 0;
      melody.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, ctx.currentTime + elapsed);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + elapsed);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + elapsed + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + elapsed);
        osc.stop(ctx.currentTime + elapsed + item.d);

        elapsed += item.d * 0.9;
      });
    } catch {
      // Audio suppression fallback
    }
  }
}

export const soundFx = new RetroSoundEngine();

