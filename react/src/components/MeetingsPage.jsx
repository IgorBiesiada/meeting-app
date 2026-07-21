import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <-- Dodany import Link
import Map from "./Map";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const BACKEND_URL = API_URL.replace(/api\/$/, "");

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "all", label: "Wszystkie spotkania" },
    { id: "mine", label: "Moje spotkania" },
    { id: "past", label: "Odbyte" },
    { id: "near", label: "Blisko Ciebie" },
  ];

  const getEmptyMessage = () => {
    if (searchQuery.trim() && activeTab === "all") {
      return "Brak spotkań pasujących do wyszukiwania.";
    }
    if (activeTab === "mine") return "Brak spotkań — nie utworzyłeś jeszcze żadnego.";
    if (activeTab === "past") return "Brak odbytych spotkań.";
    if (activeTab === "near") return "Brak spotkań w Twojej okolicy.";
    return "Brak spotkań.";
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        let url;

        if (activeTab === "mine") {
          url = `${API_URL}meetings/my_meetings/`;
        } else if (activeTab === "past") {
          url = `${BACKEND_URL}outdated_meetings/`;
        } else {
          const params = new URLSearchParams();
          if (searchQuery.trim()) {
            params.set("q", searchQuery.trim());
          }
          const queryString = params.toString();
          url = `${API_URL}meetings/${queryString ? `?${queryString}` : ""}`;
        }

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

    const debounce = setTimeout(fetchMeetings, activeTab === "all" ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [activeTab, searchQuery]);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-gray-900 text-gray-100 font-sans overflow-hidden">
      
      <div className="bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-1 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col border-r border-gray-700 bg-gray-900 z-10 shadow-xl">
          
          {activeTab === "all" && (
            <div className="p-4 border-b border-gray-800 bg-gray-800/30 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Szukaj spotkań..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-gray-500"
                />
                <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}

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
              /* TUTAJ JEST ZMIANA: <div ...> na <Link ...> */
              <Link 
                to={`/meeting/${meeting.id}`}
                key={`${meeting.title}-${meeting.date}-${meeting.time}-${index}`}
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