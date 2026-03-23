import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { cn } from "@/lib/utils";

import "overlayscrollbars/overlayscrollbars.css";

interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
}

export function ScrollArea({ className, children }: ScrollAreaProps) {
  return (
    <OverlayScrollbarsComponent
      defer
      options={{
        scrollbars: {
          autoHide: "scroll",
          autoHideDelay: 300,
          theme: "os-theme-dark"
        },
        overflow: {
          x: "hidden",
          y: "scroll"
        }
      }}
      className={cn("h-full w-full", className)}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
