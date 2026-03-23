import { Button } from "@/components/ui/button";
import { useBeatStore } from "@/store/beatStore";
import { TrackRow } from "./TrackRow";

export function Sequencer() {
  const {
    tracks,
    currentStep,
    steps,
    activeFill,
    selectedTrackId,
    setSteps,
    setSelectedTrackId,
    setStepActive,
    setVelocity,
    toggleMute,
    toggleSolo
  } = useBeatStore();

  return (
    <div className="space-y-2">
      <div className="sticky top-0 z-10 rounded-xl border border-violet-200 bg-white/90 p-2 backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.24em] text-violet-500">Sequencer Grid</div>
          <div className="flex items-center gap-1">
            {[8, 16, 32].map((count) => (
              <Button
                key={count}
                size="sm"
                variant={steps === count ? "default" : "outline"}
                onClick={() => setSteps(count as 8 | 16 | 32)}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-x-2 gap-y-1" style={{ gridTemplateColumns: `92px repeat(${steps}, minmax(0, 1fr))` }}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-violet-400">Track</div>
          {Array.from({ length: steps }, (_, index) => (
            <div
              key={index}
              className={`text-center text-[10px] font-mono ${index % Math.max(1, steps / 4) === 0 ? "text-violet-800" : "text-violet-400"}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      {tracks.map((track) => (
        <TrackRow
          key={track.id}
          track={track}
          currentStep={currentStep}
          steps={steps}
          tailFillActive={Boolean(activeFill)}
          selected={track.id === selectedTrackId}
          onSelect={() => setSelectedTrackId(track.id)}
          onSetStepActive={(index, active) => setStepActive(track.id, index, active)}
          onSetVelocity={(index, velocity) => setVelocity(track.id, index, velocity)}
          onMute={() => toggleMute(track.id)}
          onSolo={() => toggleSolo(track.id)}
        />
      ))}
    </div>
  );
}
