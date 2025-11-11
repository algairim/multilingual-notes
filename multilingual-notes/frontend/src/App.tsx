import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.tsx'; // Added .tsx
import Dashboard from './pages/Dashboard.tsx'; // Added .tsx
import { Loader2 } from 'lucide-react';

/**
 * A component to protect routes.
 * If the user is authenticated, it renders the child component.
 * If not, it redirects to the Keycloak login.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { keycloak, initialized } = useAuth();

  if (!initialized) {
    // Show a loading spinner while Keycloak is initializing
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!keycloak.authenticated) {
    // User is not authenticated, initiate login
    keycloak.login();
    return null; // or a loading indicator
  }

  // User is authenticated, render the requested page
  return <>{children}</>;
}

/**
 * Main App component.
 * We no longer need Login or Register routes, as Keycloak handles them.
 */
function App() {
  const { initialized } = useAuth();

  if (!initialized) {
    // Show a global loader while Keycloak initializes
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Any other public routes could go here, but we have none */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
