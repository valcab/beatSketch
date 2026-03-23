# BeatSketch

BeatSketch is a Chrome extension drum machine built for guitarists and bassists.
It focuses on fast sketching, genre-based groove templates, dual-pattern playback, and a compact sequencer UI inside a browser popup.

## Features

- Chrome Extension Manifest V3
- React 18 + TypeScript + Vite
- Web Audio API playback engine
- Dual pattern workflow: `A / B`
- Queued pattern switching at end of bar
- Genre templates grouped by family
- Step sequencer with click-drag painting
- Per-step velocity editing
- Sample-based drum kit with graceful fallback synthesis
- Global reverb on/off and intensity
- Tap tempo
- Local save/load

## Tech Stack

- React 18
- TypeScript
- Vite
- Zustand
- Tailwind CSS
- Radix/Shadcn-style UI primitives
- Web Audio API
- localForage
- JSZip
- Zod

## Project Structure

```text
beatsketch/
├── manifest.json
├── popup.html
├── src/
│   ├── audio/
│   ├── background/
│   ├── components/
│   ├── popup/
│   ├── presets/
│   ├── store/
│   ├── styles.css
│   └── types/
└── dist/
```

## Install

```bash
npm install
```

## Run in Dev

```bash
npm run dev
```

## Build

```bash
npm run build
```

The production extension files are generated in `dist/`.

## Load in Chrome

1. Run `npm run build`
2. Open `chrome://extensions`
3. Enable Developer Mode
4. Click `Load unpacked`
5. Select the `dist/` folder

## Samples

The project expects drum samples under:

```text
src/assets/drums/{kit_name}/
```

Current extension behavior:

- the `rock` kit includes mapped WAV files
- if a sample is missing, BeatSketch falls back to synthetic drum voices

## Controls

- `Space`: Play / Stop
- `T`: Tap tempo
- `A`: Queue/select pattern A
- `B`: Queue/select pattern B
- `M`: Mute selected track
- `S`: Solo selected track
- `← / →`: BPM -/+ 1
- `Shift + ← / →`: BPM -/+ 5

## Templates

BeatSketch includes multiple presets grouped by family:

- Rock
- Metal
- Stoner
- Doom
- Punk
- Hardcore
- Blues
- Indie
- Prog

## Notes

- Audio must be unlocked by user interaction due to browser AudioContext restrictions.
- Pattern switching during playback is applied at the end of the current bar.
- The extension is optimized for a compact Chrome popup workflow rather than a full DAW-style layout.

## Author

- LinkedIn: https://www.linkedin.com/in/valentincabioch/
