# LLM Query

Generate complete frontend `src` files:

```
frontend/src/main.tsx
frontend/src/App.tsx
frontend/src/index.css

frontend/src/components/layout/Header.tsx
frontend/src/components/notes/NotesList.tsx
frontend/src/components/notes/CreateNoteForm.tsx
frontend/src/components/notes/SummaryModal.tsx
frontend/src/components/ui/Button.tsx
frontend/src/components/ui/Input.tsx
frontend/src/components/ui/Modal.tsx

frontend/src/pages/Login.tsx
frontend/src/pages/Register.tsx
frontend/src/pages/Dashboard.tsx

frontend/src/services/api.ts
frontend/src/services/notes.service.ts
frontend/src/hooks/useAuth.ts

frontend/src/tests/create-note.spec.ts

frontend/vite.config.ts
```

# LLM Response

Here are the complete src files for your frontend application. I have built them to work together, incorporating routing, authentication, API services, and all the UI components mentioned in your file list.

This setup uses:

* Vite, React, and TypeScript. 
* react-router-dom for page navigation. 
* useAuth hook (React Context) for global auth management. 
* axios with an interceptor (in api.ts) to automatically add auth tokens. 
* react-hook-form and zod for client-side form validation. 
* Tailwind CSS for all styling.

Here are all the files for the frontend/src/ directory.

(attached)
