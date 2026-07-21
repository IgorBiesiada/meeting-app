import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-900 flex flex-col items-center">
      
      
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Odkrywaj wydarzenia z <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Let's Meet
          </span>
        </h1>
        
        <p className="mt-4 text-xl md:text-2xl text-gray-400 max-w-3xl mb-10">
          Znajdź ludzi o podobnych zainteresowaniach w Twojej okolicy. 
          Twórz własne wydarzenia, dołączaj do innych i buduj społeczność.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {isLoggedIn ? (
            <>
              <Link 
                to="/meetings" 
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
              >
                Przeglądaj spotkania
              </Link>
              <Link 
                to="/map" 
                className="px-8 py-4 bg-gray-800 text-white font-bold text-lg rounded-xl border border-gray-700 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
              >
                Otwórz mapę
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/register" 
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
              >
                Rozpocznij za darmo
              </Link>
              <Link 
                to="/meetings/public" 
                className="px-8 py-4 bg-gray-800 text-white font-bold text-lg rounded-xl border border-gray-700 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
              >
                Zobacz co się dzieje
              </Link>
            </>
          )}
        </div>
      </section>

      
      <section className="w-full bg-gray-800/50 border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 mx-auto bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lokalnie i na mapie</h3>
              <p className="text-gray-400">
                Szukaj wydarzeń w swoim mieście za pomocą interaktywnej mapy. Zobacz, kto spotyka się tuż za rogiem.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 mx-auto bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Nowe znajomości</h3>
              <p className="text-gray-400">
                Poznaj programistów, graczy, sportowców i ludzi dzielących Twoje pasje. Zbuduj swoją sieć kontaktów.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors">
              <div className="w-14 h-14 mx-auto bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Błyskawiczny start</h3>
              <p className="text-gray-400">
                Zaloguj się jednym kliknięciem przez GitHuba lub Discorda. Bez żmudnego wypełniania formularzy.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}