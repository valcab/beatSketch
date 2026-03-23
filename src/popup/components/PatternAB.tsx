import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBeatStore } from "@/store/beatStore";
import { ROCK_PRESETS } from "@/presets/rockPresets";

export function PatternAB() {
  const { activePattern, setActivePattern, copyPattern, applyPresetToPattern } = useBeatStore();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Pattern Split</div>
        <Badge variant="accent">Active {activePattern}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={activePattern === "A" ? "default" : "outline"} className="flex-1" onClick={() => setActivePattern("A")}>
          A
        </Button>
        <Button variant={activePattern === "B" ? "default" : "outline"} className="flex-1" onClick={() => setActivePattern("B")}>
          B
        </Button>
        <Button size="sm" variant="ghost" onClick={() => copyPattern("A", "B")}>
          <Copy className="mr-1 h-3.5 w-3.5" />
          A→B
        </Button>
        <Button size="sm" variant="ghost" onClick={() => copyPattern("B", "A")}>
          <Copy className="mr-1 h-3.5 w-3.5" />
          B→A
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-zinc-800 bg-black/20 p-2">
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Template A</div>
          <Select onValueChange={(value) => applyPresetToPattern("A", value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Choose beat" />
            </SelectTrigger>
            <SelectContent>
              {ROCK_PRESETS.map((preset) => (
                <SelectItem key={`A-${preset.name}`} value={preset.name}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-black/20 p-2">
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Template B</div>
          <Select onValueChange={(value) => applyPresetToPattern("B", value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Choose beat" />
            </SelectTrigger>
            <SelectContent>
              {ROCK_PRESETS.map((preset) => (
                <SelectItem key={`B-${preset.name}`} value={preset.name}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
