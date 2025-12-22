/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        // existing (keep if you actually use them)
        float: "float 6s ease-in-out infinite",

        // for rotating circular ring
        "spin-slow": "spinSlow 18s linear infinite",

        // for outer wave ripples
        wave: "wave 3s ease-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },

        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },

        wave: {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0.6",
          },
          "100%": {
            transform: "scale(1.4)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
