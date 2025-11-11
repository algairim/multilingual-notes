# LLM Query

Generate complete backend `src` files:

```
backend/src/main.ts
backend/src/app.module.ts

backend/src/auth/auth.controller.ts
backend/src/auth/auth.service.ts
backend/src/auth/auth.module.ts
backend/src/auth/guards/jwt-auth.guard.ts

backend/src/notes/notes.controller.ts
backend/src/notes/notes.service.ts
backend/src/notes/notes.module.ts
backend/src/notes/entities/note.entity.ts

backend/src/summarise/summarise.controller.ts
backend/src/summarise/summarise.service.ts
backend/src/summarise/summarise.module.ts
backend/src/summarise/entities/note-summary.entity.ts

backend/src/translate/translate.controller.ts
backend/src/translate/translate.service.ts
backend/src/translate/translate.module.ts
backend/src/translate/entities/note-translation.entity.ts

backend/src/audit/audit.listener.ts
backend/src/audit/audit.module.ts
backend/src/audit/entities/audit-log.entity.ts

backend/src/user/entities/user.entity.ts
```

# LLM Response

This is a large set of files. I've generated all 21 src files for your NestJS backend, following the "simple email/password + JWT" authentication model from the PDF, which aligns with the specified API endpoints like POST /auth/register.

To respect your exact file list, I've made two important decisions:

1. DTOs: Classes for validation (like CreateNoteDto) are defined inside the controller files that use them, as dto files were not specified. 
2. JwtStrategy: This critical class, required by JwtAuthGuard, is defined and provided inside auth.module.ts to avoid creating an extra file.

Here are all the files for the backend/src/ directory.

(attached)
