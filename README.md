# Multilingual Notes App

Multilingual Notes, Global Voices Ltd.

This project is a full-stack application featuring a React frontend, a NestJS backend, and a Keycloak
instance for authentication, all managed with Docker Compose.

## How to Run the Application

First, ensure you have Docker and Docker Compose installed. Create a `.env` file in the project root,
using `.env.example` as a template, to provide the necessary secrets. To build and start all services
(including a pre-configured Keycloak realm and a sample user), you must first **clean any old data
volumes** to ensure the Keycloak realm is imported correctly. Run `docker compose down -v` to remove
persistent data, then run `docker compose up --build`. The application will be available at
http://localhost:8081, and the Keycloak admin console at http://localhost:8080.

## How to Run the Demo Script

Once the Docker containers are running, you can use the demo.sh script to test the backend API.
This script bypasses the browser login and authenticates directly with Keycloak as the pre-configured
user. First, make the script executable by running `chmod +x scripts/demo.sh`. Then, execute it with
`./scripts/demo.sh`. 

The script will obtain a JWT access token from Keycloak, create a new note, list all notes, request
a summary and translation, and then delete the note, printing its progress at each step.

## Assumptions

TODO...

## LLM analysis

See [LLM queries](docs) used for initial analysis, design drafts and generated code.

## Development

Refer to [dev guide](./docs/dev.md) for detailed development instructions.
