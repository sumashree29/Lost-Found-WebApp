import { Search, Filter } from 'lucide-react';

const SearchFilterBar = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter }) => {
  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Books',
    'Jewelry',
    'Sports Equipment',
    'Keys',
    'Wallets',
    'Other'
  ];

  return (
    <div className="card mb-6">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field pl-10"
          >
            {categories.map(category => (
              <option key={category} value={category === 'All Categories' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar; 