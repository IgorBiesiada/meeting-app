import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function PublicMeetingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "all", label: "Wszystkie spotkania" },
    { id: "near", label: "Blisko Ciebie (🔒 Zaloguj się)" },
  ];

  useEffect(() => {
    const fetchPublicMeetings = async () => {
      try {
        setIsLoading(true);
          const response = await fetch(`${API_URL}cut_meetings/`);
        
        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.status}`);
        }

        const data = await response.json();
        setMeetings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicMeetings();
  }, []);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-gray-900 text-gray-100 font-sans overflow-hidden">
      
      
      <div className="bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.id === "all" ? setActiveTab(tab.id) : null}
                className={`whitespace-nowrap px-1 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-400"
                    : tab.id === "near" 
                      ? "border-transparent text-gray-600 cursor-not-allowed" 
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        <div className="w-full flex flex-col z-10">
          
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            
            
            {isLoading && (
              <div className="text-center text-gray-400 py-12">Pobieranie listy publicznych spotkań...</div>
            )}
            
            {error && (
              <div className="text-center text-red-400 py-12">Nie udało się załadować spotkań: {error}</div>
            )}
            
            {!isLoading && !error && meetings.length === 0 && (
              <div className="text-center text-gray-500 py-12">Aktualnie nie ma żadnych zaplanowanych spotkań.</div>
            )}

            
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting, index) => (
                  <div 
                    key={meeting.id || index} 
                    className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-purple-500/50 hover:bg-gray-800/80 transition-all cursor-pointer shadow-lg group flex flex-col h-full relative overflow-hidden"
                  >
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                      {meeting.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 mb-4 text-sm font-medium">
                      <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">📅 {meeting.date}</span>
                      <span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">⏰ {meeting.time}</span>
                    </div>
                    
                    
                    <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                      {meeting.description}
                    </p>
                    
                    <div className="mt-auto border-t border-gray-700 pt-4 text-center relative">
                      <div className="absolute -top-8 left-0 w-full h-8 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none"></div>
                      
                      <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mb-3 font-semibold uppercase tracking-wider">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Lokalizacja ukryta</span>
                      </div>
                      
                      <Link 
                        to="/login"
                        className="block w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors text-sm"
                      >
                        Zaloguj się, by sprawdzić
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}