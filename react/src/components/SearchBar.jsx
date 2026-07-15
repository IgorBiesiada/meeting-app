import { useState } from "react";

export default function SearchToolbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Szukam z dolnego paska:", searchQuery);
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 py-3 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form 
          onSubmit={handleSearch} 
          className="flex items-center justify-center gap-3 max-w-3xl mx-auto"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Wpisz miasto lub nazwę spotkania..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-100 text-sm border border-gray-700 rounded-lg outline-none transition-all placeholder-gray-500 focus:border-purple-500 focus:bg-gray-700 focus:ring-2 focus:ring-purple-500/20 shadow-inner"
            />
          </div>

          <button 
            type="button" 
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 transition-colors"
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
        </form>
      </div>
    </div>
  );
}