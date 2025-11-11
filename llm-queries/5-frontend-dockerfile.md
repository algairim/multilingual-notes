# LLM Query

Produce a complete `frontend/Dockerfile` file that assembles frontend.

# LLM Response

Here is a complete, production-ready `backend/Dockerfile` that uses a multi-stage build to create a minimal, secure image for your NestJS application.

Save this file as `Dockerfile` inside the `backend/` directory.

Here is a complete, production-ready `frontend/Dockerfile` that assembles and serves your Vite + React application using a secure, multi-stage build.

Save this file as `Dockerfile` inside the `frontend/` directory.

### Dockerfile for Frontend (Vite + React)

```dockerfile
# =================
# Stage 1: Builder
# =================
# This stage installs dependencies and builds the static React assets
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock, etc.)
# This is done first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Pass build-time arguments (from docker-compose.yml)
ARG VITE_API_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID

# Set them as environment variables for the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID

# Build the production-ready static files
RUN npm run build

# =================
# Stage 2: Production
# =================
# This stage serves the built static assets using Nginx
FROM nginx:1.27-alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file from this Dockerfile
# (See the 'nginx.conf' content below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static assets from the 'builder' stage
# The output of a Vite build is typically in the 'dist' folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (default HTTP port)
EXPOSE 80

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

```

-----

### 📄 Required `nginx.conf`

The `Dockerfile` above refers to a file named `nginx.conf`. You must create this file in the **same `frontend/` directory**.

This configuration is essential for a React application. It tells Nginx to serve static files (like CSS, JS, images) directly, but for any other route (like `/dashboard` or `/login`), it serves the `index.html` file. This allows React Router to take over and handle client-side navigation.

**Create this file:** `frontend/nginx.conf`

```nginx
server {
  listen 80;
  server_name localhost;

  # Root directory for the static files
  root /usr/share/nginx/html;
  index index.html index.htm;

  # Serve static assets directly
  location ~ \.(css|js|png|jpg|jpeg|gif|ico|svg|json|woff|woff2|ttf|eot)$ {
    try_files $uri $uri/ =404;
  }

  # Handle client-side routing (React Router)
  # For any request that is not a file, serve index.html
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Summary of Files

To be clear, you will have two new files in your `frontend/` directory:

1.  `frontend/Dockerfile` (the first code block)
2.  `frontend/nginx.conf` (the second code block)
