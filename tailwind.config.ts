import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./popup.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        pedal: {
          bg: "#09090b",
          panel: "#111114",
          edge: "#25252b",
          glow: "#f97316"
        }
      },
      boxShadow: {
        pedal: "0 0 0 1px rgba(255,255,255,0.05), 0 14px 40px rgba(0,0,0,0.45)"
      },
      keyframes: {
        pulsebar: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.8" }
        }
      },
      animation: {
        pulsebar: "pulsebar 1.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
