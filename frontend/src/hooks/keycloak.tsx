import Keycloak from 'keycloak-js';

// Get environment variables
const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
const keycloakRealm = import.meta.env.VITE_KEYCLOAK_REALM;
const keycloakClientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

if (!keycloakUrl || !keycloakRealm || !keycloakClientId) {
  console.error("Keycloak environment variables are not set!");
  console.error("VITE_KEYCLOAK_URL:", keycloakUrl);
  console.error("VITE_KEYCLOAK_REALM:", keycloakRealm);
  console.error("VITE_KEYCLOAK_CLIENT_ID:", keycloakClientId);
}

const keycloak = new Keycloak({
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: keycloakClientId,
});

export default keycloak;
