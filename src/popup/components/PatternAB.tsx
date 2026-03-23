import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBeatStore } from "@/store/beatStore";
import { ROCK_PRESETS } from "@/presets/rockPresets";

const presetFamilies = ["Rock", "Metal", "Stoner", "Doom", "Punk", "Hardcore", "Blues", "Indie", "Prog"] as const;

export function PatternAB() {
  const { activePattern, queuedPattern, isPlaying, setActivePattern, queuePatternChange, applyPresetToPattern } = useBeatStore();

  const handlePatternSelect = (pattern: "A" | "B") => {
    if (!isPlaying) {
      setActivePattern(pattern);
      return;
    }
    if (pattern === activePattern) {
      queuePatternChange(null);
      return;
    }
    queuePatternChange(pattern);
  };

  return (
    <div className="rounded-xl border border-violet-200 bg-white/85 p-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.24em] text-violet-500">Pattern Split</div>
        <Badge variant="accent">{queuedPattern ? `Queued ${queuedPattern}` : `Active ${activePattern}`}</Badge>
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
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-violet-500">Template A</div>
          <Select onValueChange={(value) => applyPresetToPattern("A", value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Choose beat" />
            </SelectTrigger>
            <SelectContent>
              {presetFamilies.map((family, familyIndex) => (
                <SelectGroup key={`A-${family}`}>
                  <SelectLabel className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-400">{family}</SelectLabel>
                  {ROCK_PRESETS.filter((preset) => preset.family === family).map((preset) => (
                    <SelectItem key={`A-${preset.name}`} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                  {familyIndex < presetFamilies.length - 1 ? <SelectSeparator /> : null}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50/70 p-2">
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-violet-500">Template B</div>
          <Select onValueChange={(value) => applyPresetToPattern("B", value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Choose beat" />
            </SelectTrigger>
            <SelectContent>
              {presetFamilies.map((family, familyIndex) => (
                <SelectGroup key={`B-${family}`}>
                  <SelectLabel className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-400">{family}</SelectLabel>
                  {ROCK_PRESETS.filter((preset) => preset.family === family).map((preset) => (
                    <SelectItem key={`B-${preset.name}`} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                  {familyIndex < presetFamilies.length - 1 ? <SelectSeparator /> : null}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
