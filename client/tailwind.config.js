/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ui: ["'IBM Plex Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "'Cascadia Code'", "monospace"],
      },
      colors: {
        surface: {
          root: "#08090b",
          DEFAULT: "#0d0f12",
          panel: "#131619",
          input: "#171b20",
          elevated: "#1c2028",
          hover: "#222830",
        },
        accent: {
          dim: "#1a3a2a",
          muted: "#1b4d36",
          DEFAULT: "#22c55e",
          bright: "#4ade80",
        },
        border: {
          subtle: "#1e2530",
          DEFAULT: "#2a3040",
        },
      },
      minHeight: {
        "screen-minus-topbar": "calc(100vh - 48px)",
      },
      height: {
        "screen-minus-topbar": "calc(100vh - 48px)",
      },
      width: {
        figure: "calc(100vw - 578px)",
        input: "420px",
        sidebar: "200px",
      },
      minWidth: {
        input: "420px",
        sidebar: "200px",
      },
      maxWidth: {
        input: "420px",
      },
    },
  },
  plugins: [],
};
