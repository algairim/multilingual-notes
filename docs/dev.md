## Development

### How to run frontend outside container

Build frontend first:

```bash
cd frontend/
npm ci
npm run build
```

Then start `dev` Vite instance with the following environment variables:

```bash
export VITE_API_URL=http://localhost:3000
export VITE_KEYCLOAK_URL=http://localhost:8080
export VITE_KEYCLOAK_REALM=notes_realm
export VITE_KEYCLOAK_CLIENT_ID=notes_client
npm run dev
```

Look for URL to open in the console output.
