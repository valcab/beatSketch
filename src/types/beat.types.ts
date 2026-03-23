export type StepCount = 8 | 16 | 32;
export type PatternSlot = "A" | "B";
export type ReverbType = "room" | "hall" | "plate" | "none";
export type VelocityLevel = "pp" | "mp" | "mf" | "ff";

export interface DrumTrack {
  id: string;
  name: string;
  key: string;
  color: string;
  steps: boolean[];
  velocity: number[];
  mute: boolean;
  solo: boolean;
  volume: number;
  reverb: number;
  reverbType: ReverbType;
  reverbAvailable: boolean;
}

export interface Pattern {
  id: PatternSlot;
  name: string;
  tracks: DrumTrack[];
}

export interface DrumKit {
  name: string;
  label: string;
  samples: Record<string, string>;
}

export interface SavedBeat {
  id: string;
  name: string;
  bpm: number;
  swing: number;
  steps: StepCount;
  tracks: DrumTrack[];
  patternA: Pattern;
  patternB: Pattern;
  kit: string;
  createdAt: string;
  updatedAt: string;
}

export interface BeatState {
  beatName: string;
  bpm: number;
  swing: number;
  steps: StepCount;
  isPlaying: boolean;
  currentStep: number;
  tracks: DrumTrack[];
  kit: DrumKit;
  masterVolume: number;
  pattern: Pattern;
  patterns: Pattern[];
  activePattern: PatternSlot;
  queuedPattern: PatternSlot | null;
  reverbMasterEnabled: boolean;
  reverbMasterAmount: number;
  selectedTrackId: string;
  audioReady: boolean;
  fallbackMode: boolean;
}
