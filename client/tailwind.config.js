/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minHeight: {
        "screen-minus-topbar": "calc(100vh - 56px)",
      },
      height: {
        "screen-minus-topbar": "calc(100vh - 56px)",
      },
      width: {
        figure: "calc(100vw-578px)",
        input: "410px",
        sidebar: "136px",
      },
      minWidth: {
        input: "410px",
        sidebar: "136px",
      },
      maxWidth: {
        input: "410px",
      },
    },
  },
  plugins: [],
};
