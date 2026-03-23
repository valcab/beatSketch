import { useEffect, useState } from "react";
import type { DrumTrack } from "@/types/beat.types";
import { StepButton } from "./StepButton";

interface TrackRowProps {
  track: DrumTrack;
  currentStep: number;
  steps: number;
  tailFillActive: boolean;
  selected: boolean;
  onSelect: () => void;
  onSetStepActive: (index: number, active: boolean) => void;
  onSetVelocity: (index: number, velocity: number) => void;
  onMute: () => void;
  onSolo: () => void;
}

export function TrackRow({
  track,
  currentStep,
  steps,
  tailFillActive,
  selected,
  onSelect,
  onSetStepActive,
  onSetVelocity,
  onMute,
  onSolo
}: TrackRowProps) {
  const [dragValue, setDragValue] = useState<boolean | null>(null);

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
          <div className="truncate text-[11px] font-medium text-violet-900" title={track.name}>{track.name}</div>
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
            isTailFillCurrent={tailFillActive && currentStep === index}
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
