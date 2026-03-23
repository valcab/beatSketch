import { useBeatStore } from "@/store/beatStore";
import type { DrumTrack } from "@/types/beat.types";
import { ReverbEngine } from "./ReverbEngine";
import { SampleLoader } from "./SampleLoader";

const LOOKAHEAD = 25.0;
const SCHEDULE_AHEAD = 0.1;

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private reverbEngine: ReverbEngine | null = null;
  private sampleLoader: SampleLoader | null = null;
  private sampleBuffers = new Map<string, AudioBuffer>();
  private lookaheadTimer: number | null = null;
  private nextNoteTime = 0;
  private stepIndex = 0;
  private currentKitName = "";
  private fallbackMode = false;

  async initFromGesture() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = useBeatStore.getState().masterVolume;
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.value = 15000;
      this.reverbEngine = new ReverbEngine(this.ctx);
      this.sampleLoader = new SampleLoader(this.ctx);
      this.filter.connect(this.master);
      this.master.connect(this.ctx.destination);
    }

    if (this.ctx.state !== "running") {
      await this.ctx.resume();
    }

    useBeatStore.getState().setAudioReady(true);
    await this.ensureKitLoaded();
    return this.ctx;
  }

  async ensureKitLoaded() {
    const state = useBeatStore.getState();
    if (!this.ctx || !this.sampleLoader) return;
    if (state.kit.name === this.currentKitName && this.sampleBuffers.size > 0) return;

    const { buffers, fallback } = await this.sampleLoader.loadKit(state.kit);
    this.sampleBuffers = buffers;
    this.currentKitName = state.kit.name;
    this.fallbackMode = fallback || buffers.size === 0;
    state.setFallbackMode(this.fallbackMode);
  }

  async start() {
    await this.initFromGesture();
    const state = useBeatStore.getState();
    if (!this.ctx) return;

    state.setPlaying(true);
    this.stepIndex = state.currentStep;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.scheduler();
  }

  stop() {
    if (this.lookaheadTimer) {
      window.clearTimeout(this.lookaheadTimer);
      this.lookaheadTimer = null;
    }
    this.stepIndex = 0;
    this.nextNoteTime = 0;
    useBeatStore.getState().setPlaying(false);
    useBeatStore.getState().setCurrentStep(0);
  }

  setMasterVolume(value: number) {
    if (this.master && this.ctx) {
      this.master.gain.setValueAtTime(value, this.ctx.currentTime);
    }
  }

  private scheduler = () => {
    if (!this.ctx) return;
    while (this.nextNoteTime < this.ctx.currentTime + SCHEDULE_AHEAD) {
      this.scheduleStep(this.stepIndex, this.nextNoteTime);
      this.advanceStep();
    }
    this.lookaheadTimer = window.setTimeout(this.scheduler, LOOKAHEAD);
  };

  private advanceStep() {
    const state = useBeatStore.getState();
    const secondsPerBeat = 60 / state.bpm;
    const stepDuration = secondsPerBeat / 4;
    this.stepIndex = (this.stepIndex + 1) % state.steps;
    this.nextNoteTime += stepDuration;
    window.setTimeout(() => useBeatStore.getState().setCurrentStep(this.stepIndex), 0);
  }

  private scheduleStep(step: number, time: number) {
    const state = useBeatStore.getState();
    const soloTracks = state.tracks.filter((track) => track.solo);
    const activeTracks = state.tracks.filter((track) => {
      if (soloTracks.length > 0) return track.solo;
      return !track.mute;
    });

    const swingOffset =
      step % 2 === 1 ? (state.swing / 100) * (60 / state.bpm / 2) * 0.5 : 0;
    const when = time + swingOffset;

    activeTracks.forEach((track) => {
      if (!track.steps[step]) return;
      this.playTrack(track, when, track.velocity[step] ?? 0.7);
    });
  }

  private playTrack(track: DrumTrack, when: number, velocity: number) {
    if (!this.ctx || !this.master || !this.filter || !this.reverbEngine) return;
    const amp = this.ctx.createGain();
    amp.gain.setValueAtTime(Math.max(0.05, velocity * track.volume), when);

    const sourceChain = this.createSoundSource(track.key, when, velocity);
    if (track.reverbAvailable && track.reverbType !== "none") {
      const chain = this.reverbEngine.getOrCreateChain(track.id, track.reverbType);
      if (chain) {
        this.reverbEngine.setMix(track.id, track.reverbType, track.reverb, useBeatStore.getState().reverbMasterEnabled);
        this.reverbEngine.connect(chain, this.filter);
        sourceChain.output.connect(amp);
        amp.connect(chain.input);
        sourceChain.start(when);
        return;
      }
    }

    sourceChain.output.connect(amp);
    amp.connect(this.filter);
    sourceChain.start(when);
  }

  private createSoundSource(key: string, _when: number, velocity: number) {
    const buffer = this.sampleBuffers.get(key);
    if (buffer && this.ctx) {
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      return {
        output: source,
        start: (time: number) => source.start(time)
      };
    }

    this.fallbackMode = true;
    useBeatStore.getState().setFallbackMode(true);
    return this.createFallbackVoice(key, velocity);
  }

  private createFallbackVoice(key: string, velocity: number) {
    const ctx = this.ctx!;
    const oscillator = ctx.createOscillator();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noise.length; index += 1) noise[index] = Math.random() * 2 - 1;

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(Math.max(0.05, velocity * 0.75), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    const pitchMap: Record<string, { freq: number; type: OscillatorType; filter: number }> = {
      kick: { freq: 68, type: "sine", filter: 120 },
      snare: { freq: 190, type: "triangle", filter: 1800 },
      hihat_closed: { freq: 4200, type: "square", filter: 6000 },
      hihat_open: { freq: 3800, type: "square", filter: 4800 },
      crash: { freq: 3100, type: "sawtooth", filter: 3400 },
      ride: { freq: 2600, type: "triangle", filter: 2800 },
      tom_low: { freq: 130, type: "sine", filter: 280 },
      tom_mid: { freq: 170, type: "sine", filter: 380 }
    };
    const voice = pitchMap[key] ?? pitchMap.snare;
    oscillator.type = voice.type;
    filter.frequency.value = voice.filter;

    oscillator.connect(gain);
    noiseSource.connect(filter);
    filter.connect(gain);

    return {
      output: gain,
      start: (time: number) => {
        gain.gain.cancelScheduledValues(time);
        gain.gain.setValueAtTime(Math.max(0.05, velocity * 0.75), time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
        oscillator.frequency.setValueAtTime(voice.freq, time);
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(50, voice.freq * 0.72), time + 0.12);
        oscillator.start(time);
        noiseSource.start(time);
        oscillator.stop(time + 0.2);
        noiseSource.stop(time + 0.2);
      }
    };
  }
}

export const audioEngine = new AudioEngine();
