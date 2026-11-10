import {ambience} from './dialogue';

const cues = {
  ready: [523, 659],
  correct: [523, 659],
  retry: [440, 392],
  badge: [523, 659, 784],
  finish: [523, 659, 784, 1047],
};

export class GameSound {
  private context?: AudioContext;
  private output?: GainNode;
  private clips = new Map<string, Promise<AudioBuffer>>();

  stop() {
    this.output?.disconnect();
    this.output = undefined;
  }

  async play(cue: keyof typeof cues, voice?: string) {
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

      if (voice) {
        const [speech, chatter] = await Promise.all([
          this.decode(context, voice),
          this.decode(context, ambience),
        ]);
        if (this.output !== output) return;

        const sceneStart = Math.max(context.currentTime, start + cues[cue].length * .105 + .08);
        for (const [buffer, volume] of [[chatter, .18], [speech, .62]] as const) {
          const source = context.createBufferSource();
          const level = context.createGain();
          source.buffer = buffer;
          level.gain.value = volume;
          source.connect(level);
          level.connect(output);
          source.onended = () => level.disconnect();
          source.start(sceneStart);
        }
      }
    } catch {
      // Sound is optional when the browser blocks or lacks audio playback.
    }
  }

  private decode(context: AudioContext, url: string) {
    let clip = this.clips.get(url);
    if (!clip) {
      clip = fetch(url)
        .then(response => response.arrayBuffer())
        .then(bytes => context.decodeAudioData(bytes));
      this.clips.set(url, clip);
    }
    return clip;
  }
}
