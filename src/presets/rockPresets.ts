import type { DrumTrack, Pattern, ReverbType, StepCount } from "@/types/beat.types";

export interface RockPreset {
  name: string;
  steps: StepCount;
  apply: (tracks: DrumTrack[]) => DrumTrack[];
}

const fillArray = (steps: number, active: number[], velocity = 0.78) => {
  const values = Array.from({ length: steps }, () => false);
  const velocities = Array.from({ length: steps }, () => 0.55);
  active.forEach((index) => {
    values[index] = true;
    velocities[index] = velocity;
  });
  return { values, velocities };
};

const setTrack = (
  tracks: DrumTrack[],
  key: string,
  active: number[],
  velocity = 0.78,
  reverb?: { value: number; type: ReverbType }
) =>
  tracks.map((track) => {
    if (track.key !== key) return track;
    const pattern = fillArray(track.steps.length, active, velocity);
    return {
      ...track,
      steps: pattern.values,
      velocity: pattern.velocities,
      reverb: reverb?.value ?? track.reverb,
      reverbType: reverb?.type ?? track.reverbType
    };
  });

const clearTracks = (tracks: DrumTrack[]) =>
  tracks.map((track) => ({
    ...track,
    steps: track.steps.map(() => false),
    velocity: track.velocity.map(() => 0.55)
  }));

export const ROCK_PRESETS: RockPreset[] = [
  {
    name: "Rock Basic",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 8], 0.88);
      tracks = setTrack(tracks, "snare", [4, 12], 0.82);
      tracks = setTrack(tracks, "hihat_closed", [0, 2, 4, 6, 8, 10, 12, 14], 0.62);
      return tracks;
    }
  },
  {
    name: "Rock 8th HiHat",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 6, 8], 0.88);
      tracks = setTrack(tracks, "snare", [4, 12], 0.82);
      tracks = setTrack(tracks, "hihat_closed", Array.from({ length: 16 }, (_, index) => index), 0.56);
      return tracks;
    }
  },
  {
    name: "Shuffle Rock",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 3, 8], 0.9);
      tracks = setTrack(tracks, "snare", [4, 12], 0.8);
      tracks = setTrack(tracks, "hihat_open", [2, 6, 10, 14], 0.66, { value: 28, type: "room" });
      return tracks;
    }
  },
  {
    name: "Rock Ballad",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 10], 0.86);
      tracks = setTrack(tracks, "snare", [6, 14], 0.82);
      tracks = setTrack(tracks, "ride", [0, 2, 4, 6, 8, 10, 12, 14], 0.62, { value: 46, type: "hall" });
      return tracks;
    }
  }
];

export const clonePattern = (pattern: Pattern): Pattern => ({
  ...pattern,
  tracks: pattern.tracks.map((track) => ({
    ...track,
    steps: [...track.steps],
    velocity: [...track.velocity]
  }))
});
