import type { Config } from "tailwindcss";
import tokens from "./DESIGN.tokens.json";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: tokens.colors.background,
        foreground: tokens.colors.foreground,
        accent: tokens.colors.accent,
        "accent-foreground": tokens.colors["accent-foreground"],
        border: tokens.colors.border,
        muted: tokens.colors.muted,
        "muted-foreground": tokens.colors["muted-foreground"],
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: tokens.radii,
      maxWidth: {
        editorial: tokens.spacing.editorial,
        container: tokens.spacing.container,
      },
      spacing: {
        section: tokens.spacing.section,
      },
    },
  },
  plugins: [],
};

export default config;
