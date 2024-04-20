import defaultTheme from "tailwindcss/defaultTheme";
module.exports = {
  separator: "_",
  jit: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    daisyui: {
      themes: ["light"],
    },
    screens: {
      "2xl": { max: "1535px" },

      xl: { max: "1279px" },

      lg: { max: "1023px" },

      md: { max: "767px" },

      sm: { max: "639px" },

      xs: { max: "475px" },
    },
    colors: {
      white: "#fff",
      gray: "#808080",
      "mid-gray": "#bcbcbc",
      black: "#000",
      red: "#C90E7E",
      orange: "#FF8A00",
      yellow: "#FFD700",
      purple: "#7E57FF",
      blue: "#4BCEFA",
      green: "#00925D",
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
