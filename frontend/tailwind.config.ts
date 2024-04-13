import defaultTheme from "tailwindcss/defaultTheme"
module.exports = {
  separator: '_',
  jit: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      "White": "#ffffff",
      "Black": "#000",
      "Blue": "#2b60f7",
      "Red": "#f65353",
      "C5f": "#5f7fff0d",
      "C4c": "#4c4c4c",
      "C4": "#c4c4c4",
      'C22': '#222222',
      'CfC6': '#fffce6',
      'Cf4': '#f4f4f4',
      'Cye': '#fd0',
      ...defaultTheme.colors

    },
    flex: {
      ...defaultTheme.flex,
      '2': '2 2 0%',
      '3': '3 3 0%'
    }
  },
  plugins: [],
}