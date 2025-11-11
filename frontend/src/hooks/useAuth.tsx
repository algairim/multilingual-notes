import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import keycloak from './keycloak.tsx'; // Re-added .tsx extension
import { KeycloakInstance } from 'keycloak-js';
import api from '../services/api.ts'; // Re-added .ts extension

interface AuthContextType {
  keycloak: KeycloakInstance;
  initialized: boolean;
  user: AuthUser | null;
}

// This is the user profile we parse from the token
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'login-required', // This will auto-redirect to login
          checkLoginIframe: false,
        });

        if (authenticated) {
          // Set the token for all api requests
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${keycloak.token}`;

          // Set token refresh interceptor
          keycloak.onTokenExpired = () => {
            keycloak.updateToken(5).then((refreshed) => {
              if (refreshed) {
                api.defaults.headers.common[
                  'Authorization'
                ] = `Bearer ${keycloak.token}`;
              }
            });
          };

          // Parse user info from token
          if (keycloak.tokenParsed) {
            setUser({
              id: keycloak.tokenParsed.sub ?? 'unknown-user-id', // Fix: Provide fallback
              email: keycloak.tokenParsed.email ?? 'unknown-email', // Fix: Provide fallback
              name: keycloak.tokenParsed.name ?? 'Unknown User', // Fix: Provide fallback
            });
          }
        }
      } catch (error) {
        console.error('Keycloak init failed', error);
      } finally {
        setInitialized(true);
      }
    };

    initKeycloak();
  }, []);

  const value = {
    keycloak,
    initialized,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
