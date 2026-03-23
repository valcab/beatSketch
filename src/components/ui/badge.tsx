import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", {
  variants: {
    variant: {
      default: "bg-zinc-800 text-zinc-200",
      accent: "bg-orange-500/20 text-orange-200",
      warning: "bg-amber-500/20 text-amber-200"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
