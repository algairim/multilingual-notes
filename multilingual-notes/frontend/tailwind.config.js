/** @type {import('tailwindcss').Config} */
export default {
  // Content array: Tells Tailwind where to look for class names.
  content: [
    "./index.html", // The root HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // All JS/TS/JSX/TSX files in the src folder
  ],
  theme: {
    extend: {
      // You can add custom theme extensions here
      // For example:
      // colors: {
      //   'brand-primary': '#007bff',
      // },
      // fontFamily: {
      //   'sans': ['Inter', 'system-ui', 'sans-serif'],
      // }
    },
  },
  plugins: [
    // You can add official Tailwind plugins here
    // e.g., require('@tailwindcss/forms'),
  ],
}
