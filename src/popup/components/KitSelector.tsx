import { AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KITS, useBeatStore } from "@/store/beatStore";
import { Badge } from "@/components/ui/badge";

export function KitSelector() {
  const { kit, setKitByName, fallbackMode } = useBeatStore();

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <Select value={kit.name} onValueChange={setKitByName}>
          <SelectTrigger>
            <SelectValue placeholder="Select kit" />
          </SelectTrigger>
          <SelectContent>
            {KITS.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {fallbackMode ? (
        <Badge variant="warning" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          WAV fallback
        </Badge>
      ) : null}
    </div>
  );
}
