import { useEffect, useState } from "react";
import { AudioWaveform, Bell, BetweenHorizontalStart, BetweenVerticalStart, Circle, CircleDot, Disc3, Music2 } from "lucide-react";
import type { DrumTrack } from "@/types/beat.types";
import { Button } from "@/components/ui/button";
import { StepButton } from "./StepButton";

interface TrackRowProps {
  track: DrumTrack;
  currentStep: number;
  steps: number;
  selected: boolean;
  onSelect: () => void;
  onSetStepActive: (index: number, active: boolean) => void;
  onSetVelocity: (index: number, velocity: number) => void;
  onMute: () => void;
  onSolo: () => void;
}

const TRACK_ICONS = {
  kick: Circle,
  snare: CircleDot,
  hihat_closed: AudioWaveform,
  hihat_open: Music2,
  crash: Bell,
  ride: Disc3,
  tom_low: BetweenHorizontalStart,
  tom_mid: BetweenVerticalStart
} as const;

export function TrackRow({
  track,
  currentStep,
  steps,
  selected,
  onSelect,
  onSetStepActive,
  onSetVelocity,
  onMute,
  onSolo
}: TrackRowProps) {
  const [dragValue, setDragValue] = useState<boolean | null>(null);
  const Icon = TRACK_ICONS[track.key as keyof typeof TRACK_ICONS] ?? Circle;

  useEffect(() => {
    if (dragValue === null) return;
    const stopPaint = () => setDragValue(null);
    window.addEventListener("pointerup", stopPaint);
    return () => window.removeEventListener("pointerup", stopPaint);
  }, [dragValue]);

  return (
    <div
      className={`grid grid-cols-[92px_1fr] items-center gap-3 rounded-xl border px-2 py-2 transition ${selected ? "border-violet-400 bg-violet-50" : "border-violet-100 bg-white/70"}`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-violet-900" title={track.name}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="sr-only">{track.name}</span>
          </div>
          <div className={`mt-1 h-2.5 w-2.5 rounded-full ${track.color}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-violet-200 bg-white">
          <button
            type="button"
            className={`inline-flex h-6 w-6 items-center justify-center text-[10px] font-semibold transition ${track.mute ? "bg-violet-500 text-white" : "text-violet-700 hover:bg-violet-50"}`}
            onClick={(event) => {
              event.stopPropagation();
              onMute();
            }}
            aria-label="Mute track"
          >
            M
          </button>
          <button
            type="button"
            className={`inline-flex h-6 w-6 items-center justify-center border-l border-violet-200 text-[10px] font-semibold transition ${track.solo ? "bg-violet-500 text-white" : "text-violet-700 hover:bg-violet-50"}`}
            onClick={(event) => {
              event.stopPropagation();
              onSolo();
            }}
            aria-label="Solo track"
          >
            S
          </button>
        </div>
      </div>
      <div className="grid gap-x-2 gap-y-3" style={{ gridTemplateColumns: `repeat(${track.steps.length}, minmax(0, 1fr))` }}>
        {track.steps.map((active, index) => (
          <StepButton
            key={`${track.id}-${index}`}
            active={active}
            velocity={track.velocity[index] ?? 0.6}
            isCurrent={currentStep === index}
            colorClass={track.color}
            isQuarter={index % Math.max(1, steps / 4) === 0}
            onPaintStart={(nextActive) => {
              onSetStepActive(index, nextActive);
              setDragValue(nextActive);
            }}
            onPaintEnter={() => {
              if (dragValue === null) return;
              onSetStepActive(index, dragValue);
            }}
            onVelocityChange={(velocity) => onSetVelocity(index, velocity)}
          />
        ))}
      </div>
    </div>
  );
}
