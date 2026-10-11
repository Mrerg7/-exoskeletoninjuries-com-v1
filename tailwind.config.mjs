/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        card: "var(--card)",
        ink: "var(--ink)",
        quiet: "var(--quiet)",
        rule: "var(--rule)",
        copper: "var(--copper)",
        "copper-ink": "var(--copper-ink)",
        pine: "var(--pine)",
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Iowan Old Style", "Palatino", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
