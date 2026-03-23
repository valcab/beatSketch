import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const velocityLabel = (velocity: number) => {
  if (velocity <= 0.35) return "pp";
  if (velocity <= 0.55) return "mp";
  if (velocity <= 0.8) return "mf";
  return "ff";
};
