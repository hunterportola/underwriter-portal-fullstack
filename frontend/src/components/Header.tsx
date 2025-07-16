import { NavLink, useNavigate } from "react-router-dom";
import { Button } from './Button';
// import { useAuth } from '../contexts/AuthContext';
// import { signOut } from '../lib/auth';
import { cn } from "../utils";

export function Header() {
  // const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Placeholder values for a logged-in state
  const isAuthenticated = true;
  const isLoading = false;

  const handleLogout = async () => {
    try {
      // await signOut();
      console.log("Signing out...");
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-sand sticky top-0 z-50">
      <div className="px-4 pt-4 pb-3">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-16">
            <p className="font-serif font-bold text-xl text-portola-green">Borrower Portal</p>
            
            {isAuthenticated && (
              <div className="flex items-center gap-6">
                <NavLink to="/borrower-profile">
                  {({ isActive }) => (
                    <Button variant="ghost" className={cn(isActive && "font-bold", "hover:bg-pebble", "font-sans")}>Profile</Button>
                  )}
                </NavLink>
                <NavLink to="/my-loan">
                   {({ isActive }) => (
                    <Button variant="ghost" className={cn(isActive && "font-bold", "hover:bg-pebble", "font-sans")}>My Loan</Button>
                  )}
                </NavLink>
                <NavLink to="/activity">
                   {({ isActive }) => (
                    <Button variant="ghost" className={cn(isActive && "font-bold", "hover:bg-pebble", "font-sans")}>Activity</Button>
                  )}
                </NavLink>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-portola-green"></div>
            ) : isAuthenticated ? (
              <>
                <Button variant="success" size="md">Apply for a new loan</Button>
                <Button 
                  onClick={handleLogout}
                  variant="pebble-outline" 
                  size="md"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="md"
                  className="text-steel border-steel hover:bg-pebble"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  size="md"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
      <div className="w-full h-px bg-burnished-brass opacity-50"></div>
    </header>
  );
}