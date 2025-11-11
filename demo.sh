#!/bin/bash

# ===================================================================
# Keycloak & API Configuration
# ===================================================================
# !! IMPORTANT !!
# Update these values if they are different for your setup.
KEYCLOAK_URL="http://localhost:8080"
REALM="notes_realm"
CLIENT_ID="notes_client"
USERNAME="demo"
PASSWORD="Passw0rd!" # Use the password you set in the UI

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

set -e # Exit immediately if a command exits with a non-zero status.

# --- ⚙️ Configuration ---
# Set your Keycloak admin credentials
ADMIN_USER="admin"
ADMIN_PASS="secret_admin_password" # <-- IMPORTANT: Change this!

# Set your Keycloak instance details
REALM_NAME="notes_realm"

# --- End Configuration ---

# 1. Get Admin Access Token
echo -e "${YELLOW}Step 0: Registering '$USERNAME' in Keycloak '$REALM_NAME' realm if it does not exist...${NC}"

echo "🔐 Retrieving admin access token from master realm..."

# We use jq to parse the JSON response and extract the access_token
ACCESS_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -d "client_id=admin-cli" \
  -d "username=$ADMIN_USER" \
  -d "password=$ADMIN_PASS" \
  -d "grant_type=password" | jq -r '.access_token')

# Check if the token was successfully retrieved
if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" == "null" ]; then
  echo "❌ Error: Failed to retrieve access token. Check admin credentials."
  exit 1
fi

echo "✅ Token retrieved successfully."

# 2. Create the New User if does not exist
echo "👤 Checking if user '$USERNAME' exists in realm '$REALM_NAME'..."

# We use 'jq . | length' to count how many items are in the returned JSON array.
# If the user exists, the count will be 1. If not, it will be 0.
USER_COUNT=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$USERNAME&exact=true" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '. | length')

# Check the count
if [ "$USER_COUNT" -gt 0 ]; then
  echo "✅ User '$USERNAME' was found in realm '$REALM_NAME'."
else
  echo "❌ User '$USERNAME' does not exist."

  # Define the new user you want to create
  NEW_USER_USERNAME="$USERNAME"
  NEW_USER_EMAIL="$USERNAME@example.com"
  NEW_USER_PASSWORD="$PASSWORD"
  echo "👤 Attempting to create user '$NEW_USER_USERNAME' in realm '$REALM_NAME'..."

  # Make the API call to create the user, passing the ACCESS_TOKEN as a Bearer token.
  # Note the syntax for embedding shell variables inside the JSON payload.
  # We use -f (fail) so curl will exit with an error if the HTTP request fails (e.g., 401, 409)
  CREATE_RESPONSE=$(curl -s -f -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
          "username": "'"$NEW_USER_USERNAME"'",
          "email": "'"$NEW_USER_EMAIL"'",
          "firstName": "Demo",
          "lastName": "User",
          "enabled": true,
          "credentials": [
            {
              "type": "password",
              "value": "'"$NEW_USER_PASSWORD"'",
              "temporary": false
            }
          ],
          "emailVerified": true,
          "requiredActions": []
        }')

  # $? checks the exit code of the last command (curl)
  if [ $? -eq 0 ]; then
    echo "🎉 Success! User '$NEW_USER_USERNAME' created in realm '$REALM_NAME'."
  else
    echo "❌ Error: Failed to create user."
    echo "Response from server:"
    echo "$CREATE_RESPONSE"
    exit 1
  fi
fi

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
