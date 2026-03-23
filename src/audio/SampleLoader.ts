import type { DrumKit } from "@/types/beat.types";

export class SampleLoader {
  private ctx: AudioContext;
  private cache = new Map<string, AudioBuffer>();

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  async loadKit(kit: DrumKit): Promise<{ buffers: Map<string, AudioBuffer>; fallback: boolean }> {
    const buffers = new Map<string, AudioBuffer>();
    let fallback = false;

    await Promise.all(
      Object.entries(kit.samples).map(async ([key, file]) => {
        try {
          const buffer = await this.loadSample(file);
          buffers.set(key, buffer);
        } catch {
          fallback = true;
        }
      })
    );

    return { buffers, fallback };
  }

  private async loadSample(path: string) {
    const existing = this.cache.get(path);
    if (existing) return existing;

    // DEV: Place developer-provided WAV files under src/assets/drums/{kit_name}/ and keep names aligned with kit.samples.
    const url = this.resolveAsset(path);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Missing sample ${path}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = await this.ctx.decodeAudioData(arrayBuffer.slice(0));
    this.cache.set(path, buffer);
    return buffer;
  }

  private resolveAsset(path: string) {
    if (path.startsWith("http")) return path;
    const trimmed = path.startsWith("/") ? path.slice(1) : path;
    try {
      return chrome.runtime.getURL(trimmed);
    } catch {
      return path;
    }
  }
}
