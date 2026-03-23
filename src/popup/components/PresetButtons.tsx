import { ROCK_PRESETS } from "@/presets/rockPresets";
import { useBeatStore } from "@/store/beatStore";
import { Button } from "@/components/ui/button";

export function PresetButtons() {
  const { tracks, setSteps, applyPresetTracks } = useBeatStore();

  return (
    <div className="grid grid-cols-2 gap-2">
      {ROCK_PRESETS.map((preset) => (
        <Button
          key={preset.name}
          variant="secondary"
          className="justify-start"
          onClick={() => {
            setSteps(preset.steps);
            const currentTracks = useBeatStore.getState().tracks;
            applyPresetTracks(preset.steps, preset.apply(currentTracks));
          }}
        >
          {preset.name}
        </Button>
      ))}
    </div>
  );
}
