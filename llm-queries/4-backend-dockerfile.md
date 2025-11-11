# LLM Query

Produce a complete `backend/Dockerfile` file that assembles backend.

# LLM Response

Here is a complete, production-ready `backend/Dockerfile` that uses a multi-stage build to create a minimal, secure image for your NestJS application.

Save this file as `Dockerfile` inside the `backend/` directory.

### Dockerfile for Backend (NestJS)

```dockerfile
# =================
# Stage 1: Builder
# =================
# This stage builds the TypeScript app into JavaScript
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# This is done first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
# Using 'npm ci' for a clean, reproducible install from package-lock.json
RUN npm ci

# Copy the rest of the source code
COPY . .

# Run the build script to compile TypeScript to dist/
RUN npm run build

# =================
# Stage 2: Production
# =================
# This stage creates the final, minimal production image
FROM node:18-alpine

WORKDIR /usr/src/app

# Create a non-root user and group for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package.json and package-lock.json
COPY package*.json ./

# Install *only* production dependencies
RUN npm ci --omit=dev

# Copy the built application from the 'builder' stage
# and set the correct ownership to the non-root user
COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist

# Switch to the non-root user
USER appuser

# Expose the port the app will run on
# This should match the PORT env var in your docker-compose.yml
EXPOSE 3000

# The command to start the application
# Assumes your NestJS app's entry point is 'dist/main.js'
CMD ["node", "dist/main.js"]
```

### Why This Dockerfile is Effective

* **Multi-Stage Build:** It uses two stages. The `builder` stage is large (it has the TypeScript compiler and `devDependencies`), but it's thrown away. The final `production` stage is minimal, containing only the compiled JavaScript and production `node_modules`.
* **Small Image Size:** Starting from `node:18-alpine` and only installing production dependencies (`--omit=dev`) keeps the final image as small as possible.
* **Security:** It runs the application as a non-root user (`appuser`), which is a critical security best practice.
* **Cache-Optimized:** It copies `package.json` and runs `npm ci` *before* copying the rest of the source code. This means Docker won't reinstall all your dependencies every time you change a single line of code—only when your dependencies (in `package.json`) change.
