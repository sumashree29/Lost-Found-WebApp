import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home';
import PostItem from './pages/PostItem';
import ItemsBoard from './pages/ItemsBoard';
import ItemDetails from './pages/ItemDetails';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
        <Navbar user={user} showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
        <main className="container mx-auto px-4 py-4 sm:py-8">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/post" element={<PostItem user={user} />} />
            <Route path="/items" element={<ItemsBoard user={user} />} />
            <Route path="/item/:id" element={<ItemDetails user={user} />} />
          </Routes>
        </main>
        <MobileNav user={user} onShowAuth={() => setShowAuthModal(true)} />
      </div>
    </Router>
  );
}

export default App; 