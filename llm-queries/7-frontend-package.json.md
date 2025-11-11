# LLM Query

Generate a complete `frontend/package.json` file.

# LLM Response

Here is a complete `frontend/package.json` file tailored for your Vite + React + Tailwind + Keycloak project.

It includes:

* **Vite, React, and TypeScript** as the core.
* **Tailwind CSS** dependencies (`tailwindcss`, `postcss`, `autoprefixer`).
* **`axios`** for making API calls to your backend.
* **`react-router-dom`** for handling the Login, Register, and Dashboard pages.
* **`keycloak-js`** as the official Keycloak adapter to manage the authentication flow.
* **`react-hook-form`** and **`zod`** for powerful, client-side form validation.
* **`vitest`** and **`@testing-library/react`** for running the UI tests.
* **`lucide-react`** as a lightweight, clean icon library that pairs well with Tailwind.

### `frontend/package.json`

```json
{
  "name": "multilingual-notes-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "axios": "^1.6.2",
    "keycloak-js": "^24.0.1",
    "lucide-react": "^0.309.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.2",
    "react-router-dom": "^6.21.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.6",
    "@testing-library/react": "^14.1.2",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "jsdom": "^23.2.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vitest": "^1.1.3"
  }
}
```
