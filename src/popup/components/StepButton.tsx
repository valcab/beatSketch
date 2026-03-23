import { useState } from "react";
import { cn, velocityLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StepButtonProps {
  active: boolean;
  velocity: number;
  isCurrent: boolean;
  colorClass: string;
  isQuarter: boolean;
  onPaintStart: (nextActive: boolean) => void;
  onPaintEnter: () => void;
  onVelocityChange: (velocity: number) => void;
}

const velocityOptions = [
  { label: "pp", value: 0.3 },
  { label: "mp", value: 0.5 },
  { label: "mf", value: 0.75 },
  { label: "ff", value: 1 }
];

export function StepButton({ active, velocity, isCurrent, colorClass, isQuarter, onPaintStart, onPaintEnter, onVelocityChange }: StepButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.stopPropagation();
          onPaintStart(!active);
        }}
        onPointerEnter={() => onPaintEnter()}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (active) setOpen(true);
        }}
        className={cn(
          "relative h-4 min-w-0 rounded-[4px] border border-violet-200 bg-violet-100 transition-all touch-none",
          isQuarter && "border-violet-300 bg-violet-200/80",
          active && `${colorClass} text-white`,
          active && velocity >= 0.8 && "brightness-125 saturate-150",
          isCurrent && "ring-2 ring-violet-500/70 ring-offset-1 ring-offset-white"
        )}
        title={active ? `Velocity ${velocityLabel(velocity)}` : "Step off"}
      >
        {active ? <span className="sr-only">{velocityLabel(velocity)}</span> : null}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Velocity</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2">
            {velocityOptions.map((option) => (
              <Button
                key={option.label}
                variant={Math.abs(option.value - velocity) < 0.01 ? "default" : "secondary"}
                onClick={() => {
                  onVelocityChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
