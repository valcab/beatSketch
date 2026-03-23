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
          bg: "#f8f5ff",
          panel: "#ffffff",
          edge: "#d9d0ef",
          glow: "#8b5cf6"
        }
      },
      boxShadow: {
        pedal: "0 0 0 1px rgba(91,33,182,0.08), 0 18px 40px rgba(91,33,182,0.12)"
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
