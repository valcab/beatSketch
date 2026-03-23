import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { listSavedBeats, removeSavedBeat } from "@/popup/lib/storage";
import { useBeatStore } from "@/store/beatStore";
import type { SavedBeat } from "@/types/beat.types";

export function SaveLoadDialog() {
  const [open, setOpen] = useState(false);
  const [beats, setBeats] = useState<SavedBeat[]>([]);
  const [query, setQuery] = useState("");
  const loadSavedBeat = useBeatStore((state) => state.loadSavedBeat);

  useEffect(() => {
    if (!open) return;
    listSavedBeats().then(setBeats);
  }, [open]);

  const visible = beats.filter((beat) => beat.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Load Beat</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saved Beats</DialogTitle>
        </DialogHeader>
        <div className="mb-3 flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="h-9 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {visible.map((beat) => (
            <div key={beat.id} className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 p-2">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => {
                  loadSavedBeat(beat);
                  setOpen(false);
                }}
              >
                <div className="truncate text-sm font-medium">{beat.name}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  {beat.bpm} BPM • {beat.steps} steps • {beat.kit}
                </div>
              </button>
              <Button
                size="icon"
                variant="ghost"
                onClick={async () => {
                  await removeSavedBeat(beat.id);
                  setBeats(await listSavedBeats());
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {!visible.length ? <div className="py-10 text-center text-sm text-zinc-500">No saved beats yet.</div> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
