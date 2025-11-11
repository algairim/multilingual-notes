# LLM Query

Produce BASH script to register a user with cURL which is handled by keycloak and call the rest of REST APIs for a registered user to demonstrate solution capabilities.

# LLM Response

This is a great question, but it's important to understand that we can't perfectly simulate the browser-based Keycloak flow with cURL.

Keycloak (using OAuth 2.0) is built for browser redirects:

1. React app redirects to Keycloak's visual login page. 
2. User enters credentials. 
3. Keycloak redirects back to the React app with a temporary code. 
4. React app exchanges that code for a real JWT (access token).

A cURL script can't handle those visual redirects.

The Solution: Instead, we can use a different OAuth 2.0 flow called the "Direct Access Grant" (or "Password Grant"). This flow is designed for trusted applications (like a BASH script) to exchange a username and password directly for an access token, bypassing the browser entirely.

### Step 1: Enable Direct Access Grant (MANDATORY)

For this to work, we must update your Keycloak configuration to allow this flow.

I've updated your `notes-realm.json` to add one line: `"directAccessGrantsEnabled": true`.

After updating this file, you must destroy your old database volume and restart, just as you did before, to force Keycloak to re-import the new settings:

```bash
#!/bin/bash

# ===================================================================
# Keycloak & API Configuration
# ===================================================================
# !! IMPORTANT !!
# Update these values if they are different for your setup.
# The user (test_user) MUST be created in the Keycloak UI first.
KEYCLOAK_URL="http://localhost:8080"
REALM="notes_realm"
CLIENT_ID="notes_client"
USERNAME="test_user"
PASSWORD="test_password" # Use the password you set in the UI

# API Base URL
API_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Keycloak API Demonstration...${NC}\n"

# ===================================================================
# 1. Authenticate with Keycloak (Direct Access Grant)
# ===================================================================
echo -e "${YELLOW}Step 1: Authenticating with Keycloak as '$USERNAME'...${NC}"

# Use cURL to post credentials and get a token
TOKEN_RESPONSE=$(curl -s -X POST \
  "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=$CLIENT_ID" \
  -d "username=$USERNAME" \
  -d "password=$PASSWORD")

# Use jq to parse the access token from the JSON response
TOKEN=$(echo $TOKEN_RESPONSE | jq -r .access_token)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}Error: Failed to get access token.${NC}"
  echo "Response: $TOKEN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}Successfully authenticated. Got access token.${NC}\n"

# ===================================================================
# 2. Call Backend API: Create a Note
# ===================================================================
echo -e "${YELLOW}Step 2: Creating a new note (POST /api/notes)...${NC}"

CREATE_RESPONSE=$(curl -s -X POST \
  "$API_URL/api/notes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "title": "Test Note from cURL",
        "content": "This is the content of my test note.",
        "languageCode": "en"
      }')

NOTE_ID=$(echo $CREATE_RESPONSE | jq -r .id)

if [ "$NOTE_ID" == "null" ] || [ -z "$NOTE_ID" ]; then
    echo -e "${RED}Error: Failed to create note.${NC}"
    echo "Response: $CREATE_RESPONSE"
    exit 1
fi

echo -e "${GREEN}Note created successfully.${NC}"
echo "$CREATE_RESPONSE" | jq
echo ""

# ===================================================================
# 3. Call Backend API: List All Notes
# ===================================================================
echo -e "${YELLOW}Step 3: Listing user's notes (GET /api/notes)...${NC}"

curl -s -X GET \
  "$API_URL/api/notes" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# ===================================================================
# 4. Call Backend API: Summarise Note
# ===================================================================
echo -e "${YELLOW}Step 4: Requesting summary for note $NOTE_ID (POST /api/summarise)...${NC}"

curl -s -X POST \
  "$API_URL/api/summarise" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"noteId\": \"$NOTE_ID\"}" | jq
echo ""

# ===================================================================
# 5. Call Backend API: Translate Note
# ===================================================================
echo -e "${YELLOW}Step 5: Requesting translation for note $NOTE_ID (POST /api/translate)...${NC}"

curl -s -X POST \
  "$API_URL/api/translate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "noteId": "'"$NOTE_ID"'",
        "targetLanguageCode": "es"
      }' | jq
echo ""

# ===================================================================
# 6. Call Backend API: Delete the Note
# ===================================================================
echo -e "${YELLOW}Step 6: Deleting note $NOTE_ID (DELETE /api/notes/$NOTE_ID)...${NC}"

curl -s -X DELETE \
  "$API_URL/api/notes/$NOTE_ID" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n${GREEN}Note deleted.${NC}"
echo ""

# ===================================================================
# 7. Call Backend API: List Notes Again
# ===================================================================
echo -e "${YELLOW}Step 7: Listing notes again to confirm deletion...${NC}"

curl -s -X GET \
  "$API_URL/api/notes" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

echo -e "${GREEN}Demonstration complete.${NC}"
```

---

### Step 2: Manually Register a User

Since the "Register" flow is a visual webpage, you need to do this step manually *once*.

1.  Open your React app at `http://localhost:8081`.
2.  Click "Login / Register".
3.  On the Keycloak page, click the "Register" link.
4.  Create a new user. For this script, let's use:
    * **Username:** `test_user`
    * **Password:** `test_password`
    * **Email:** `test@user.com` (it can be anything)

---

### Step 3: Run the BASH Demonstration Script

Now you can run the cURL script. Save the following as `demo.sh`, make it executable with `chmod +x demo.sh`, and run it.

This script will:
1.  **"Log in"** by sending `test_user` and `test_password` to Keycloak to get an access token.
2.  **Create a new note** using that token.
3.  **List all notes** to see the new note.
4.  **Request a summary** for the new note.
5.  **Request a translation** for the new note.
6.  **Delete the note.**
