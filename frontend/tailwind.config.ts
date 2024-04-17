import defaultTheme from "tailwindcss/defaultTheme";
module.exports = {
  separator: "_",
  jit: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    daisyui: {
      themes: ["light"],
    },
    colors: {
      white: "#fff",
      black: "#000",
      Red: "#C90E7E",
      orange: "#FF8A00",
      Yellow: "#FFD700",
      Purple: "#7E57FF",
      Blue: "#4BCEFA",
      Green: "#00925D",
      ...defaultTheme.colors,
    },
    flex: {
      ...defaultTheme.flex,
      "2": "2 2 0%",
      "3": "3 3 0%",
    },
  },
  plugins: [require("daisyui")],
};
