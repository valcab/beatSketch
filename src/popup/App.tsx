import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Download, FolderUp, Save, TriangleAlert } from "lucide-react";
import { useBeatStore } from "@/store/beatStore";
import { audioEngine } from "@/audio/AudioEngine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exportCurrentBeat, importBeatFile, saveCurrentBeat } from "./lib/storage";
import { PatternAB } from "./components/PatternAB";
import { TransportBar } from "./components/TransportBar";
import { Sequencer } from "./components/Sequencer";

const SaveLoadDialog = lazy(() => import("./components/SaveLoadDialog").then((module) => ({ default: module.SaveLoadDialog })));

export default function App() {
  const {
    beatName,
    setBeatName,
    currentStep,
    steps,
    audioReady,
    fallbackMode,
    setBpm,
    setActivePattern,
    activePattern,
    selectedTrackId,
    toggleMute,
    toggleSolo,
    masterVolume
  } = useBeatStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [saveInfo, setSaveInfo] = useState<string>("");

  useEffect(() => {
    audioEngine.setMasterVolume(masterVolume);
  }, [masterVolume]);

  useEffect(() => {
    const onKeyDown = async (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT") return;

      if (event.code === "Space") {
        event.preventDefault();
        if (useBeatStore.getState().isPlaying) audioEngine.stop();
        else await audioEngine.start();
      }
      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        inputRef.current?.blur();
        window.dispatchEvent(new Event("beatsketch:tap-tempo"));
      }
      if (event.key.toLowerCase() === "a") setActivePattern("A");
      if (event.key.toLowerCase() === "b") setActivePattern("B");
      if (event.key.toLowerCase() === "m") toggleMute(selectedTrackId);
      if (event.key.toLowerCase() === "s") toggleSolo(selectedTrackId);
      if (event.key === "ArrowLeft") setBpm(useBeatStore.getState().bpm - (event.shiftKey ? 5 : 1));
      if (event.key === "ArrowRight") setBpm(useBeatStore.getState().bpm + (event.shiftKey ? 5 : 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedTrackId, setActivePattern, setBpm, toggleMute, toggleSolo]);

  const playheadStyle = useMemo(() => {
    const width = 100 / steps;
    return {
      width: `${width}%`,
      left: `${currentStep * width}%`
    };
  }, [currentStep, steps]);

  return (
    <div className="relative h-[600px] w-[400px] overflow-hidden bg-[radial-gradient(circle_at_top,#16111f_0%,#07070a_42%,#020617_100%)] font-sans text-zinc-100">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(249,115,22,0.18),transparent_60%)]" />
      {!audioReady ? (
        <button
          type="button"
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/85 text-center"
          onClick={() => audioEngine.initFromGesture()}
        >
          <div className="rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-orange-200">
            Audio Locked
          </div>
          <div className="text-lg font-semibold">Click to start audio</div>
          <div className="max-w-[260px] text-sm text-zinc-400">Chrome requires a user gesture before the AudioContext can run.</div>
        </button>
      ) : null}

      <div className="relative flex h-full min-h-0 flex-col gap-2 p-2">
        <header className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-2 shadow-pedal">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-orange-300">BeatSketch</div>
              <input
                ref={inputRef}
                value={beatName}
                onChange={(event) => setBeatName(event.target.value)}
                className="mt-1 w-full bg-transparent text-xl font-semibold outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="accent">{activePattern}</Badge>
              {fallbackMode ? <Badge variant="warning">Samples missing</Badge> : null}
            </div>
          </div>
          <TransportBar />
        </header>

        <PatternAB />

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-zinc-900 bg-black/50 p-2">
          <div className="pointer-events-none absolute left-2 right-2 top-2 h-[calc(100%-1rem)] overflow-hidden rounded-xl">
            <div className="absolute bottom-0 top-0 border-l border-white/70 shadow-[0_0_15px_rgba(255,255,255,0.35)] transition-all duration-75" style={playheadStyle} />
          </div>
          <div className="relative h-full overflow-y-auto pr-1">
            <Sequencer />
          </div>
        </div>

        <footer className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-2 shadow-pedal">
          <div className="grid grid-cols-4 gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                const { overLimit } = await saveCurrentBeat();
                setSaveInfo(overLimit ? "Slot limit reached: oldest entry trimmed." : "Beat saved.");
              }}
            >
              <Save className="mr-1 h-4 w-4" />
              Save
            </Button>
            <Suspense fallback={<Button size="sm" variant="secondary">Load</Button>}>
              <SaveLoadDialog />
            </Suspense>
            <Button size="sm" variant="secondary" onClick={() => exportCurrentBeat()}>
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".beatsketch";
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const beat = await importBeatFile(file);
                  useBeatStore.getState().loadSavedBeat(beat);
                  setSaveInfo(`Imported ${beat.name}`);
                };
                input.click();
              }}
            >
              <FolderUp className="mr-1 h-4 w-4" />
              Import
            </Button>
          </div>
          {saveInfo ? (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400">
              <TriangleAlert className="h-3.5 w-3.5" />
              {saveInfo}
            </div>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
