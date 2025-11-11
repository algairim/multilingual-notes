# LLM Query

Generate a complete `frontend/tailwind.config.js` file.

# LLM Response

Here is a complete `frontend/tailwind.config.js` file, set up for a Vite + React project.

This configuration tells Tailwind to scan all your `.tsx`, `.ts`, `.jsx`, `.js`, and `.html` files within the `src/` directory to find and include all the utility classes you use.

Save this as `tailwind.config.js` in your `frontend/` directory.

### `frontend/tailwind.config.js`

```js
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
```
