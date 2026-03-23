import { Play, Square, HandMetal, Settings2, Volume2, Waves } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useBeatStore } from "@/store/beatStore";
import { audioEngine } from "@/audio/AudioEngine";

export function TransportBar() {
  const {
    bpm,
    isPlaying,
    masterVolume,
    reverbMasterEnabled,
    reverbMasterAmount,
    setBpm,
    setMasterVolume,
    setReverbMasterEnabled,
    setReverbMasterAmount
  } = useBeatStore();
  const [tapMarks, setTapMarks] = useState<number[]>([]);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [reverbOpen, setReverbOpen] = useState(false);
  const marksRef = useRef<number[]>([]);
  const volumeRef = useRef<HTMLDivElement>(null);
  const reverbRef = useRef<HTMLDivElement>(null);

  const tapTempo = () => {
    const now = performance.now();
    const next = [...marksRef.current.slice(-4), now];
    marksRef.current = next;
    setTapMarks(next);
  };

  const tapBpm = useMemo(() => {
    if (tapMarks.length < 2) return null;
    const intervals = tapMarks.slice(1).map((value, index) => value - tapMarks[index]);
    const average = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
    return Math.round(60000 / average);
  }, [tapMarks]);

  useEffect(() => {
    if (!tapBpm) return;
    setBpm(tapBpm);
  }, [tapBpm, setBpm]);

  useEffect(() => {
    const handler = () => tapTempo();
    window.addEventListener("beatsketch:tap-tempo", handler);
    return () => window.removeEventListener("beatsketch:tap-tempo", handler);
  });

  useEffect(() => {
    if (!volumeOpen && !reverbOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!volumeRef.current?.contains(event.target as Node)) {
        setVolumeOpen(false);
      }
      if (!reverbRef.current?.contains(event.target as Node)) {
        setReverbOpen(false);
      }
    };
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [volumeOpen, reverbOpen]);

  return (
    <div className="p-2">
      <div className="mb-2 flex items-center gap-2">
        <Button
          size="sm"
          className="h-12 flex-1 text-base"
          onClick={async () => {
            if (isPlaying) audioEngine.stop();
            else await audioEngine.start();
          }}
        >
          {isPlaying ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isPlaying ? "Stop" : "Play"}
        </Button>
        <Button size="sm" variant="outline" className="h-12 min-w-[108px] text-base font-semibold" onClick={tapTempo}>
          <HandMetal className="mr-2 h-5 w-5 text-violet-500" />
          Tap
        </Button>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-violet-500">
          <span>BPM</span>
          <input
            type="number"
            min={40}
            max={220}
            value={bpm}
            onChange={(event) => setBpm(Number(event.target.value))}
            className="w-14 rounded bg-white px-2 py-1 text-right text-xs text-violet-950 outline-none border border-violet-200"
          />
        </div>
        <Slider value={[bpm]} min={40} max={220} step={1} onValueChange={(value) => setBpm(value[0] ?? bpm)} />
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between rounded-md border border-violet-200 bg-white px-3 py-2 text-xs">
          <div className="text-[10px] uppercase tracking-[0.24em] text-violet-500">Master</div>
          <div className="relative flex items-center gap-2" ref={volumeRef}>
            <span className="text-[10px] uppercase tracking-[0.24em] text-violet-500">{Math.round(masterVolume * 100)}%</span>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 bg-violet-50 text-violet-600 transition hover:bg-violet-100"
              aria-label="Master volume"
              onClick={() => setVolumeOpen((current) => !current)}
            >
              <Volume2 className="h-4 w-4" />
            </button>
            {volumeOpen ? (
              <div className="absolute right-0 top-10 z-20 flex w-40 flex-col rounded-xl border border-violet-200 bg-white p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-violet-500">
                  <span>Vol</span>
                  <span>{Math.round(masterVolume * 100)}%</span>
                </div>
                <Slider
                  value={[Math.round(masterVolume * 100)]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setMasterVolume((value[0] ?? 0) / 100)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-md border border-violet-200 bg-white px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-violet-500" />
          Reverb Master
        </div>
        <div className="relative flex items-center gap-2" ref={reverbRef}>
          <span className="text-[10px] uppercase tracking-[0.24em] text-violet-500">{reverbMasterAmount}%</span>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 bg-violet-50 text-violet-600 transition hover:bg-violet-100"
            aria-label="Reverb settings"
            onClick={() => setReverbOpen((current) => !current)}
          >
            <Settings2 className="h-4 w-4" />
          </button>
          {reverbOpen ? (
            <div className="absolute right-10 top-10 z-20 flex w-44 flex-col rounded-xl border border-violet-200 bg-white p-3 shadow-xl">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-violet-500">
                <span>Reverb</span>
                <span>{reverbMasterAmount}%</span>
              </div>
              <Slider value={[reverbMasterAmount]} min={0} max={100} step={1} onValueChange={(value) => setReverbMasterAmount(value[0] ?? 100)} />
            </div>
          ) : null}
          <Switch checked={reverbMasterEnabled} onCheckedChange={setReverbMasterEnabled} />
        </div>
      </div>
      <button id="tap-tempo-hidden" type="button" className="hidden" onClick={tapTempo} />
    </div>
  );
}
