import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, CheckCircle } from 'lucide-react';

const ItemCard = ({ item }) => {
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <Link to={`/item/${item.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Image */}
        <div className="aspect-square mb-4 overflow-hidden rounded-lg">
          {item.imageUrls && item.imageUrls.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={item.imageUrls[0]}
                alt={item.itemName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
              {item.imageUrls.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                  +{item.imageUrls.length - 1} more
                </div>
              )}
            </div>
          ) : item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'lost' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {item.status === 'lost' ? 'LOST' : 'FOUND'}
            </span>
            {item.claimed && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Claimed</span>
              </div>
            )}
          </div>

          {/* Item Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {item.itemName}
          </h3>

          {/* Category */}
          <p className="text-sm text-gray-600">
            {item.category}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>

          {/* Location and Date */}
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(item.date)}</span>
            </div>
          </div>

          {/* Posted By */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
            <User className="h-4 w-4" />
            <span className="line-clamp-1">{item.postedBy}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard; 