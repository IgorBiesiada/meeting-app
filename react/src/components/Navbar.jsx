import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    setIsOpen(false); 
    navigate("/meetings/public");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={closeMenu} className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Let's Meet
              </span>
            </Link>
          </div>

          
          <div className="hidden md:flex space-x-8">
            <Link 
              to={isLoggedIn ? "/meetings" : "/meetings/public"} 
              className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200"
            >
              Spotkania
            </Link>
            
            {isLoggedIn && (
              <>
                <Link to="/meetings/mine" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200">
                  Moje spotkania
                </Link>
                <Link to="/meetings/past" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200">
                  Odbyte spotkania
                </Link>
                <Link to="/map" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200">
                  Mapa
                </Link>
                <Link to="/meetings/create" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200">
                  Dodaj spotkanie
                </Link>
              </>
            )}

            <Link to="/about" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200">
              O nas
            </Link>
          </div>

          
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-800 shadow-lg group-hover:border-gray-500 transition-colors">
                    U
                  </div>
                  <span className="font-medium">Mój profil</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-red-500/20 border border-gray-700 hover:border-red-500/50 rounded-lg font-medium transition-colors duration-200"
                >
                  Wyloguj
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white font-medium px-3 py-2 transition-colors duration-200"
                >
                  Zaloguj się
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
                >
                  Dołącz do nas
                </Link>
              </>
            )}
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
            <Link to={isLoggedIn ? "/meetings" : "/meetings/public"} onClick={closeMenu} className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">
              Spotkania
            </Link>
            
            {isLoggedIn && (
              <>
                <Link to="/meetings/mine" onClick={closeMenu} className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">
                  Moje spotkania
                </Link>
                <Link to="/meetings/past" onClick={closeMenu} className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">
                  Odbyte spotkania
                </Link>
                <Link to="/map" onClick={closeMenu} className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">
                  Mapa
                </Link>
                <Link to="/meetings/create" onClick={closeMenu} className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">
                  Dodaj spotkanie
                </Link>
              </>
            )}

            <Link to="/about" onClick={closeMenu} className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md font-medium">
              O nas
            </Link>
          </div>
          
          <div className="px-4 py-4 border-t border-gray-700 flex flex-col space-y-3">
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white font-medium">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">U</div>
                  Mój profil
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="block text-center w-full py-3 bg-gray-700 hover:bg-red-500/20 hover:text-white text-gray-300 font-bold rounded-lg border border-gray-600 hover:border-red-500/50 transition-colors"
                >
                  Wyloguj się
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="block text-center text-gray-300 hover:text-white font-medium py-2">
                  Zaloguj się
                </Link>
                <Link to="/register" onClick={closeMenu} className="block text-center w-full py-3 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg">
                  Dołącz do nas
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}