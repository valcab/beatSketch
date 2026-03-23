import type { DrumTrack, FillRepeatCount, Pattern, ReverbType, StepCount } from "@/types/beat.types";

export type PresetFamily = "Rock" | "Metal" | "Stoner" | "Doom" | "Punk" | "Hardcore" | "Blues" | "Indie" | "Prog";

interface TrackSpec {
  key: string;
  active: number[];
  velocity?: number;
  reverb?: { value: number; type: ReverbType };
}

interface PresetFillDefinition {
  name: string;
  repeats: FillRepeatCount;
  apply: (tracks: DrumTrack[]) => DrumTrack[];
}

export interface RockPreset {
  family: PresetFamily;
  name: string;
  steps: StepCount;
  fills: PresetFillDefinition[];
  apply: (tracks: DrumTrack[]) => DrumTrack[];
}

const fillArray = (steps: number, active: number[], velocity = 0.78) => {
  const values = Array.from({ length: steps }, () => false);
  const velocities = Array.from({ length: steps }, () => 0.55);
  active.forEach((index) => {
    if (index < steps) {
      values[index] = true;
      velocities[index] = velocity;
    }
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

const applySpecs = (source: DrumTrack[], specs: TrackSpec[]) =>
  specs.reduce((tracks, spec) => setTrack(tracks, spec.key, spec.active, spec.velocity, spec.reverb), clearTracks(source));

const makeFill = (name: string, repeats: FillRepeatCount, specs: TrackSpec[]): PresetFillDefinition => ({
  name,
  repeats,
  apply: (source) => applySpecs(source, specs)
});

const makePreset = (family: PresetFamily, name: string, specs: TrackSpec[], fills: PresetFillDefinition[]): RockPreset => ({
  family,
  name,
  steps: 16,
  fills,
  apply: (source) => applySpecs(source, specs)
});

const even16 = Array.from({ length: 8 }, (_, index) => index * 2);
const every16 = Array.from({ length: 16 }, (_, index) => index);

export const PRESET_FAMILIES: readonly PresetFamily[] = ["Rock", "Metal", "Stoner", "Doom", "Punk", "Hardcore", "Blues", "Indie", "Prog"] as const;

export const ROCK_PRESETS: RockPreset[] = [
  makePreset(
    "Rock",
    "Rock Basic",
    [
      { key: "kick", active: [0, 8], velocity: 0.88 },
      { key: "snare", active: [4, 12], velocity: 0.82 },
      { key: "hihat_closed", active: even16, velocity: 0.62 }
    ],
    [
      makeFill("Backbeat Snare Fill", 1, [
        { key: "kick", active: [0, 8, 11], velocity: 0.88 },
        { key: "snare", active: [8, 10, 12, 14, 15], velocity: 0.9 },
        { key: "tom_mid", active: [12, 14], velocity: 0.76, reverb: { value: 24, type: "room" } },
        { key: "crash", active: [0], velocity: 0.72, reverb: { value: 28, type: "hall" } }
      ])
    ]
  ),
  makePreset(
    "Rock",
    "Rock 8th HiHat",
    [
      { key: "kick", active: [0, 6, 8], velocity: 0.88 },
      { key: "snare", active: [4, 12], velocity: 0.82 },
      { key: "hihat_closed", active: every16, velocity: 0.56 }
    ],
    [
      makeFill("Open Hat Lift", 1, [
        { key: "kick", active: [0, 6, 8, 11], velocity: 0.9 },
        { key: "snare", active: [8, 12, 14, 15], velocity: 0.9 },
        { key: "hihat_open", active: [10, 12, 14], velocity: 0.68, reverb: { value: 20, type: "room" } }
      ]),
      makeFill("Tom Pickup", 2, [
        { key: "kick", active: [0, 8], velocity: 0.86 },
        { key: "snare", active: [12, 14], velocity: 0.88 },
        { key: "tom_low", active: [8, 10, 12], velocity: 0.76, reverb: { value: 22, type: "room" } },
        { key: "tom_mid", active: [9, 11, 13, 15], velocity: 0.74, reverb: { value: 22, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Rock",
    "Shuffle Rock",
    [
      { key: "kick", active: [0, 3, 8], velocity: 0.9 },
      { key: "snare", active: [4, 12], velocity: 0.8 },
      { key: "hihat_open", active: [2, 6, 10, 14], velocity: 0.66, reverb: { value: 28, type: "room" } }
    ],
    [
      makeFill("Shuffle Turnaround", 1, [
        { key: "kick", active: [0, 3, 8, 11], velocity: 0.88 },
        { key: "snare", active: [8, 11, 13, 15], velocity: 0.86 },
        { key: "tom_mid", active: [10, 12, 14], velocity: 0.74, reverb: { value: 22, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Rock",
    "Rock Ballad",
    [
      { key: "kick", active: [0, 10], velocity: 0.86 },
      { key: "snare", active: [6, 14], velocity: 0.82 },
      { key: "ride", active: even16, velocity: 0.62, reverb: { value: 46, type: "hall" } }
    ],
    [
      makeFill("Ballad Swell", 2, [
        { key: "kick", active: [0, 8, 12], velocity: 0.84 },
        { key: "snare", active: [8, 12, 14], velocity: 0.84, reverb: { value: 34, type: "plate" } },
        { key: "tom_low", active: [10, 12, 15], velocity: 0.72, reverb: { value: 28, type: "room" } },
        { key: "crash", active: [0], velocity: 0.74, reverb: { value: 42, type: "hall" } }
      ])
    ]
  ),
  makePreset(
    "Rock",
    "Arena Lift",
    [
      { key: "kick", active: [0, 4, 8, 10], velocity: 0.88 },
      { key: "snare", active: [4, 12], velocity: 0.84 },
      { key: "crash", active: [0, 8], velocity: 0.72, reverb: { value: 30, type: "hall" } },
      { key: "hihat_closed", active: [2, 6, 10, 14], velocity: 0.58 }
    ],
    [
      makeFill("Arena Crash Fill", 1, [
        { key: "kick", active: [0, 4, 8, 11], velocity: 0.9 },
        { key: "snare", active: [8, 12, 14, 15], velocity: 0.88 },
        { key: "crash", active: [0, 15], velocity: 0.78, reverb: { value: 38, type: "hall" } }
      ])
    ]
  ),
  makePreset(
    "Metal",
    "Heavy Gallop",
    [
      { key: "kick", active: [0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15], velocity: 0.9 },
      { key: "snare", active: [4, 12], velocity: 0.84 },
      { key: "hihat_closed", active: even16, velocity: 0.6 }
    ],
    [
      makeFill("Gallop Break", 1, [
        { key: "kick", active: [0, 2, 3, 8, 10, 11, 14, 15], velocity: 0.92 },
        { key: "snare", active: [8, 10, 12, 14], velocity: 0.92 },
        { key: "tom_low", active: [12, 13], velocity: 0.78, reverb: { value: 18, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Metal",
    "Double Kick Drive",
    [
      { key: "kick", active: every16, velocity: 0.74 },
      { key: "snare", active: [4, 12], velocity: 0.88 },
      { key: "ride", active: even16, velocity: 0.6, reverb: { value: 18, type: "room" } }
    ],
    [
      makeFill("Double Kick Barrage", 1, [
        { key: "kick", active: every16, velocity: 0.8 },
        { key: "snare", active: [8, 10, 12, 14, 15], velocity: 0.94 },
        { key: "crash", active: [0, 15], velocity: 0.76, reverb: { value: 24, type: "hall" } }
      ]),
      makeFill("Ride To Toms", 2, [
        { key: "kick", active: [0, 1, 2, 3, 8, 9, 10, 11, 14, 15], velocity: 0.78 },
        { key: "snare", active: [12, 14], velocity: 0.9 },
        { key: "tom_low", active: [8, 10, 12], velocity: 0.8, reverb: { value: 20, type: "room" } },
        { key: "tom_mid", active: [9, 11, 13, 15], velocity: 0.8, reverb: { value: 20, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Metal",
    "Half-Time Chug",
    [
      { key: "kick", active: [0, 3, 8, 10, 11], velocity: 0.92 },
      { key: "snare", active: [8], velocity: 0.9 },
      { key: "crash", active: [0, 4, 8, 12], velocity: 0.7, reverb: { value: 32, type: "hall" } },
      { key: "hihat_closed", active: [2, 6, 10, 14], velocity: 0.55 }
    ],
    [
      makeFill("Half-Time Slam", 1, [
        { key: "kick", active: [0, 3, 8, 10, 11, 14], velocity: 0.94 },
        { key: "snare", active: [8, 12, 14], velocity: 0.92 },
        { key: "tom_low", active: [13, 15], velocity: 0.8, reverb: { value: 24, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Metal",
    "Thrash Ride",
    [
      { key: "kick", active: [0, 2, 4, 5, 8, 10, 12, 13], velocity: 0.9 },
      { key: "snare", active: [4, 12], velocity: 0.9 },
      { key: "ride", active: even16, velocity: 0.62, reverb: { value: 16, type: "room" } },
      { key: "crash", active: [0], velocity: 0.74, reverb: { value: 24, type: "hall" } }
    ],
    [
      makeFill("Thrash Spill", 1, [
        { key: "kick", active: [0, 2, 4, 5, 8, 10, 11, 13, 15], velocity: 0.92 },
        { key: "snare", active: [8, 10, 12, 14], velocity: 0.92 },
        { key: "ride", active: [0, 2, 4, 6, 8, 10], velocity: 0.58, reverb: { value: 14, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Stoner",
    "Fuzzy Cruiser",
    [
      { key: "kick", active: [0, 6, 8, 10], velocity: 0.88 },
      { key: "snare", active: [4, 12], velocity: 0.8 },
      { key: "ride", active: even16, velocity: 0.64, reverb: { value: 24, type: "room" } },
      { key: "crash", active: [0], velocity: 0.72, reverb: { value: 36, type: "hall" } }
    ],
    [
      makeFill("Desert Drop", 1, [
        { key: "kick", active: [0, 6, 8, 10, 14], velocity: 0.88 },
        { key: "snare", active: [8, 12, 14], velocity: 0.84 },
        { key: "tom_low", active: [11, 13, 15], velocity: 0.78, reverb: { value: 24, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Stoner",
    "Desert Shuffle",
    [
      { key: "kick", active: [0, 3, 8, 11], velocity: 0.86 },
      { key: "snare", active: [4, 12], velocity: 0.78 },
      { key: "hihat_open", active: [2, 6, 10, 14], velocity: 0.66, reverb: { value: 30, type: "room" } },
      { key: "tom_low", active: [7, 15], velocity: 0.75, reverb: { value: 22, type: "room" } }
    ],
    [
      makeFill("Sandstorm Fill", 2, [
        { key: "kick", active: [0, 3, 8, 11, 14], velocity: 0.86 },
        { key: "snare", active: [8, 12, 14], velocity: 0.82 },
        { key: "tom_low", active: [9, 11, 13, 15], velocity: 0.78, reverb: { value: 24, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Stoner",
    "Tom Trudge",
    [
      { key: "kick", active: [0, 5, 8, 13], velocity: 0.88 },
      { key: "snare", active: [4, 12], velocity: 0.76 },
      { key: "tom_low", active: [2, 10], velocity: 0.74, reverb: { value: 28, type: "room" } },
      { key: "tom_mid", active: [6, 14], velocity: 0.72, reverb: { value: 24, type: "room" } },
      { key: "ride", active: [0, 4, 8, 12], velocity: 0.6, reverb: { value: 18, type: "room" } }
    ],
    [
      makeFill("Tom Ladder", 1, [
        { key: "kick", active: [0, 8, 12], velocity: 0.9 },
        { key: "snare", active: [8, 14], velocity: 0.8 },
        { key: "tom_low", active: [8, 10, 12, 14], velocity: 0.8, reverb: { value: 26, type: "room" } },
        { key: "tom_mid", active: [9, 11, 13, 15], velocity: 0.8, reverb: { value: 22, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Stoner",
    "Low Rider",
    [
      { key: "kick", active: [0, 7, 8, 11], velocity: 0.86 },
      { key: "snare", active: [4, 12], velocity: 0.76 },
      { key: "ride", active: even16, velocity: 0.58, reverb: { value: 20, type: "room" } },
      { key: "tom_low", active: [15], velocity: 0.74, reverb: { value: 24, type: "room" } }
    ],
    [
      makeFill("Low Dust Fill", 1, [
        { key: "kick", active: [0, 7, 8, 11, 14], velocity: 0.88 },
        { key: "snare", active: [8, 12, 14], velocity: 0.8 },
        { key: "tom_low", active: [12, 14, 15], velocity: 0.8, reverb: { value: 24, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Doom",
    "Funeral March",
    [
      { key: "kick", active: [0, 8], velocity: 0.95 },
      { key: "snare", active: [4, 12], velocity: 0.72, reverb: { value: 34, type: "plate" } },
      { key: "crash", active: [0, 8], velocity: 0.76, reverb: { value: 52, type: "hall" } },
      { key: "ride", active: [4, 12], velocity: 0.56, reverb: { value: 34, type: "hall" } }
    ],
    [
      makeFill("Funeral Roll", 2, [
        { key: "kick", active: [0, 8, 12], velocity: 0.92 },
        { key: "snare", active: [8, 12, 14], velocity: 0.8, reverb: { value: 40, type: "plate" } },
        { key: "tom_low", active: [10, 12, 14], velocity: 0.78, reverb: { value: 28, type: "room" } },
        { key: "crash", active: [0, 8], velocity: 0.72, reverb: { value: 54, type: "hall" } }
      ])
    ]
  ),
  makePreset(
    "Doom",
    "Sludge Crawl",
    [
      { key: "kick", active: [0, 7, 8], velocity: 0.92 },
      { key: "snare", active: [8], velocity: 0.82, reverb: { value: 38, type: "plate" } },
      { key: "crash", active: [0, 4, 8, 12], velocity: 0.68, reverb: { value: 44, type: "hall" } },
      { key: "tom_low", active: [6, 14], velocity: 0.72, reverb: { value: 30, type: "room" } }
    ],
    [
      makeFill("Sludge Drag", 1, [
        { key: "kick", active: [0, 7, 8, 12], velocity: 0.92 },
        { key: "snare", active: [8, 14], velocity: 0.84, reverb: { value: 38, type: "plate" } },
        { key: "tom_low", active: [9, 11, 13, 15], velocity: 0.78, reverb: { value: 30, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Doom",
    "Cathedral Pulse",
    [
      { key: "kick", active: [0, 10], velocity: 0.9 },
      { key: "snare", active: [6, 14], velocity: 0.78, reverb: { value: 42, type: "plate" } },
      { key: "ride", active: [0, 4, 8, 12], velocity: 0.62, reverb: { value: 48, type: "hall" } },
      { key: "crash", active: [0], velocity: 0.78, reverb: { value: 56, type: "hall" } }
    ],
    [
      makeFill("Cathedral Decay", 2, [
        { key: "kick", active: [0, 8, 12], velocity: 0.9 },
        { key: "snare", active: [8, 14], velocity: 0.82, reverb: { value: 44, type: "plate" } },
        { key: "ride", active: [0, 4, 8, 12], velocity: 0.58, reverb: { value: 50, type: "hall" } },
        { key: "tom_mid", active: [10, 12, 14], velocity: 0.76, reverb: { value: 26, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Doom",
    "Monolith",
    [
      { key: "kick", active: [0, 8, 12], velocity: 0.94 },
      { key: "snare", active: [8], velocity: 0.78, reverb: { value: 36, type: "plate" } },
      { key: "crash", active: [0, 8], velocity: 0.7, reverb: { value: 50, type: "hall" } },
      { key: "tom_low", active: [6, 14], velocity: 0.72, reverb: { value: 28, type: "room" } }
    ],
    [
      makeFill("Monolith Break", 1, [
        { key: "kick", active: [0, 8, 12, 14], velocity: 0.94 },
        { key: "snare", active: [8, 14], velocity: 0.82, reverb: { value: 38, type: "plate" } },
        { key: "tom_low", active: [10, 12, 14, 15], velocity: 0.8, reverb: { value: 28, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Punk",
    "Punk Sprint",
    [
      { key: "kick", active: even16, velocity: 0.9 },
      { key: "snare", active: [4, 12], velocity: 0.95 },
      { key: "hihat_closed", active: every16, velocity: 0.62 },
      { key: "crash", active: [0, 8], velocity: 0.72, reverb: { value: 24, type: "hall" } }
    ],
    [
      makeFill("Punk Snare Rush", 1, [
        { key: "kick", active: [0, 2, 4, 6, 8, 10, 12, 14], velocity: 0.92 },
        { key: "snare", active: [8, 10, 12, 14, 15], velocity: 0.96 },
        { key: "crash", active: [0, 15], velocity: 0.76, reverb: { value: 28, type: "hall" } }
      ])
    ]
  ),
  makePreset(
    "Punk",
    "Skate Beat",
    [
      { key: "kick", active: [0, 4, 6, 8, 12, 14], velocity: 0.88 },
      { key: "snare", active: [4, 12], velocity: 0.94 },
      { key: "hihat_closed", active: every16, velocity: 0.58 }
    ],
    [
      makeFill("Skate Ramp Fill", 1, [
        { key: "kick", active: [0, 4, 6, 8, 12, 14], velocity: 0.9 },
        { key: "snare", active: [8, 10, 12, 14], velocity: 0.94 },
        { key: "tom_mid", active: [11, 13, 15], velocity: 0.78, reverb: { value: 18, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Hardcore",
    "Breakneck",
    [
      { key: "kick", active: [0, 1, 4, 5, 8, 9, 12, 13], velocity: 0.88 },
      { key: "snare", active: [2, 6, 10, 14], velocity: 0.92 },
      { key: "hihat_closed", active: every16, velocity: 0.58 }
    ],
    [
      makeFill("Breakneck Spill", 1, [
        { key: "kick", active: [0, 1, 4, 5, 8, 9, 12, 13, 14, 15], velocity: 0.9 },
        { key: "snare", active: [8, 10, 12, 14, 15], velocity: 0.94 },
        { key: "crash", active: [0, 15], velocity: 0.74, reverb: { value: 22, type: "hall" } }
      ])
    ]
  ),
  makePreset(
    "Hardcore",
    "Pit Two-Step",
    [
      { key: "kick", active: [0, 3, 4, 8, 11, 12], velocity: 0.9 },
      { key: "snare", active: [2, 6, 10, 14], velocity: 0.9 },
      { key: "crash", active: [0, 8], velocity: 0.72, reverb: { value: 20, type: "hall" } }
    ],
    [
      makeFill("Two-Step Turn", 2, [
        { key: "kick", active: [0, 3, 4, 8, 11, 12, 14], velocity: 0.9 },
        { key: "snare", active: [8, 10, 12, 14], velocity: 0.92 },
        { key: "tom_low", active: [9, 11, 13, 15], velocity: 0.8, reverb: { value: 18, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Blues",
    "Blues Shuffle",
    [
      { key: "kick", active: [0, 5, 8, 13], velocity: 0.84 },
      { key: "snare", active: [4, 12], velocity: 0.78 },
      { key: "ride", active: [0, 3, 4, 7, 8, 11, 12, 15], velocity: 0.62, reverb: { value: 18, type: "room" } }
    ],
    [
      makeFill("Shuffle Snare Drag", 1, [
        { key: "kick", active: [0, 5, 8, 13], velocity: 0.84 },
        { key: "snare", active: [8, 11, 13, 15], velocity: 0.84 },
        { key: "tom_mid", active: [12, 14], velocity: 0.72, reverb: { value: 18, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Blues",
    "Texas Walk",
    [
      { key: "kick", active: [0, 4, 8, 12], velocity: 0.82 },
      { key: "snare", active: [4, 12], velocity: 0.76 },
      { key: "ride", active: even16, velocity: 0.6, reverb: { value: 14, type: "room" } },
      { key: "hihat_open", active: [7, 15], velocity: 0.58, reverb: { value: 18, type: "room" } }
    ],
    [
      makeFill("Texas Turnaround", 1, [
        { key: "kick", active: [0, 4, 8, 12], velocity: 0.82 },
        { key: "snare", active: [8, 12, 14], velocity: 0.8 },
        { key: "hihat_open", active: [10, 14, 15], velocity: 0.62, reverb: { value: 18, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Indie",
    "Indie Stomp",
    [
      { key: "kick", active: [0, 4, 8, 12], velocity: 0.86 },
      { key: "snare", active: [4, 12], velocity: 0.8 },
      { key: "hihat_open", active: [2, 6, 10, 14], velocity: 0.64, reverb: { value: 20, type: "room" } },
      { key: "crash", active: [0], velocity: 0.7, reverb: { value: 30, type: "hall" } }
    ],
    [
      makeFill("Indie Lift", 1, [
        { key: "kick", active: [0, 4, 8, 12], velocity: 0.86 },
        { key: "snare", active: [8, 12, 14], velocity: 0.82 },
        { key: "tom_mid", active: [11, 13, 15], velocity: 0.72, reverb: { value: 18, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Indie",
    "Dream Pop Pulse",
    [
      { key: "kick", active: [0, 5, 8, 13], velocity: 0.78 },
      { key: "snare", active: [4, 12], velocity: 0.74, reverb: { value: 24, type: "plate" } },
      { key: "ride", active: [0, 4, 8, 12], velocity: 0.56, reverb: { value: 24, type: "hall" } },
      { key: "hihat_open", active: [2, 6, 10, 14], velocity: 0.54, reverb: { value: 18, type: "room" } }
    ],
    [
      makeFill("Dream Wash", 2, [
        { key: "kick", active: [0, 8, 12], velocity: 0.76 },
        { key: "snare", active: [8, 12, 14], velocity: 0.78, reverb: { value: 26, type: "plate" } },
        { key: "crash", active: [0], velocity: 0.72, reverb: { value: 38, type: "hall" } },
        { key: "tom_mid", active: [10, 12, 14], velocity: 0.7, reverb: { value: 20, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Prog",
    "Prog Drive",
    [
      { key: "kick", active: [0, 3, 6, 8, 11, 14], velocity: 0.88 },
      { key: "snare", active: [4, 10, 12], velocity: 0.82 },
      { key: "ride", active: [0, 2, 5, 7, 8, 10, 13, 15], velocity: 0.6, reverb: { value: 18, type: "room" } },
      { key: "tom_mid", active: [9, 15], velocity: 0.74, reverb: { value: 22, type: "room" } }
    ],
    [
      makeFill("Prog Cascade", 1, [
        { key: "kick", active: [0, 3, 6, 8, 11, 14], velocity: 0.88 },
        { key: "snare", active: [8, 10, 12, 15], velocity: 0.86 },
        { key: "tom_low", active: [9, 11, 13], velocity: 0.78, reverb: { value: 22, type: "room" } },
        { key: "tom_mid", active: [10, 12, 14], velocity: 0.78, reverb: { value: 22, type: "room" } }
      ])
    ]
  ),
  makePreset(
    "Prog",
    "Odd Accent",
    [
      { key: "kick", active: [0, 2, 5, 8, 10, 13], velocity: 0.86 },
      { key: "snare", active: [4, 11, 15], velocity: 0.8 },
      { key: "ride", active: [0, 3, 6, 8, 11, 14], velocity: 0.58, reverb: { value: 16, type: "room" } },
      { key: "tom_low", active: [7], velocity: 0.72, reverb: { value: 22, type: "room" } }
    ],
    [
      makeFill("Odd Resolve", 2, [
        { key: "kick", active: [0, 2, 5, 8, 10, 13, 15], velocity: 0.88 },
        { key: "snare", active: [8, 11, 14], velocity: 0.84 },
        { key: "tom_low", active: [9, 11, 13, 15], velocity: 0.78, reverb: { value: 22, type: "room" } },
        { key: "tom_mid", active: [10, 12, 14], velocity: 0.78, reverb: { value: 22, type: "room" } }
      ])
    ]
  )
];

export const clonePattern = (pattern: Pattern): Pattern => ({
  ...pattern,
  tracks: pattern.tracks.map((track) => ({
    ...track,
    steps: [...track.steps],
    velocity: [...track.velocity]
  }))
});
