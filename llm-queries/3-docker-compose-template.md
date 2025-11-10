# LLM Query

Produce docker compose template that utilises existing images with database and auth solution as per suggested architecture. Create all necessary env vars for each image and link necessary shared dirs to a local file system (assume docker compose template to be run from a project dir with relative paths).

# LLM Response

Here is a `docker-compose.yml` template based on the architecture we discussed, using official images for the database (PostgreSQL) and auth (Keycloak) services.

This template assumes your `backend` and `frontend` directories each contain a `Dockerfile` for building the respective app. This is the standard way to "link" local file system code into a Docker Compose setup.

### 🐳 Docker Compose Template

Save this file as `docker-compose.yml` in the root of your `multilingual-notes/` project directory.

```yaml
version: '3.9'

services:
  # 1. Database Service (PostgreSQL)
  # Uses an official existing image
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-app_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME:-multilingual_notes}
    ports:
      # Exposes Postgres on host port 5433 to avoid conflicts
      - "5433:5432"
    volumes:
      # Persists database data on the host machine using a named volume
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-app_user} -d ${DB_NAME:-multilingual_notes}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # 2. Auth Service (Keycloak)
  # Uses an official existing image for separate auth
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    restart: unless-stopped
    command: ["start-dev"]
    environment:
      # Admin user for the Keycloak UI
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN_USER}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      # Database connection (uses the 'db' service)
      KC_DB: postgres
      KC_DB_URL_HOST: db
      KC_DB_URL_DATABASE: ${DB_NAME:-multilingual_notes}
      KC_DB_USERNAME: ${DB_USER:-app_user}
      KC_DB_PASSWORD: ${DB_PASSWORD}
      # Puts Keycloak tables in a separate 'keycloak' schema
      KC_DB_SCHEMA: keycloak 
      # Hostname for accessing the Keycloak UI from your browser
      KC_HOSTNAME: localhost
    ports:
      # Exposes Keycloak admin UI
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy # Waits for db to be ready

  # 3. Backend Service (NestJS)
  # Builds from your local 'backend' directory
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      # Exposes the Node.js API
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      # Database connection string for the backend app
      DATABASE_URL: "postgresql://${DB_USER:-app_user}:${DB_PASSWORD}@db:5432/${DB_NAME:-multilingual_notes}?schema=public"
      # Keycloak settings (for validating JWTs)
      # Uses 'keycloak:8080' for internal service-to-service communication
      KEYCLOAK_AUTH_URL: http://keycloak:8080/realms/${KEYCLOAK_REALM}
      KEYCLOAK_REALM: ${KEYCLOAK_REALM}
      KEYCLOAK_CLIENT_ID: ${KEYCLOAK_CLIENT_ID}
      # External API for translation
      TRANSLATION_API_URL: ${TRANSLATION_API_URL}
    volumes:
      # [cite_start]Links a local dir for audit logs [cite: 49]
      - ./logs:/usr/src/app/logs
    depends_on:
      keycloak:
        condition: service_started
      db:
        condition: service_healthy

  # 4. Frontend Service (React + Vite)
  # Builds from your local 'frontend' directory
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      # Passes build-time arguments to Vite
      args:
        VITE_API_URL: http://localhost:3000
        VITE_KEYCLOAK_URL: http://localhost:8080
        VITE_KEYCLOAK_REALM: ${KEYCLOAK_REALM}
        VITE_KEYCLOAK_CLIENT_ID: ${KEYCLOAK_CLIENT_ID}
    restart: unless-stopped
    ports:
      # Exposes the React app
      - "8081:80"
    depends_on:
      - backend

# Defines the named volume for persisting Postgres data
volumes:
  postgres_data:
    driver: local
```

-----

### 🔑 Environment Variables (`.env`)

For this `docker-compose.yml` to work, you must create a file named `.env` in the same root directory. This file provides all the secrets.

**Do not** commit the `.env` file to Git.

```ini
# .env

# === Database Secrets ===
# Password for the 'app_user'
DB_PASSWORD=your_secret_db_password
DB_USER=app_user
DB_NAME=multilingual_notes

# === Keycloak Admin Secrets ===
# Credentials to log into http://localhost:8080
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=your_secret_admin_password

# === Keycloak App Config ===
# You must create these in the Keycloak UI
# 1. Create a realm named 'notes_realm'
# 2. Create a client named 'notes_client'
KEYCLOAK_REALM=notes_realm
KEYCLOAK_CLIENT_ID=notes_client

# === External APIs ===
# Example using the recommended public API
TRANSLATION_API_URL=https://libretranslate.de/translate
```

### Linking to Local Filesystem Explained

This template links to your local files in two ways:

1.  **Build Context:** The `build: { context: ./backend }` and `build: { context: ./frontend }` lines tell Docker Compose to look in those local directories for a `Dockerfile` and build an image from that code.
2.  **Volume Mount for Logs:** The `volumes: - ./logs:/usr/src/app/logs` line in the `backend` service directly maps a directory named `logs` from your project root into the container. This ensures any audit logs written by the app are saved directly to your host machine.