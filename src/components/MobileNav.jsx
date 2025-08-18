import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Home, Search, Plus, User, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';

const MobileNav = ({ user, onShowAuth }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="mobile-nav sm:hidden">
      <div className="flex">
        <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link to="/items" className={`mobile-nav-item ${isActive('/items') ? 'active' : ''}`}>
          <Search className="h-5 w-5 mb-1" />
          <span>Browse</span>
        </Link>
        
        {user ? (
          <Link to="/post" className={`mobile-nav-item ${isActive('/post') ? 'active' : ''}`}>
            <Plus className="h-5 w-5 mb-1" />
            <span>Post</span>
          </Link>
        ) : (
          <div className="mobile-nav-item opacity-50">
            <Plus className="h-5 w-5 mb-1" />
            <span>Post</span>
          </div>
        )}
        
        {user ? (
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="mobile-nav-item relative"
          >
            <User className="h-5 w-5 mb-1" />
            <span>Profile</span>
            {showUserMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px]">
                <div className="text-xs text-gray-600 mb-2 truncate">{user.email}</div>
                <button
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      setShowUserMenu(false);
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                  className="flex items-center space-x-2 text-red-600 text-sm w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </button>
        ) : (
          <button 
            onClick={onShowAuth}
            className="mobile-nav-item"
          >
            <LogIn className="h-5 w-5 mb-1" />
            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
