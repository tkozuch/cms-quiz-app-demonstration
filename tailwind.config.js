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
      },
      animation: {
        show: "show 135ms var(--tailwind-default-transition) forwards",
        show_long: "show 500ms var(--tailwind-default-transition) forwards",
      },
    },
  },
  plugins: [],
};
