import { LoaderCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { PRESET_FAMILIES, ROCK_PRESETS } from "@/presets/rockPresets";
import { useBeatStore } from "@/store/beatStore";

export function PatternAB() {
  const {
    activePattern,
    queuedPattern,
    activeFill,
    fillModeEnabled,
    isPlaying,
    patterns,
    setActivePattern,
    setFillModeEnabled,
    queuePatternChange,
    applyPresetToPattern
  } = useBeatStore();

  const patternA = patterns.find((pattern) => pattern.id === "A");
  const patternB = patterns.find((pattern) => pattern.id === "B");

  const handlePatternSelect = (pattern: "A" | "B") => {
    if (!isPlaying) {
      setActivePattern(pattern);
      return;
    }

    if (queuedPattern === pattern) {
      queuePatternChange(null);
      return;
    }

    if (pattern !== activePattern) {
      queuePatternChange(pattern);
    }
  };

  const statusLabel = activeFill
    ? `${activeFill.sourcePattern} outro fill (${activeFill.fill.repeats}x) -> ${activeFill.targetPattern}`
    : queuedPattern
      ? fillModeEnabled
        ? `${activePattern} will end with fill -> ${queuedPattern}`
        : `Queued ${queuedPattern}`
      : `Active ${activePattern}`;

  return (
    <div className="rounded-xl border border-violet-200 bg-white/85 p-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs uppercase tracking-[0.24em] text-violet-500">Pattern Split</div>
        <Badge variant="accent">{statusLabel}</Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={activePattern === "A" && !queuedPattern ? "default" : "outline"}
          className="flex-1"
          onClick={() => handlePatternSelect("A")}
        >
          {queuedPattern === "A" ? <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
          A
        </Button>

        <Toggle
          pressed={fillModeEnabled}
          onPressedChange={setFillModeEnabled}
          className="min-w-0 shrink-0 gap-1 rounded-md border-violet-200 px-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700 data-[state=on]:border-violet-500 data-[state=on]:bg-violet-100"
          aria-label="Toggle fills between pattern changes"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Fill
        </Toggle>

        <Button
          variant={activePattern === "B" && !queuedPattern ? "default" : "outline"}
          className="flex-1"
          onClick={() => handlePatternSelect("B")}
        >
          {queuedPattern === "B" ? <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
          B
        </Button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-violet-200 bg-violet-50/70 p-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-violet-500">Template A</div>
            <div className="truncate text-[10px] text-violet-400">{patternA?.presetName ?? "Custom"}</div>
          </div>
          <Select value={patternA?.presetName} onValueChange={(value) => applyPresetToPattern("A", value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Choose beat" />
            </SelectTrigger>
            <SelectContent>
              {PRESET_FAMILIES.map((family, familyIndex) => (
                <SelectGroup key={`A-${family}`}>
                  <SelectLabel className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-400">{family}</SelectLabel>
                  {ROCK_PRESETS.filter((preset) => preset.family === family).map((preset) => (
                    <SelectItem key={`A-${preset.name}`} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                  {familyIndex < PRESET_FAMILIES.length - 1 ? <SelectSeparator /> : null}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-violet-200 bg-violet-50/70 p-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-violet-500">Template B</div>
            <div className="truncate text-[10px] text-violet-400">{patternB?.presetName ?? "Custom"}</div>
          </div>
          <Select value={patternB?.presetName} onValueChange={(value) => applyPresetToPattern("B", value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Choose beat" />
            </SelectTrigger>
            <SelectContent>
              {PRESET_FAMILIES.map((family, familyIndex) => (
                <SelectGroup key={`B-${family}`}>
                  <SelectLabel className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-400">{family}</SelectLabel>
                  {ROCK_PRESETS.filter((preset) => preset.family === family).map((preset) => (
                    <SelectItem key={`B-${preset.name}`} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                  {familyIndex < PRESET_FAMILIES.length - 1 ? <SelectSeparator /> : null}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
