const colors = require("./src/theme/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        green: colors.green,
        blue: colors.blue,
        card: colors.card,
      }
    },
  },
  plugins: [],
}

