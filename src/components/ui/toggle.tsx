import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md border border-zinc-700 px-3 text-xs text-zinc-300 transition hover:bg-zinc-800 data-[state=on]:border-orange-500 data-[state=on]:bg-orange-500/20 data-[state=on]:text-orange-200",
      className
    )}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
