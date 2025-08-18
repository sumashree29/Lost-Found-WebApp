import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

const Home = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
          Campus Lost & Found
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Help reunite lost items with their owners. Post lost items, report found items, 
          and browse through our community board.
        </p>
        
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              Sign in to post items and mark them as claimed.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <Link
          to="/post"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
              <Plus className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Post Lost Item
              </h3>
              <p className="text-gray-600">
                Lost something? Let the community help you find it.
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/post"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
              <Search className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Post Found Item
              </h3>
              <p className="text-gray-600">
                Found something? Help return it to its owner.
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* View All Items Button */}
      <div className="text-center mb-8 sm:mb-12">
        <Link
          to="/items"
          className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 inline-flex items-center space-x-2 w-full sm:w-auto"
        >
          <Search className="h-5 w-5" />
          <span>View All Items</span>
        </Link>
      </div>


      {/* Stats Section */}
      <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
          <div className="text-gray-600">Items Posted</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
          <div className="text-gray-600">Success Rate</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
          <div className="text-gray-600">Community Members</div>
        </div>
      </div>
    </div>
  );
};

export default Home; 