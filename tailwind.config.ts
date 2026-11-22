import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        outer: "var(--bg-outer)",
        base: "var(--bg-base)",
        card: "var(--bg-card)",
        subtle: "var(--bg-subtle)",
        line: "var(--border-main)",
        ink: "var(--text-main)",
        muted: "var(--text-muted)",
        accentWarm: "var(--accent-warm)",
        accentWarmSoft: "var(--accent-warm-soft)",
        accentWarmBorder: "var(--accent-warm-border)",
        crimson: "var(--brand)",
        crimsonSoft: "var(--brand-soft)",
        crimsonBorder: "var(--brand-border)",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
