import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    navigate("/meetings/public");
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Let's Meet
              </span>
            </Link>
          </div>

          
          <div className="flex space-x-4 md:space-x-8 overflow-x-auto">
            <Link 
              to={isLoggedIn ? "/meetings" : "/meetings/public"} 
              className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200 whitespace-nowrap"
            >
              Spotkania
            </Link>
            
            {isLoggedIn && (
              <>
                <Link to="/meetings/mine" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200 whitespace-nowrap">
                  Moje spotkania
                </Link>
                <Link to="/meetings/close" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200 whitespace-nowrap">
                  Blisko ciebie
                </Link>
                <Link to="/meetings/past" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200 whitespace-nowrap">
                  Odbyte spotkania
                </Link>
                <Link to="/map" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200 whitespace-nowrap">
                  Mapa
                </Link>
                <Link to="/meetings/create" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200 whitespace-nowrap">
                  Dodaj spotkanie
                </Link>
              </>
            )}

            <Link to="/about" className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-200 whitespace-nowrap">
              O nas
            </Link>
          </div>

          
          <div className="flex items-center space-x-4 ml-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-800 shadow-lg group-hover:border-gray-500 transition-colors">
                    U
                  </div>
                  <span className="hidden lg:block font-medium">Mój profil</span>
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
                  className="text-gray-300 hover:text-white font-medium px-3 py-2 transition-colors duration-200 whitespace-nowrap"
                >
                  Zaloguj się
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 whitespace-nowrap"
                >
                  Dołącz
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}