import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ItemCard from '../components/ItemCard';
import SearchFilterBar from '../components/SearchFilterBar';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const ItemsBoard = ({ user }) => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    }
  }, [location.state]);

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsData = [];
      querySnapshot.forEach((doc) => {
        itemsData.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching items:', error);
      if (error.message.includes('Firebase not configured')) {
        // Show demo data when Firebase is not configured
        setItems([
          {
            id: 'demo-1',
            itemName: 'iPhone 13',
            description: 'Lost my iPhone in the library. It has a blue case.',
            category: 'Electronics',
            location: 'Library',
            date: new Date('2024-01-15'),
            status: 'lost',
            postedBy: 'demo@example.com',
            imageUrl: null
          },
          {
            id: 'demo-2',
            itemName: 'Red Backpack',
            description: 'Found a red backpack in the student center.',
            category: 'Clothing',
            location: 'Student Center',
            date: new Date('2024-01-14'),
            status: 'found',
            postedBy: 'demo@example.com',
            imageUrl: null
          }
        ]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, categoryFilter, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading items...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Lost & Found Board</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Browse through all posted items. Use the search and filters to find what you're looking for.
        </p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">
            {items.length === 0 
              ? "No items have been posted yet. Be the first to post a lost or found item!"
              : "Try adjusting your search terms or filters."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemsBoard; 