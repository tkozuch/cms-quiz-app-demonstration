/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      keyframes: {
        show: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        correct_answer: {
          "0%": { backgroundColor: "var(--unanswered-answer)" },
          "20%": { backgroundColor: "var(--correct-answer)" },
          "40%": { backgroundColor: "var(--unanswered-answer)" },
          "60%": { backgroundColor: "var(--correct-answer)" },
          "80%": { backgroundColor: "var(--unanswered-answer)" },
          "100%": { backgroundColor: "var(--correct-answer)" },
        },
      },
      animation: {
        show: "show 135ms var(--tailwind-default-transition) forwards",
        show_long: "show 500ms var(--tailwind-default-transition) forwards",
        correct_answer: "correct_answer 700ms ease-in-out forwards 135ms",
      },
    },
  },
  plugins: [],
};
