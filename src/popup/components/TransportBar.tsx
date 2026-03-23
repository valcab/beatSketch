import { Play, Square, HandMetal, Waves } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useBeatStore } from "@/store/beatStore";
import { audioEngine } from "@/audio/AudioEngine";

export function TransportBar() {
  const {
    bpm,
    swing,
    steps,
    isPlaying,
    masterVolume,
    reverbMasterEnabled,
    setBpm,
    setSwing,
    setSteps,
    setMasterVolume,
    setReverbMasterEnabled
  } = useBeatStore();
  const [tapMarks, setTapMarks] = useState<number[]>([]);
  const marksRef = useRef<number[]>([]);

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

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2 shadow-pedal">
      <div className="mb-2 flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={async () => {
            if (isPlaying) audioEngine.stop();
            else await audioEngine.start();
          }}
        >
          {isPlaying ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isPlaying ? "Stop" : "Play"}
        </Button>
        <Button size="sm" variant="secondary" onClick={tapTempo}>
          <HandMetal className="mr-2 h-4 w-4" />
          Tap
        </Button>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            <span>BPM</span>
            <input
              type="number"
              min={40}
              max={220}
              value={bpm}
              onChange={(event) => setBpm(Number(event.target.value))}
              className="w-14 rounded bg-zinc-800 px-2 py-1 text-right text-xs text-zinc-100 outline-none"
            />
          </div>
          <Slider value={[bpm]} min={40} max={220} step={1} onValueChange={(value) => setBpm(value[0] ?? bpm)} />
        </div>
        <div className="w-20">
          <div className="mb-1 text-[10px] uppercase tracking-[0.24em] text-zinc-500">Steps</div>
          <Select value={String(steps)} onValueChange={(value) => setSteps(Number(value) as 8 | 16 | 32)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="32">32</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            <span>Swing</span>
            <span>{swing}%</span>
          </div>
          <Slider value={[swing]} min={0} max={100} step={1} onValueChange={(value) => setSwing(value[0] ?? 0)} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            <span>Master</span>
            <span>{Math.round(masterVolume * 100)}%</span>
          </div>
          <Slider value={[Math.round(masterVolume * 100)]} min={0} max={100} step={1} onValueChange={(value) => setMasterVolume((value[0] ?? 0) / 100)} />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-orange-300" />
          Reverb Master
        </div>
        <Switch checked={reverbMasterEnabled} onCheckedChange={setReverbMasterEnabled} />
      </div>
      <button id="tap-tempo-hidden" type="button" className="hidden" onClick={tapTempo} />
    </div>
  );
}
