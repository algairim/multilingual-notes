import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.tsx';
import Button from '../ui/Button.tsx';

const Header = () => {
  const auth = useAuth();

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <span className="text-xl font-bold">Multilingual Notes</span>
        </div>
        <div className="flex items-center space-x-4">
          {!auth.initialized ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : auth.keycloak?.authenticated ? (
            <>
              <div className="hidden items-center space-x-2 sm:flex">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">
                  {auth.keycloak.tokenParsed?.email || 'User'}
                </span>
              </div>
              <Button
                onClick={() => auth.keycloak?.logout()}
                variant="outline" // Fix: Changed "secondary" to "outline"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => auth.keycloak?.login()}
              variant="outline" // Fix: Changed "secondary" to "outline"
            >
              Login
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
