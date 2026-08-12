/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        term: {
          bg: "#0a0a0a",
          panel: "#111214",
          border: "#26282c",
          red: "#ff5555",
          gold: "#e6b450",
          blue: "#4a9eff",
          green: "#4ade80",
          white: "#f5f5f5",
          silver: "#9aa0a6",
          "silver-dim": "#5c6370",
        },
      },
      fontFamily: {
        mono: [
          "var(--font-jetbrains-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        scanline: "scanline 3s linear infinite",
      },
    },
  },
  plugins: [],
};
