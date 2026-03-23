import JSZip from "jszip";
import localforage from "localforage";
import { z } from "zod";
import { buildSavedBeat } from "@/store/beatStore";
import type { SavedBeat } from "@/types/beat.types";

const savedBeatSchema = z.object({
  id: z.string(),
  name: z.string(),
  bpm: z.number(),
  swing: z.number(),
  steps: z.union([z.literal(8), z.literal(16), z.literal(32)]),
  tracks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      key: z.string(),
      color: z.string(),
      steps: z.array(z.boolean()),
      velocity: z.array(z.number()),
      mute: z.boolean(),
      solo: z.boolean(),
      volume: z.number(),
      reverb: z.number(),
      reverbType: z.union([z.literal("room"), z.literal("hall"), z.literal("plate"), z.literal("none")]),
      reverbAvailable: z.boolean()
    })
  ),
  patternA: z.any(),
  patternB: z.any(),
  kit: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const beatsStore = localforage.createInstance({
  name: "BeatSketch",
  storeName: "beats"
});

const FALLBACK_KEY = "beatsketch:saved";
const MAX_SLOTS = 50;

export async function listSavedBeats(): Promise<SavedBeat[]> {
  try {
    const items: SavedBeat[] = [];
    await beatsStore.iterate<SavedBeat, void>((value) => {
      items.push(value);
    });
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    const result = await chrome.storage.local.get(FALLBACK_KEY);
    return (result[FALLBACK_KEY] ?? []) as SavedBeat[];
  }
}

export async function saveCurrentBeat(): Promise<{ beat: SavedBeat; overLimit: boolean }> {
  const beat = buildSavedBeat();
  const existing = await listSavedBeats();
  const overLimit = existing.length >= MAX_SLOTS;
  const next = [beat, ...existing.filter((item) => item.id !== beat.id)].slice(0, MAX_SLOTS);

  try {
    await beatsStore.setItem(beat.id, beat);
  } catch {
    await chrome.storage.local.set({ [FALLBACK_KEY]: next });
  }

  return { beat, overLimit };
}

export async function removeSavedBeat(id: string) {
  try {
    await beatsStore.removeItem(id);
  } catch {
    const next = (await listSavedBeats()).filter((item) => item.id !== id);
    await chrome.storage.local.set({ [FALLBACK_KEY]: next });
  }
}

export async function exportCurrentBeat() {
  const beat = buildSavedBeat();
  const zip = new JSZip();
  zip.file("beat.json", JSON.stringify(beat, null, 2));
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${beat.name.replace(/\s+/g, "_").toLowerCase() || "beat"}.beatsketch`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importBeatFile(file: File) {
  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const json = await zip.file("beat.json")?.async("string");
  if (!json) throw new Error("Missing beat.json in archive");
  const parsed = savedBeatSchema.parse(JSON.parse(json)) as SavedBeat;
  return parsed;
}
