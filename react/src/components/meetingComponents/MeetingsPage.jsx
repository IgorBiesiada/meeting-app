import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import Map from "../Map";
import SearchToolbar from "../SearchBar"; 

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEmptyMessage = () => {
    if (searchQuery.trim()) {
      return "Brak spotkań pasujących do wyszukiwania.";
    }
    return "Brak spotkań.";
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const params = new URLSearchParams();
        if (searchQuery.trim()) {
          params.set("q", searchQuery.trim());
        }
        
        const queryString = params.toString();
        const url = `${API_URL}meetings/${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania spotkań");
        }

        const data = await response.json();
        setMeetings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchMeetings, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-gray-900 text-gray-100 font-sans overflow-hidden">
      
      {/* TUTEJ JEST FIX: Opakowanie shrink-0 i odpowiednie tło */}
      <div className="shrink-0 bg-gray-800 border-b border-gray-700 p-4 shadow-sm z-20">
        <div className="max-w-7xl mx-auto">
          <SearchToolbar onSearch={setSearchQuery} />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col border-r border-gray-700 bg-gray-900 z-10 shadow-xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading && (
              <div className="text-center text-gray-400 py-4">Ładowanie spotkań...</div>
            )}
            
            {error && (
              <div className="text-center text-red-400 py-4">Błąd: {error}</div>
            )}
            
            {!isLoading && !error && meetings.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg font-medium text-gray-400">{getEmptyMessage()}</p>
              </div>
            )}

            {!isLoading && !error && meetings.map((meeting, index) => (
              <Link 
                to={`/meeting/${meeting.id}`}
                key={`${meeting.id || meeting.title}-${index}`}
                className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/50 hover:bg-gray-800/80 transition-all cursor-pointer shadow-sm hover:shadow-md group"
              >
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-purple-400 transition-colors">
                  {meeting.title}
                </h3>
                <p className="text-sm text-emerald-400 mt-1 font-medium">
                  {meeting.date}{meeting.time ? ` · ${meeting.time.slice(0, 5)}` : ""}
                </p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{meeting.description}</p>
                
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {meeting.meeting_city}{meeting.meeting_region ? `, ${meeting.meeting_region}` : ""}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 lg:w-2/3 bg-gray-800 relative items-center justify-center">
          <Map meetings={meetings} />
        </div>

      </div>
    </div>
  );
}