import { create } from "zustand";
import type { BeatState, DrumKit, DrumTrack, Pattern, PatternSlot, ReverbType, SavedBeat, StepCount } from "@/types/beat.types";
import { clonePattern } from "@/presets/rockPresets";
import { ROCK_PRESETS } from "@/presets/rockPresets";

const TRACK_DEFS = [
  { id: "track-kick", key: "kick", name: "Kick", color: "bg-orange-500", reverbAvailable: false, reverbType: "none" as ReverbType },
  { id: "track-snare", key: "snare", name: "Snare", color: "bg-blue-500", reverbAvailable: true, reverbType: "plate" as ReverbType },
  { id: "track-hhc", key: "hihat_closed", name: "Hi-Hat ferme", color: "bg-yellow-400", reverbAvailable: false, reverbType: "none" as ReverbType },
  { id: "track-hho", key: "hihat_open", name: "Hi-Hat ouvert", color: "bg-yellow-600", reverbAvailable: true, reverbType: "room" as ReverbType },
  { id: "track-crash", key: "crash", name: "Crash", color: "bg-purple-500", reverbAvailable: true, reverbType: "hall" as ReverbType },
  { id: "track-ride", key: "ride", name: "Ride", color: "bg-purple-400", reverbAvailable: true, reverbType: "room" as ReverbType },
  { id: "track-tom-low", key: "tom_low", name: "Tom bas", color: "bg-red-500", reverbAvailable: true, reverbType: "room" as ReverbType },
  { id: "track-tom-mid", key: "tom_mid", name: "Tom medium", color: "bg-red-400", reverbAvailable: true, reverbType: "room" as ReverbType }
];

export const KITS: DrumKit[] = ["rock", "jazz", "acoustic", "electronic"].map((kitName) => ({
  name: kitName,
  label: kitName.charAt(0).toUpperCase() + kitName.slice(1),
  samples: {
    // DEV: Add kit WAV files under src/assets/drums/{kit_name}/ so Vite copies them to dist/assets/drums/.
    kick: `/assets/drums/${kitName}/kick.wav`,
    snare: `/assets/drums/${kitName}/snare.wav`,
    hihat_closed: `/assets/drums/${kitName}/hihat_closed.wav`,
    hihat_open: `/assets/drums/${kitName}/hihat_open.wav`,
    crash: `/assets/drums/${kitName}/crash.wav`,
    ride: `/assets/drums/${kitName}/ride.wav`,
    tom_low: `/assets/drums/${kitName}/tom_low.wav`,
    tom_mid: `/assets/drums/${kitName}/tom_mid.wav`
  }
}));

const createTrack = (steps: StepCount): DrumTrack[] =>
  TRACK_DEFS.map((track) => ({
    ...track,
    steps: Array.from({ length: steps }, () => false),
    velocity: Array.from({ length: steps }, () => 0.6),
    mute: false,
    solo: false,
    volume: 0.82,
    reverb: track.reverbAvailable ? 20 : 0
  }));

const createPattern = (slot: PatternSlot, steps: StepCount): Pattern => ({
  id: slot,
  name: `Pattern ${slot}`,
  tracks: createTrack(steps)
});

const createSeededPattern = (slot: PatternSlot, presetIndex = 0): Pattern => {
  const preset = ROCK_PRESETS[presetIndex] ?? ROCK_PRESETS[0];
  const base = createPattern(slot, preset.steps);
  return {
    ...base,
    tracks: preset.apply(base.tracks)
  };
};

interface BeatStore extends BeatState {
  setBeatName: (name: string) => void;
  setBpm: (bpm: number) => void;
  setSwing: (swing: number) => void;
  setSteps: (steps: StepCount) => void;
  setCurrentStep: (step: number) => void;
  setPlaying: (playing: boolean) => void;
  setMasterVolume: (value: number) => void;
  setKitByName: (kitName: string) => void;
  setAudioReady: (ready: boolean) => void;
  setFallbackMode: (value: boolean) => void;
  setSelectedTrackId: (trackId: string) => void;
  toggleStep: (trackId: string, index: number) => void;
  setVelocity: (trackId: string, index: number, velocity: number) => void;
  toggleMute: (trackId: string) => void;
  toggleSolo: (trackId: string) => void;
  setTrackVolume: (trackId: string, value: number) => void;
  setTrackReverb: (trackId: string, value: number) => void;
  setTrackReverbType: (trackId: string, reverbType: ReverbType) => void;
  setActivePattern: (pattern: PatternSlot) => void;
  copyPattern: (from: PatternSlot, to: PatternSlot) => void;
  applyPresetToPattern: (pattern: PatternSlot, presetName: string) => void;
  setReverbMasterEnabled: (value: boolean) => void;
  applyPresetTracks: (steps: StepCount, tracks: DrumTrack[]) => void;
  loadSavedBeat: (beat: SavedBeat) => void;
}

const syncPatternTracks = (patterns: Pattern[], activePattern: PatternSlot) => {
  const active = patterns.find((pattern) => pattern.id === activePattern) ?? patterns[0];
  return {
    patterns,
    pattern: clonePattern(active),
    tracks: clonePattern(active).tracks
  };
};

const updatePatterns = (patterns: Pattern[], activePattern: PatternSlot, tracks: DrumTrack[]) =>
  patterns.map((pattern) => (pattern.id === activePattern ? { ...pattern, tracks: tracks.map((track) => ({ ...track, steps: [...track.steps], velocity: [...track.velocity] })) } : pattern));

const initialPatterns = [createSeededPattern("A", 0), createSeededPattern("B", 1)];
const initialActivePattern: PatternSlot = "A";
const initial = syncPatternTracks(initialPatterns, initialActivePattern);

export const useBeatStore = create<BeatStore>((set, get) => ({
  beatName: "New Beat",
  bpm: 110,
  swing: 0,
  steps: 16,
  isPlaying: false,
  currentStep: 0,
  masterVolume: 0.82,
  kit: KITS[0],
  activePattern: initialActivePattern,
  reverbMasterEnabled: true,
  selectedTrackId: TRACK_DEFS[0].id,
  audioReady: false,
  fallbackMode: false,
  ...initial,
  setBeatName: (beatName) => set({ beatName }),
  setBpm: (bpm) => set({ bpm: Math.min(220, Math.max(40, Math.round(bpm))) }),
  setSwing: (swing) => set({ swing: Math.min(100, Math.max(0, Math.round(swing))) }),
  setSteps: (steps) =>
    set((state) => {
      const patterns = state.patterns.map((pattern) => ({
        ...pattern,
        tracks: pattern.tracks.map((track) => ({
          ...track,
          steps: Array.from({ length: steps }, (_, index) => track.steps[index] ?? false),
          velocity: Array.from({ length: steps }, (_, index) => track.velocity[index] ?? 0.6)
        }))
      }));
      return { steps, currentStep: 0, ...syncPatternTracks(patterns, state.activePattern) };
    }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setMasterVolume: (masterVolume) => set({ masterVolume }),
  setKitByName: (kitName) => {
    const nextKit = KITS.find((kit) => kit.name === kitName);
    if (nextKit) set({ kit: nextKit });
  },
  setAudioReady: (audioReady) => set({ audioReady }),
  setFallbackMode: (fallbackMode) => set({ fallbackMode }),
  setSelectedTrackId: (selectedTrackId) => set({ selectedTrackId }),
  toggleStep: (trackId, index) =>
    set((state) => {
      const tracks = state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              steps: track.steps.map((value, stepIndex) => (stepIndex === index ? !value : value)),
              velocity: track.velocity.map((value, stepIndex) => (stepIndex === index && !track.steps[index] ? 0.8 : value))
            }
          : track
      );
      const patterns = updatePatterns(state.patterns, state.activePattern, tracks);
      return { tracks, patterns, pattern: { ...state.pattern, tracks } };
    }),
  setVelocity: (trackId, index, velocity) =>
    set((state) => {
      const tracks = state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              steps: track.steps.map((value, stepIndex) => (stepIndex === index ? true : value)),
              velocity: track.velocity.map((value, stepIndex) => (stepIndex === index ? velocity : value))
            }
          : track
      );
      const patterns = updatePatterns(state.patterns, state.activePattern, tracks);
      return { tracks, patterns, pattern: { ...state.pattern, tracks } };
    }),
  toggleMute: (trackId) =>
    set((state) => {
      const tracks = state.tracks.map((track) => (track.id === trackId ? { ...track, mute: !track.mute } : track));
      return { tracks, patterns: updatePatterns(state.patterns, state.activePattern, tracks), pattern: { ...state.pattern, tracks } };
    }),
  toggleSolo: (trackId) =>
    set((state) => {
      const tracks = state.tracks.map((track) => (track.id === trackId ? { ...track, solo: !track.solo } : track));
      return { tracks, patterns: updatePatterns(state.patterns, state.activePattern, tracks), pattern: { ...state.pattern, tracks } };
    }),
  setTrackVolume: (trackId, value) =>
    set((state) => {
      const tracks = state.tracks.map((track) => (track.id === trackId ? { ...track, volume: value } : track));
      return { tracks, patterns: updatePatterns(state.patterns, state.activePattern, tracks), pattern: { ...state.pattern, tracks } };
    }),
  setTrackReverb: (trackId, value) =>
    set((state) => {
      const tracks = state.tracks.map((track) => (track.id === trackId ? { ...track, reverb: value } : track));
      return { tracks, patterns: updatePatterns(state.patterns, state.activePattern, tracks), pattern: { ...state.pattern, tracks } };
    }),
  setTrackReverbType: (trackId, reverbType) =>
    set((state) => {
      const tracks = state.tracks.map((track) => (track.id === trackId ? { ...track, reverbType } : track));
      return { tracks, patterns: updatePatterns(state.patterns, state.activePattern, tracks), pattern: { ...state.pattern, tracks } };
    }),
  setActivePattern: (activePattern) => set((state) => ({ activePattern, currentStep: 0, ...syncPatternTracks(state.patterns, activePattern) })),
  copyPattern: (from, to) =>
    set((state) => {
      const fromPattern = state.patterns.find((pattern) => pattern.id === from);
      if (!fromPattern) return state;
      const patterns = state.patterns.map((pattern) => (pattern.id === to ? clonePattern({ ...fromPattern, id: to, name: `Pattern ${to}` }) : pattern));
      return syncPatternTracks(patterns, state.activePattern);
    }),
  applyPresetToPattern: (slot, presetName) =>
    set((state) => {
      const preset = ROCK_PRESETS.find((item) => item.name === presetName);
      if (!preset) return state;

      const nextSteps = preset.steps;
      const normalizedPatterns = state.patterns.map((pattern) => ({
        ...pattern,
        tracks: pattern.tracks.map((track) => ({
          ...track,
          steps: Array.from({ length: nextSteps }, (_, index) => track.steps[index] ?? false),
          velocity: Array.from({ length: nextSteps }, (_, index) => track.velocity[index] ?? 0.6)
        }))
      }));

      const patterns = normalizedPatterns.map((pattern) => {
        if (pattern.id !== slot) return pattern;
        return {
          ...pattern,
          tracks: preset.apply(pattern.tracks)
        };
      });

      return {
        steps: nextSteps,
        currentStep: 0,
        ...syncPatternTracks(patterns, state.activePattern)
      };
    }),
  setReverbMasterEnabled: (reverbMasterEnabled) => set({ reverbMasterEnabled }),
  applyPresetTracks: (steps, tracks) =>
    set((state) => {
      const patterns = updatePatterns(state.patterns, state.activePattern, tracks);
      return { steps, tracks, patterns, pattern: { ...state.pattern, tracks } };
    }),
  loadSavedBeat: (beat) =>
    set(() => {
      const activePattern = initialActivePattern;
      const patterns = [
        { ...beat.patternA, id: "A" as const },
        { ...beat.patternB, id: "B" as const }
      ];
      const active = patterns.find((pattern) => pattern.id === activePattern) ?? patterns[0];
      return {
        beatName: beat.name,
        bpm: beat.bpm,
        swing: beat.swing,
        steps: beat.steps,
        tracks: clonePattern(active).tracks,
        pattern: clonePattern(active),
        activePattern,
        currentStep: 0,
        patterns,
        kit: KITS.find((kit) => kit.name === beat.kit) ?? KITS[0]
      };
    })
}));

export const buildSavedBeat = (): SavedBeat => {
  const state = useBeatStore.getState();
  const patternA = state.patterns.find((pattern) => pattern.id === "A") ?? createPattern("A", state.steps);
  const patternB = state.patterns.find((pattern) => pattern.id === "B") ?? createPattern("B", state.steps);
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: state.beatName,
    bpm: state.bpm,
    swing: state.swing,
    steps: state.steps,
    tracks: state.tracks,
    patternA: clonePattern(patternA),
    patternB: clonePattern(patternB),
    kit: state.kit.name,
    createdAt: now,
    updatedAt: now
  };
};
