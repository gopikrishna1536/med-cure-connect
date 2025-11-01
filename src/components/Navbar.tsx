import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Pill, Upload } from 'lucide-react';

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? (isAdmin ? '/admin' : '/catalog') : '/'} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Pill className="text-primary-foreground" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MediCare
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {!isAdmin && (
                  <>
                    <Link to="/catalog">
                      <Button variant="ghost" size="sm">
                        Medicines
                      </Button>
                    </Link>
                    <Link to="/upload-prescription">
                      <Button variant="ghost" size="sm">
                        <Upload className="mr-2" size={16} />
                        Upload Prescription
                      </Button>
                    </Link>
                    <Link to="/cart">
                      <Button variant="ghost" size="sm">
                        <ShoppingCart size={18} />
                      </Button>
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  <User size={18} className="mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
