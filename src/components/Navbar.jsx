import { Link } from 'react-router-dom';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Search, User, LogOut, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ user, showAuthModal, setShowAuthModal }) => {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error.message.includes('Firebase not configured')) {
        alert('Please set up Firebase first. Check the console for instructions.');
      } else {
        console.error('Error signing in:', error);
        alert('Error signing in. Please try again.');
      }
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        if (authData.password !== authData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await createUserWithEmailAndPassword(auth, authData.email, authData.password);
      } else {
        await signInWithEmailAndPassword(auth, authData.email, authData.password);
      }
      setShowAuthModal(false);
      setAuthData({ email: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      if (error.message.includes('Firebase not configured')) {
        alert('Please set up Firebase first. Check the console for instructions.');
      } else {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
      }
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Search className="h-6 sm:h-8 w-6 sm:w-8 text-primary-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">Campus Lost & Found</span>
          </Link>

          <div className="hidden sm:flex items-center space-x-4">
            <Link to="/items" className="text-gray-700 hover:text-primary-600 transition-colors hidden md:block">
              View All Items
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/post" className="btn-primary">
                  Post Item
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 btn-primary"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              </>
            )}
          </div>
        </div>
        

      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
            
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  className="input-field"
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authData.confirmPassword}
                    onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                    className="input-field"
                    placeholder="••••••••"
                    minLength="6"
                  />
                </div>
              )}
              
              {authError && (
                <div className="text-red-600 text-sm text-center">
                  {authError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={authLoading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {authLoading ? 'Loading...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
            
            <div className="mt-4">
              <div className="text-center text-gray-500 text-sm mb-4">or</div>
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setAuthError('');
                  setAuthData({ email: '', password: '', confirmPassword: '' });
                }}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                  setAuthData({ email: '', password: '', confirmPassword: '' });
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
