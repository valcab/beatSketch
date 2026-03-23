import type { DrumTrack } from "@/types/beat.types";
import { Button } from "@/components/ui/button";
import { StepButton } from "./StepButton";

interface TrackRowProps {
  track: DrumTrack;
  currentStep: number;
  steps: number;
  selected: boolean;
  onSelect: () => void;
  onToggleStep: (index: number) => void;
  onSetVelocity: (index: number, velocity: number) => void;
  onMute: () => void;
  onSolo: () => void;
}

export function TrackRow({
  track,
  currentStep,
  steps,
  selected,
  onSelect,
  onToggleStep,
  onSetVelocity,
  onMute,
  onSolo
}: TrackRowProps) {
  return (
    <div
      className={`grid grid-cols-[92px_1fr] items-center gap-3 rounded-xl border px-2 py-2 transition ${selected ? "border-orange-500/60 bg-zinc-950" : "border-zinc-900 bg-black/30"}`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-zinc-100">{track.name}</div>
          <div className="mt-1 h-1.5 w-8 rounded-full bg-zinc-900">
            <div className={`h-1.5 rounded-full ${track.color}`} style={{ width: `${Math.round(track.volume * 100)}%` }} />
          </div>
        </div>
        <Button size="sm" variant={track.mute ? "default" : "outline"} onClick={(event) => { event.stopPropagation(); onMute(); }}>
          M
        </Button>
        <Button size="sm" variant={track.solo ? "default" : "outline"} onClick={(event) => { event.stopPropagation(); onSolo(); }}>
          S
        </Button>
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
            onToggle={() => onToggleStep(index)}
            onVelocityChange={(velocity) => onSetVelocity(index, velocity)}
          />
        ))}
      </div>
    </div>
  );
}
