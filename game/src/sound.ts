const cues = {
  move: [330],
  tap: [392],
  interact: [587, 880],
  ready: [523, 659],
  correct: [523, 659],
  retry: [440, 392],
  badge: [523, 659, 784],
  victory: [659, 784, 1047, 988, 1319],
  finish: [523, 659, 784, 1047],
};

export class GameSound {
  private context?: AudioContext;
  private output?: GainNode;

  stop() {
    this.output?.disconnect();
    this.output = undefined;
  }

  async play(cue: keyof typeof cues) {
    this.stop();
    try {
      const context = this.context ??= new AudioContext();
      const output = context.createGain();
      this.output = output;
      output.connect(context.destination);

      if (context.state !== 'running') await context.resume();
      if (this.output !== output) return;

      const start = context.currentTime;
      cues[cue].forEach((frequency, index) => {
        const time = start + index * 0.105;
        const note = context.createOscillator();
        const envelope = context.createGain();
        note.type = 'sine';
        note.frequency.value = frequency;
        envelope.gain.setValueAtTime(0, time);
        envelope.gain.linearRampToValueAtTime(0.055, time + 0.025);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.17);
        note.connect(envelope);
        envelope.connect(output);
        note.onended = () => envelope.disconnect();
        note.start(time);
        note.stop(time + 0.18);
      });
    } catch {
      // Sound is optional when the browser blocks or lacks audio playback.
    }
  }
}
