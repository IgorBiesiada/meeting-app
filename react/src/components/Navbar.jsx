import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-2xl font-bold tracking-tight">
              
              <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Let's Meet
              </span>
            </a>
          </div>

          
          <div className="hidden md:flex space-x-8">
            <a href="/spotkania" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200">
              Spotkania
            </a>
            <a href="/mapa" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200">
              Mapa
            </a>
            <a href="/o-nas" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200">
              O nas
            </a>
          </div>

          
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="/login" 
              className="text-gray-300 hover:text-white font-medium px-3 py-2 transition-colors duration-200"
            >
              Zaloguj się
            </a>
            <a 
              href="/" 
              
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
            >
              Dołącz do nas
            </a>
          </div>

          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/spotkania" className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">Spotkania</a>
            <a href="/mapa" className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">Mapa</a>
            <a href="/o-nas" className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">O nas</a>
          </div>
          <div className="px-4 py-4 border-t border-gray-700 flex flex-col space-y-3">
            <a href="/login" className="block text-center text-gray-300 hover:text-white font-medium py-2">Zaloguj się</a>
            <a href="/register" className="block text-center w-full py-3 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg">
              Dołącz do nas
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}