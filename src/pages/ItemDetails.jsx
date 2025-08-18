import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';

const ItemDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [showClaimSuccessModal, setShowClaimSuccessModal] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'items', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          setMessage({ type: 'error', text: 'Item not found' });
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        if (error.message.includes('Firebase not configured')) {
          // Show demo item for demo IDs
          if (id === 'demo-1') {
            setItem({
              id: 'demo-1',
              itemName: 'iPhone 13',
              description: 'Lost my iPhone in the library. It has a blue case and a cracked screen protector. Please contact me if found.',
              category: 'Electronics',
              location: 'Library',
              date: new Date('2024-01-15'),
              status: 'lost',
              postedBy: 'demo@example.com',
              contactEmail: 'demo@example.com',
              contactPhone: '(555) 123-4567',
              imageUrl: null,
              claimed: false
            });
          } else if (id === 'demo-2') {
            setItem({
              id: 'demo-2',
              itemName: 'Red Backpack',
              description: 'Found a red backpack in the student center near the coffee shop. It contains textbooks and a laptop.',
              category: 'Clothing',
              location: 'Student Center',
              date: new Date('2024-01-14'),
              status: 'found',
              postedBy: 'demo@example.com',
              contactEmail: 'demo@example.com',
              contactPhone: '(555) 123-4567',
              imageUrl: null,
              claimed: false
            });
          } else {
            setMessage({ type: 'error', text: 'Item not found' });
          }
        } else {
          setMessage({ type: 'error', text: 'Error loading item' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleClaim = () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to claim items' });
      return;
    }
    setShowClaimModal(true);
  };

  const handleVerificationSubmit = async () => {
    if (!verificationAnswer.trim()) {
      setMessage({ type: 'error', text: 'Please provide a verification answer' });
      return;
    }

    setClaiming(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = doc(db, 'items', id);
      await updateDoc(docRef, {
        claimed: true,
        claimedBy: user.email,
        claimedAt: serverTimestamp(),
        verificationAnswer: verificationAnswer
      });

      setItem(prev => ({
        ...prev,
        claimed: true,
        claimedBy: user.email,
        claimedAt: new Date(),
        verificationAnswer: verificationAnswer
      }));

      setShowClaimModal(false);
      setShowClaimSuccessModal(true);
      setVerificationAnswer('');
    } catch (error) {
      console.error('Error claiming item:', error);
      if (error.message.includes('Firebase not configured')) {
        setMessage({ type: 'error', text: 'Firebase not configured. Please set up Firebase first.' });
      } else {
        setMessage({ type: 'error', text: 'Error claiming item. Please try again.' });
      }
    } finally {
      setClaiming(false);
    }
  };

  const handleDelete = async () => {
    if (!user || (!item.claimed || item.claimedBy !== user.email) && item.postedByUid !== user.uid) {
      setMessage({ type: 'error', text: 'You can only delete items you posted or claimed' });
      return;
    }

    setDeleting(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = doc(db, 'items', id);
      await deleteDoc(docRef);
      
      // Navigate back to items board with success message
      navigate('/items', { 
        state: { 
          message: { 
            type: 'success', 
            text: 'Item deleted successfully!' 
          } 
        } 
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      if (error.message.includes('Firebase not configured')) {
        setMessage({ type: 'error', text: 'Firebase not configured. Please set up Firebase first.' });
      } else {
        setMessage({ type: 'error', text: 'Error deleting item. Please try again.' });
      }
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading item...</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/items" className="btn-primary">
            Back to Items Board
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/items" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Items Board</span>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          {item.imageUrls && item.imageUrls.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <img
                src={item.imageUrls[0]}
                alt={item.itemName}
                className="w-full rounded-lg shadow-lg"
              />
              {/* Additional Images */}
              {item.imageUrls.length > 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {item.imageUrls.slice(1).map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`${item.itemName} - Image ${index + 2}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'lost' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {item.status === 'lost' ? 'LOST' : 'FOUND'}
              </span>
              {item.claimed && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Claimed</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {item.itemName}
            </h1>
            <p className="text-lg text-gray-600">
              {item.category}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{item.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date {item.status === 'lost' ? 'Lost' : 'Found'}</p>
                <p className="font-medium">{formatDate(item.date)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Posted By</p>
                <p className="font-medium">{item.postedBy}</p>
              </div>
            </div>

            {item.contactEmail && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Contact Email</p>
                  <a 
                    href={`mailto:${item.contactEmail}`}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {item.contactEmail}
                  </a>
                </div>
              </div>
            )}

            {item.contactPhone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Contact Phone</p>
                  <a 
                    href={`tel:${item.contactPhone}`}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {item.contactPhone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Claim Information */}
          {item.claimed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Item Claimed</span>
              </div>
              <p className="text-sm text-green-700">
                Claimed by {item.claimedBy} on {formatDate(item.claimedAt)}
              </p>
            </div>
          )}

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center space-x-2 ${
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


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {!item.claimed && user && (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {claiming ? 'Processing...' : 'Claim This Item'}
              </button>
            )}
            
            {user && ((item.claimed && item.claimedBy === user.email) || item.postedByUid === user.uid) && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center min-h-[44px] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                <span>{deleting ? 'Deleting...' : 'Delete Item'}</span>
              </button>
            )}
            
            <Link to="/items" className="btn-secondary">
              Back to Board
            </Link>
          </div>
        </div>
      </div>

      {/* Claim Verification Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Verify Your Claim
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              To claim this {item.status} item, please describe a unique feature or provide additional details that prove this item belongs to you.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Details *
              </label>
              <textarea
                value={verificationAnswer}
                onChange={(e) => setVerificationAnswer(e.target.value)}
                placeholder="Describe a unique feature, what's inside, serial number, or any other identifying detail..."
                rows="4"
                className="input-field"
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleVerificationSubmit}
                disabled={claiming || !verificationAnswer.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {claiming ? 'Processing...' : 'Submit Claim'}
              </button>
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setVerificationAnswer('');
                  setMessage({ type: '', text: '' });
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Success Modal */}
      {showClaimSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Claim Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your claim has been submitted for review. The item owner will be notified and can verify your claim based on the details you provided.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowClaimSuccessModal(false);
                  window.location.reload();
                }}
                className="w-full btn-primary"
              >
                Continue
              </button>
              <button
                onClick={() => setShowClaimSuccessModal(false)}
                className="w-full btn-secondary"
              >
                Stay on Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Delete Item
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
