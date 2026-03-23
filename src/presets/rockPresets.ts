import type { DrumTrack, Pattern, ReverbType, StepCount } from "@/types/beat.types";

export interface RockPreset {
  family: "Rock" | "Metal" | "Stoner" | "Doom" | "Punk" | "Hardcore" | "Blues" | "Indie" | "Prog";
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
    family: "Rock",
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
    family: "Rock",
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
    family: "Rock",
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
    family: "Rock",
    name: "Rock Ballad",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 10], 0.86);
      tracks = setTrack(tracks, "snare", [6, 14], 0.82);
      tracks = setTrack(tracks, "ride", [0, 2, 4, 6, 8, 10, 12, 14], 0.62, { value: 46, type: "hall" });
      return tracks;
    }
  },
  {
    family: "Rock",
    name: "Arena Lift",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 4, 8, 10], 0.88);
      tracks = setTrack(tracks, "snare", [4, 12], 0.84);
      tracks = setTrack(tracks, "crash", [0, 8], 0.72, { value: 30, type: "hall" });
      tracks = setTrack(tracks, "hihat_closed", [2, 6, 10, 14], 0.58);
      return tracks;
    }
  },
  {
    family: "Metal",
    name: "Heavy Gallop",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15], 0.9);
      tracks = setTrack(tracks, "snare", [4, 12], 0.84);
      tracks = setTrack(tracks, "hihat_closed", Array.from({ length: 8 }, (_, i) => i * 2), 0.6);
      return tracks;
    }
  },
  {
    family: "Metal",
    name: "Double Kick Drive",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", Array.from({ length: 16 }, (_, i) => i), 0.74);
      tracks = setTrack(tracks, "snare", [4, 12], 0.88);
      tracks = setTrack(tracks, "ride", [0, 2, 4, 6, 8, 10, 12, 14], 0.6, { value: 18, type: "room" });
      return tracks;
    }
  },
  {
    family: "Metal",
    name: "Half-Time Chug",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 3, 8, 10, 11], 0.92);
      tracks = setTrack(tracks, "snare", [8], 0.9);
      tracks = setTrack(tracks, "crash", [0, 4, 8, 12], 0.7, { value: 32, type: "hall" });
      tracks = setTrack(tracks, "hihat_closed", [2, 6, 10, 14], 0.55);
      return tracks;
    }
  },
  {
    family: "Metal",
    name: "Thrash Ride",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 2, 4, 5, 8, 10, 12, 13], 0.9);
      tracks = setTrack(tracks, "snare", [4, 12], 0.9);
      tracks = setTrack(tracks, "ride", Array.from({ length: 8 }, (_, i) => i * 2), 0.62, { value: 16, type: "room" });
      tracks = setTrack(tracks, "crash", [0], 0.74, { value: 24, type: "hall" });
      return tracks;
    }
  },
  {
    family: "Stoner",
    name: "Fuzzy Cruiser",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 6, 8, 10], 0.88);
      tracks = setTrack(tracks, "snare", [4, 12], 0.8);
      tracks = setTrack(tracks, "ride", Array.from({ length: 8 }, (_, i) => i * 2), 0.64, { value: 24, type: "room" });
      tracks = setTrack(tracks, "crash", [0], 0.72, { value: 36, type: "hall" });
      return tracks;
    }
  },
  {
    family: "Stoner",
    name: "Desert Shuffle",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 3, 8, 11], 0.86);
      tracks = setTrack(tracks, "snare", [4, 12], 0.78);
      tracks = setTrack(tracks, "hihat_open", [2, 6, 10, 14], 0.66, { value: 30, type: "room" });
      tracks = setTrack(tracks, "tom_low", [7, 15], 0.75, { value: 22, type: "room" });
      return tracks;
    }
  },
  {
    family: "Stoner",
    name: "Tom Trudge",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 5, 8, 13], 0.88);
      tracks = setTrack(tracks, "snare", [4, 12], 0.76);
      tracks = setTrack(tracks, "tom_low", [2, 10], 0.74, { value: 28, type: "room" });
      tracks = setTrack(tracks, "tom_mid", [6, 14], 0.72, { value: 24, type: "room" });
      tracks = setTrack(tracks, "ride", [0, 4, 8, 12], 0.6, { value: 18, type: "room" });
      return tracks;
    }
  },
  {
    family: "Stoner",
    name: "Low Rider",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 7, 8, 11], 0.86);
      tracks = setTrack(tracks, "snare", [4, 12], 0.76);
      tracks = setTrack(tracks, "ride", [0, 2, 4, 6, 8, 10, 12, 14], 0.58, { value: 20, type: "room" });
      tracks = setTrack(tracks, "tom_low", [15], 0.74, { value: 24, type: "room" });
      return tracks;
    }
  },
  {
    family: "Doom",
    name: "Funeral March",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 8], 0.95);
      tracks = setTrack(tracks, "snare", [4, 12], 0.72, { value: 34, type: "plate" });
      tracks = setTrack(tracks, "crash", [0, 8], 0.76, { value: 52, type: "hall" });
      tracks = setTrack(tracks, "ride", [4, 12], 0.56, { value: 34, type: "hall" });
      return tracks;
    }
  },
  {
    family: "Doom",
    name: "Sludge Crawl",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 7, 8], 0.92);
      tracks = setTrack(tracks, "snare", [8], 0.82, { value: 38, type: "plate" });
      tracks = setTrack(tracks, "crash", [0, 4, 8, 12], 0.68, { value: 44, type: "hall" });
      tracks = setTrack(tracks, "tom_low", [6, 14], 0.72, { value: 30, type: "room" });
      return tracks;
    }
  },
  {
    family: "Doom",
    name: "Cathedral Pulse",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 10], 0.9);
      tracks = setTrack(tracks, "snare", [6, 14], 0.78, { value: 42, type: "plate" });
      tracks = setTrack(tracks, "ride", [0, 4, 8, 12], 0.62, { value: 48, type: "hall" });
      tracks = setTrack(tracks, "crash", [0], 0.78, { value: 56, type: "hall" });
      return tracks;
    }
  },
  {
    family: "Doom",
    name: "Monolith",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 8, 12], 0.94);
      tracks = setTrack(tracks, "snare", [8], 0.78, { value: 36, type: "plate" });
      tracks = setTrack(tracks, "crash", [0, 8], 0.7, { value: 50, type: "hall" });
      tracks = setTrack(tracks, "tom_low", [6, 14], 0.72, { value: 28, type: "room" });
      return tracks;
    }
  },
  {
    family: "Punk",
    name: "Punk Sprint",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 2, 4, 6, 8, 10, 12, 14], 0.9);
      tracks = setTrack(tracks, "snare", [4, 12], 0.95);
      tracks = setTrack(tracks, "hihat_closed", Array.from({ length: 16 }, (_, i) => i), 0.62);
      tracks = setTrack(tracks, "crash", [0, 8], 0.72, { value: 24, type: "hall" });
      return tracks;
    }
  },
  {
    family: "Punk",
    name: "Skate Beat",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 4, 6, 8, 12, 14], 0.88);
      tracks = setTrack(tracks, "snare", [4, 12], 0.94);
      tracks = setTrack(tracks, "hihat_closed", Array.from({ length: 16 }, (_, i) => i), 0.58);
      return tracks;
    }
  },
  {
    family: "Hardcore",
    name: "Breakneck",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 1, 4, 5, 8, 9, 12, 13], 0.88);
      tracks = setTrack(tracks, "snare", [2, 6, 10, 14], 0.92);
      tracks = setTrack(tracks, "hihat_closed", Array.from({ length: 16 }, (_, i) => i), 0.58);
      return tracks;
    }
  },
  {
    family: "Hardcore",
    name: "Pit Two-Step",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 3, 4, 8, 11, 12], 0.9);
      tracks = setTrack(tracks, "snare", [2, 6, 10, 14], 0.9);
      tracks = setTrack(tracks, "crash", [0, 8], 0.72, { value: 20, type: "hall" });
      return tracks;
    }
  },
  {
    family: "Blues",
    name: "Blues Shuffle",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 5, 8, 13], 0.84);
      tracks = setTrack(tracks, "snare", [4, 12], 0.78);
      tracks = setTrack(tracks, "ride", [0, 3, 4, 7, 8, 11, 12, 15], 0.62, { value: 18, type: "room" });
      return tracks;
    }
  },
  {
    family: "Blues",
    name: "Texas Walk",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 4, 8, 12], 0.82);
      tracks = setTrack(tracks, "snare", [4, 12], 0.76);
      tracks = setTrack(tracks, "ride", [0, 2, 4, 6, 8, 10, 12, 14], 0.6, { value: 14, type: "room" });
      tracks = setTrack(tracks, "hihat_open", [7, 15], 0.58, { value: 18, type: "room" });
      return tracks;
    }
  },
  {
    family: "Indie",
    name: "Indie Stomp",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 4, 8, 12], 0.86);
      tracks = setTrack(tracks, "snare", [4, 12], 0.8);
      tracks = setTrack(tracks, "hihat_open", [2, 6, 10, 14], 0.64, { value: 20, type: "room" });
      tracks = setTrack(tracks, "crash", [0], 0.7, { value: 30, type: "hall" });
      return tracks;
    }
  },
  {
    family: "Indie",
    name: "Dream Pop Pulse",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 5, 8, 13], 0.78);
      tracks = setTrack(tracks, "snare", [4, 12], 0.74, { value: 24, type: "plate" });
      tracks = setTrack(tracks, "ride", [0, 4, 8, 12], 0.56, { value: 24, type: "hall" });
      tracks = setTrack(tracks, "hihat_open", [2, 6, 10, 14], 0.54, { value: 18, type: "room" });
      return tracks;
    }
  },
  {
    family: "Prog",
    name: "Prog Drive",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 3, 6, 8, 11, 14], 0.88);
      tracks = setTrack(tracks, "snare", [4, 10, 12], 0.82);
      tracks = setTrack(tracks, "ride", [0, 2, 5, 7, 8, 10, 13, 15], 0.6, { value: 18, type: "room" });
      tracks = setTrack(tracks, "tom_mid", [9, 15], 0.74, { value: 22, type: "room" });
      return tracks;
    }
  },
  {
    family: "Prog",
    name: "Odd Accent",
    steps: 16,
    apply: (source) => {
      let tracks = clearTracks(source);
      tracks = setTrack(tracks, "kick", [0, 2, 5, 8, 10, 13], 0.86);
      tracks = setTrack(tracks, "snare", [4, 11, 15], 0.8);
      tracks = setTrack(tracks, "ride", [0, 3, 6, 8, 11, 14], 0.58, { value: 16, type: "room" });
      tracks = setTrack(tracks, "tom_low", [7], 0.72, { value: 22, type: "room" });
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
