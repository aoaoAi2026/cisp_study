/** @type {import('tailwindcss').Config} */

/** @type {import('@tailwindcss/typography')} */
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    'border-cyber-green', 'border-cyber-green/10', 'border-cyber-green/20', 'border-cyber-green/30', 'border-cyber-green/40', 'border-cyber-green/50',
    'border-cyber-red', 'border-cyber-red/10', 'border-cyber-red/20', 'border-cyber-red/30', 'border-cyber-red/40', 'border-cyber-red/50',
    'border-cyber-blue', 'border-cyber-blue/10', 'border-cyber-blue/20', 'border-cyber-blue/30', 'border-cyber-blue/40', 'border-cyber-blue/50',
    'border-cyber-gold', 'border-cyber-gold/10', 'border-cyber-gold/20', 'border-cyber-gold/30', 'border-cyber-gold/40', 'border-cyber-gold/50',
    'border-cyber-purple', 'border-cyber-purple/10', 'border-cyber-purple/20', 'border-cyber-purple/30',
    'border-cyber-cyan', 'border-cyber-cyan/10', 'border-cyber-cyan/20', 'border-cyber-cyan/30',
    'text-cyber-green', 'text-cyber-red', 'text-cyber-blue', 'text-cyber-teal', 'text-cyber-gold', 'text-cyber-purple', 'text-cyber-cyan',
    'bg-cyber-green/10', 'bg-cyber-green/20', 'bg-cyber-green/30',
    'bg-cyber-red/10', 'bg-cyber-red/20', 'bg-cyber-red/30',
    'bg-cyber-blue/10', 'bg-cyber-blue/20', 'bg-cyber-blue/30',
    'bg-cyber-gold/10', 'bg-cyber-gold/20', 'bg-cyber-gold/30',
    'bg-cyber-purple/10', 'bg-cyber-purple/20',
    'bg-cyber-cyan/10', 'bg-cyber-cyan/20',
    'bg-cyber-teal/10', 'bg-cyber-teal/20', 'bg-cyber-teal/30',
    'border-cyber-teal/10', 'border-cyber-teal/20', 'border-cyber-teal/30', 'border-cyber-teal/40', 'border-cyber-teal/50',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cyber: {
          black: "#0a0e17",
          purple: "#6b5b95",
          green: "#00ff88",
          blue: "#00d4ff",
          red: "#ff3366",
          gold: "#ffd700",
          teal: "#14b8a6",
          cyan: "#22d3ee",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        fira: ["Fira Code", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 136, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      typography: ({ theme }) => ({
        invert: {
          css: {
            "--tw-prose-body": "#d1d5db",
            "--tw-prose-headings": "#ffffff",
            "--tw-prose-links": theme("colors.cyber.green"),
            "--tw-prose-bold": "#ffffff",
            "--tw-prose-code": "#00ff88",
            "--tw-prose-pre-code": "#d1d5db",
            "--tw-prose-pre-bg": "#0a0e17",
            "--tw-prose-quotes": "#9ca3af",
            "--tw-prose-quote-borders": theme("colors.cyber.green"),
            "--tw-prose-borders": "#1f2937",
            "--tw-prose-th-borders": "#1f2937",
            "--tw-prose-td-borders": "#1f2937",
            "--tw-prose-invert-body": "#d1d5db",
            "--tw-prose-invert-headings": "#ffffff",
            "--tw-prose-invert-links": theme("colors.cyber.green"),
            "--tw-prose-invert-bold": "#ffffff",
            "--tw-prose-invert-code": "#00ff88",
            "--tw-prose-invert-pre-code": "#d1d5db",
            "--tw-prose-invert-pre-bg": "#0a0e17",
            "--tw-prose-invert-quotes": "#9ca3af",
            "--tw-prose-invert-quote-borders": theme("colors.cyber.green"),
            "--tw-prose-invert-borders": "#1f2937",
            "--tw-prose-invert-th-borders": "#1f2937",
            "--tw-prose-invert-td-borders": "#1f2937",
          },
        },
      }),
    },
  },
  plugins: [typography],
};
