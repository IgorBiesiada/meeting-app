import { useState } from "react";

export default function SearchToolbar({ onSearch }) {
  const [showFilters, setShowFilters] = useState(false);
  
  
  const [filters, setFilters] = useState({
    q: "",
    min_price: "",
    max_price: "",
    min_number_of_seats: "",
    max_number_of_seats: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 py-3 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          
          
          <div className="flex items-center justify-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="q"
                placeholder="Szukaj spotkań po tytule..."
                value={filters.q}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-100 text-sm border border-gray-700 rounded-lg outline-none transition-all placeholder-gray-500 focus:border-purple-500 focus:bg-gray-700 focus:ring-2 focus:ring-purple-500/20 shadow-inner"
              />
            </div>

            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                showFilters 
                  ? "bg-purple-900/30 border-purple-500 text-purple-400" 
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filtry
            </button>

            <button 
              type="submit" 
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg transition-colors shadow-md shadow-purple-500/20"
            >
              Szukaj
            </button>
          </div>

          
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Cena (PLN)</label>
                <div className="flex items-center gap-2">
                  <input type="number" name="min_price" placeholder="Od" min="0" value={filters.min_price} onChange={handleChange}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 outline-none focus:border-purple-500" />
                  <span className="text-gray-500">-</span>
                  <input type="number" name="max_price" placeholder="Do" min="0" value={filters.max_price} onChange={handleChange}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 outline-none focus:border-purple-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Liczba miejsc</label>
                <div className="flex items-center gap-2">
                  <input type="number" name="min_number_of_seats" placeholder="Od" min="1" value={filters.min_number_of_seats} onChange={handleChange}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 outline-none focus:border-purple-500" />
                  <span className="text-gray-500">-</span>
                  <input type="number" name="max_number_of_seats" placeholder="Do" min="1" value={filters.max_number_of_seats} onChange={handleChange}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 outline-none focus:border-purple-500" />
                </div>
              </div>
              
            </div>
          )}
        </form>
      </div>
    </div>
  );
}