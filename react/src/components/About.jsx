import { Link } from "react-router-dom";

export default function About() {
  
  const isLoggedIn = !!localStorage.getItem("access_token");

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-900 text-gray-100 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      
      <div className="max-w-3xl text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Więcej niż kodowanie. <br />
          <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Prawdziwa społeczność.
          </span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          MeetApp powstało z jednej prostej potrzeby: mieliśmy dość samotnego siedzenia w piwnicy przed monitorem. 
          Stworzyliśmy miejsce, w którym możesz znaleźć pasjonatów IT w swoim mieście, wyjść na piwo, 
          wspólnie pociąć jakiś projekt, albo po prostu pogadać o technologiach bez poczucia, że mówisz do ściany.
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
        
        
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl hover:border-purple-500/50 transition-colors">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Lokalnie</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Nie szukamy kontaktów na drugim końcu świata. Skupiamy się na Twoim podwórku. Znajdź ludzi, z którymi możesz zbić piątkę w prawdziwym życiu.
          </p>
        </div>

        
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl hover:border-emerald-500/50 transition-colors">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6 text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Wymiana wiedzy</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Nieważne czy jesteś Seniorem z 10-letnim stażem, czy dopiero napisałeś swoje pierwsze "Hello World". Każdy ma coś ciekawego do przekazania.
          </p>
        </div>

        
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl hover:border-blue-500/50 transition-colors">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 text-blue-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Prawdziwe relacje</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Awatar na Discordzie jest spoko, ale nic nie zastąpi wspólnej walki z bugiem przy kawie. Budujmy sieć kontaktów, która faktycznie ma znaczenie.
          </p>
        </div>

      </div>

      
      <div className="bg-gray-800 border border-gray-700 p-10 rounded-2xl max-w-4xl w-full text-center shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-2xl pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold mb-4 relative z-10">Brzmi jak plan?</h2>
        <p className="text-gray-400 mb-8 relative z-10 max-w-xl mx-auto">
          Przeklikaj, sprawdź co się dzieje w okolicy i dołącz do najbliższego spotkania. Nie pożałujesz.
        </p>
        
        {isLoggedIn ? (
          <Link 
            to="/meetings" 
            className="relative z-10 inline-block px-8 py-3.5 bg-gray-700 text-white font-bold rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors shadow-lg"
          >
            Przeglądaj spotkania
          </Link>
        ) : (
          <Link 
            to="/register" 
            className="relative z-10 inline-block px-8 py-3.5 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
          >
            Załóż darmowe konto
          </Link>
        )}
      </div>

    </div>
  );
}