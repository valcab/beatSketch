import { Button } from "@/components/ui/button";
import { useBeatStore } from "@/store/beatStore";
import { TrackRow } from "./TrackRow";

export function Sequencer() {
  const {
    tracks,
    currentStep,
    steps,
    selectedTrackId,
    setSteps,
    setSelectedTrackId,
    toggleStep,
    setVelocity,
    toggleMute,
    toggleSolo
  } = useBeatStore();

  return (
    <div className="space-y-2">
      <div className="sticky top-0 z-10 rounded-xl border border-zinc-900 bg-black/80 p-2 backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Sequencer Grid</div>
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
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Track</div>
          {Array.from({ length: steps }, (_, index) => (
            <div
              key={index}
              className={`text-center text-[10px] font-mono ${index % Math.max(1, steps / 4) === 0 ? "text-zinc-200" : "text-zinc-600"}`}
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
          selected={track.id === selectedTrackId}
          onSelect={() => setSelectedTrackId(track.id)}
          onToggleStep={(index) => toggleStep(track.id, index)}
          onSetVelocity={(index, velocity) => setVelocity(track.id, index, velocity)}
          onMute={() => toggleMute(track.id)}
          onSolo={() => toggleSolo(track.id)}
        />
      ))}
    </div>
  );
}
