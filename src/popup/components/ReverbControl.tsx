import { Waves } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ReverbType } from "@/types/beat.types";

interface ReverbControlProps {
  value: number;
  type: ReverbType;
  onChange: (value: number) => void;
  onTypeChange: (value: ReverbType) => void;
}

export function ReverbControl({ value, type, onChange, onTypeChange }: ReverbControlProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1">
      <Waves className="h-3.5 w-3.5 text-zinc-400" />
      <div className="w-16">
        <Select value={type} onValueChange={(next) => onTypeChange(next as ReverbType)}>
          <SelectTrigger className="h-7 border-none bg-transparent px-1 text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="room">Room</SelectItem>
            <SelectItem value="hall">Hall</SelectItem>
            <SelectItem value="plate">Plate</SelectItem>
            <SelectItem value="none">Off</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Slider value={[value]} max={100} step={1} onValueChange={(next) => onChange(next[0] ?? 0)} />
    </div>
  );
}
