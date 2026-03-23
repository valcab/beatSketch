import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Info, Linkedin, Save, TriangleAlert } from "lucide-react";
import { useBeatStore } from "@/store/beatStore";
import { audioEngine } from "@/audio/AudioEngine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveCurrentBeat } from "./lib/storage";
import { PatternAB } from "./components/PatternAB";
import { TransportBar } from "./components/TransportBar";
import { Sequencer } from "./components/Sequencer";

const SaveLoadDialog = lazy(() => import("./components/SaveLoadDialog").then((module) => ({ default: module.SaveLoadDialog })));
const LINKEDIN_URL = "https://www.linkedin.com/in/valentincabioch/";

export default function App() {
  const {
    beatName,
    setBeatName,
    audioReady,
    fallbackMode,
    setBpm,
    setActivePattern,
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

  return (
    <div className="relative h-[600px] w-[400px] overflow-hidden bg-[radial-gradient(circle_at_top,#f3edff_0%,#f8f5ff_55%,#efe9ff_100%)] font-sans text-violet-950">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(139,92,246,0.18),transparent_60%)]" />
      {!audioReady ? (
        <button
          type="button"
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/90 text-center"
          onClick={() => audioEngine.initFromGesture()}
        >
          <div className="rounded-full border border-violet-300 bg-violet-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-violet-700">
            Audio Locked
          </div>
          <div className="text-lg font-semibold">Click to start audio</div>
          <div className="max-w-[260px] text-sm text-violet-500">Chrome requires a user gesture before the AudioContext can run.</div>
        </button>
      ) : null}

      <ScrollArea className="relative h-full">
        <div className="relative flex min-h-full flex-col gap-2 p-2">
        <header className="p-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-violet-500">BeatSketch</div>
              <input
                ref={inputRef}
                value={beatName}
                onChange={(event) => setBeatName(event.target.value)}
                className="mt-1 w-full bg-transparent text-xl font-semibold outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              {fallbackMode ? <Badge variant="warning">Samples missing</Badge> : null}
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-600 transition hover:bg-violet-50"
                    aria-label="About BeatSketch"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[320px]">
                  <DialogHeader>
                    <DialogTitle>About BeatSketch</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 text-sm text-violet-800">
                    <p>BeatSketch is a lightweight browser drum machine for guitarists and bassists, with dual pattern A/B playback, quick genre templates, per-step editing, tap tempo, and Web Audio-based reverb.</p>
                    <a
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-3 py-2 font-medium text-violet-700 transition hover:bg-violet-100"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Profile
                    </a>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-white/90 p-2 shadow-pedal">
            <TransportBar />
          </div>
        </header>

        <PatternAB />

        <div className="relative h-[320px] shrink-0 overflow-hidden rounded-2xl border border-violet-200 bg-white/85 p-2">
          <div className="relative h-full overflow-y-auto pr-1">
            <Sequencer />
          </div>
        </div>

        <footer className="rounded-2xl border border-violet-200 bg-white/90 p-2 shadow-pedal">
          <div className="grid grid-cols-2 gap-2">
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
          </div>
          {saveInfo ? (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-violet-500">
              <TriangleAlert className="h-3.5 w-3.5" />
              {saveInfo}
            </div>
          ) : null}
        </footer>
        </div>
      </ScrollArea>
    </div>
  );
}
