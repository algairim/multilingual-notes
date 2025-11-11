# LLM Query

Suggest pre-init script or bash command for docker compose to run to create keycloak realm and client ID as per guideline.

```
# === Keycloak App Config ===
# You must create these in the Keycloak UI
# 1. Create a realm named 'notes_realm'
# 2. Create a client named 'notes_client'
KEYCLOAK_REALM=notes_realm
KEYCLOAK_CLIENT_ID=notes_client
```

# LLM Response

Automating the Keycloak setup is a great idea and a standard practice for creating reproducible environments.

The best way to do this is to use Keycloak's "Realm Import" feature. Instead of running bash scripts, we can provide a JSON file that declaratively defines your realm and client. Keycloak will automatically import this file when it starts up with an empty database.

Here is the plan:

1. Create a Realm JSON file: We'll create a file that defines notes_realm and notes_client. 
2. Update docker-compose.yml: We will tell the keycloak service to find and import this file. 
3. Clean up: This new method makes your init-keycloak-schema.sql script unnecessary, so we'll remove it for a cleaner setup.

### Step 1: Create the Keycloak Realm Configuration File

First, create a new directory docker/keycloak/ to hold this file.

```bash
mkdir -p docker/keycloak
```

Now, create the file notes-realm.json inside that new directory with the following content. This file defines your realm, your client (notes_client), and configures it as a "public" client (perfect for your React app) with the correct localhost:8081 redirect paths.

```json
{
  "realm": "notes_realm",
  "id": "notes_realm",
  "enabled": true,
  "registrationAllowed": true,
  "passwordPolicy": "length(8) and digits(1) and specialChars(1) and upperCase(1) and lowerCase(1) and notUsername(undefined)",
  "clients": [
    {
      "clientId": "notes_client",
      "enabled": true,
      "publicClient": true,
      "directAccessGrantsEnabled": false,
      "standardFlowEnabled": true,
      "redirectUris": [
        "http://localhost:8081/*"
      ],
      "webOrigins": [
        "http://localhost:8081"
      ]
    }
  ]
}
```

### Step 2: Update Your docker-compose.yml

Now, let's edit your docker-compose.yml to use this new file and remove the parts we no longer need.

