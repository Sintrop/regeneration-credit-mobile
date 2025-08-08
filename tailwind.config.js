/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#1f5d38',
        green: {
          primary: "#75d63a",
          secondary: "#062c01",
          header: "#044640",
          btn: "#229b13"
        },
        blue: {
          primary: "#3e9ef5"
        },
        card: {
          primary: "#03364b",
          secondary: "#012939"
        }
      }
    },
  },
  plugins: [],
}

