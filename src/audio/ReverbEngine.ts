import type { ReverbType } from "@/types/beat.types";

interface ReverbChain {
  input: GainNode;
  dry: GainNode;
  wet: GainNode;
  convolver: ConvolverNode;
  output: GainNode;
  connected: boolean;
}

export class ReverbEngine {
  private ctx: AudioContext;
  private impulseCache = new Map<ReverbType, AudioBuffer>();
  private chains = new Map<string, ReverbChain>();

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  getOrCreateChain(trackId: string, type: ReverbType): ReverbChain | null {
    if (type === "none") return null;
    const existing = this.chains.get(trackId);
    if (existing) {
      existing.convolver.buffer = this.getImpulse(type);
      return existing;
    }

    const input = this.ctx.createGain();
    const dry = this.ctx.createGain();
    const wet = this.ctx.createGain();
    const convolver = this.ctx.createConvolver();
    const output = this.ctx.createGain();

    convolver.buffer = this.getImpulse(type);

    input.connect(dry);
    input.connect(convolver);
    convolver.connect(wet);
    dry.connect(output);
    wet.connect(output);

    const chain = { input, dry, wet, convolver, output, connected: false };
    this.chains.set(trackId, chain);
    return chain;
  }

  connect(chain: ReverbChain, destination: AudioNode) {
    if (chain.connected) return;
    chain.output.connect(destination);
    chain.connected = true;
  }

  setMix(trackId: string, type: ReverbType, amount: number, masterEnabled: boolean) {
    const chain = this.getOrCreateChain(trackId, type);
    if (!chain) return;
    const wetValue = masterEnabled ? Math.max(0, Math.min(1, amount / 100)) : 0;
    chain.convolver.buffer = this.getImpulse(type);
    chain.wet.gain.value = wetValue;
    chain.dry.gain.value = 1 - Math.min(0.92, wetValue);
  }

  private getImpulse(type: ReverbType) {
    const cached = this.impulseCache.get(type);
    if (cached) return cached;

    const sampleRate = this.ctx.sampleRate;
    const settings =
      type === "room"
        ? { duration: 0.8, decay: 2.1, preDelay: 0, metallic: 0.1 }
        : type === "hall"
          ? { duration: 2.5, decay: 3.8, preDelay: 0.02, metallic: 0.05 }
          : { duration: 1.5, decay: 2.8, preDelay: 0.005, metallic: 0.42 };

    const length = Math.floor(sampleRate * settings.duration);
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const preDelaySamples = Math.floor(settings.preDelay * sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i += 1) {
        if (i < preDelaySamples) {
          data[i] = 0;
          continue;
        }
        const t = (i - preDelaySamples) / (length - preDelaySamples || 1);
        const noise = Math.random() * 2 - 1;
        const moorerTap = Math.sin(i * (type === "plate" ? 0.035 : 0.015)) * settings.metallic;
        data[i] = (noise + moorerTap) * Math.pow(1 - t, settings.decay);
      }
    }

    this.impulseCache.set(type, impulse);
    return impulse;
  }
}
