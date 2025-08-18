import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const PostItem = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    location: '',
    date: '',
    contactEmail: '',
    contactPhone: '',
    status: 'lost',
    confirmOwnership: false
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postedItemId, setPostedItemId] = useState(null);
  const [postedItemStatus, setPostedItemStatus] = useState('');

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Jewelry',
    'Sports Equipment',
    'Keys',
    'Wallets',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handles both file input and drag-and-drop
  const handleFiles = (files) => {
    // Convert to array and filter only image files, max 3
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/')).slice(0, 3);
    
    console.log('Selected files:', fileArray.length);
    console.log('Image files:', imageFiles.length);
    
    setImages(imageFiles);

    // Generate previews for all selected images
    Promise.all(
      imageFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    ).then(previews => {
      console.log('Generated previews:', previews.length);
      setImagePreviews(previews);
    });
  };

  const handleImageChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to post items.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let imageUrls = [];
      console.log('Images to process:', images.length);
      
      // Convert images to base64 for local storage (no Firebase Storage needed)
      if (images.length > 0) {
        try {
          const base64Promises = images.map(async (image, index) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                console.log(`Image ${index + 1} processed`);
                resolve(reader.result);
              };
              reader.readAsDataURL(image);
            });
          });
          imageUrls = await Promise.all(base64Promises);
          console.log('Total imageUrls generated:', imageUrls.length);
        } catch (error) {
          console.error('Image processing error:', error);
          setMessage({ type: 'warning', text: 'Image processing failed, but item will be posted without images.' });
        }
      }

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'items'), {
        ...formData,
        imageUrls: imageUrls, // Array of image URLs (base64)
        imageUrl: imageUrls[0] || '', // For backward compatibility
        postedBy: user.email,
        postedByUid: user.uid,
        createdAt: serverTimestamp(),
        claimed: false,
        claimedBy: null,
        claimedAt: null
      });

      setMessage({ type: 'success', text: 'Item posted successfully!' });
      setPostedItemId(docRef.id);
      setPostedItemStatus(formData.status);
      setShowSuccessModal(true);
      setImages([]);
      setImagePreviews([]);
      setFormData({
        itemName: '',
        description: '',
        category: '',
        location: '',
        date: '',
        contactEmail: '',
        contactPhone: '',
        status: 'lost',
        confirmOwnership: false
      });

    } catch (error) {
      if (error.message.includes('Firebase not configured')) {
        setMessage({ type: 'error', text: 'Firebase not configured. Please set up Firebase first.' });
      } else if (error.message.includes('permission-denied')) {
        setMessage({ type: 'error', text: 'Permission denied. Please check Firebase security rules.' });
      } else {
        setMessage({ type: 'error', text: `Error posting item: ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600">
            You need to sign in to post items to the Lost & Found board.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Post Item</h1>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : message.type === 'warning'
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
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

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Status *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="lost"
                  checked={formData.status === 'lost'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-red-600 font-medium">Lost</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="found"
                  checked={formData.status === 'found'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-green-600 font-medium">Found</span>
              </label>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              required
              className="input-field"
              placeholder="e.g., iPhone 13, Red Backpack"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="input-field"
              placeholder="Describe the item in detail..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="input-field"
              placeholder="e.g., Library, Student Center, Room 201"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date {formData.status === 'lost' ? 'Lost' : 'Found'} *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>

          {/* Contact Information */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="input-field"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="input-field"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Verification Checkbox for Lost Items */}
          {formData.status === 'lost' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="confirmOwnership"
                  checked={formData.confirmOwnership}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div>
                  <span className="text-sm font-medium text-yellow-800">
                    I confirm this item belongs to me *
                  </span>
                  <p className="text-xs text-yellow-700 mt-1">
                    By checking this box, you confirm that you are the rightful owner of this lost item and will be able to provide proof of ownership if requested.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Images (Up to 3)
            </label>
            <div 
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
                isDragOver 
                  ? 'border-primary-400 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB (Max 3 images)</p>
              </div>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Selected Images ({imagePreviews.length}/3):</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setImages([]);
                      setImagePreviews([]);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = images.filter((_, i) => i !== index);
                          const newPreviews = imagePreviews.filter((_, i) => i !== index);
                          setImages(newImages);
                          setImagePreviews(newPreviews);
                        }}
                        className="absolute top-1 left-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Item'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
            <div className="mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Item Posted Successfully!
              </h2>
              <p className="text-gray-600 mb-4">
                Your {postedItemStatus} item has been posted to the Lost & Found board.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/item/${postedItemId}`)}
                className="w-full btn-primary"
              >
                View Item Details
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/items');
                }}
                className="w-full btn-secondary"
              >
                Browse All Items
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full text-gray-500 hover:text-gray-700 text-sm"
              >
                Post Another Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;
