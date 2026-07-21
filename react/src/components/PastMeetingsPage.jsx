import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function PastMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        
        const response = await fetch(`${API_URL}outdated_meetings/`);

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania historii spotkań.");
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

    fetchPastMeetings();
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-300">Odbyte spotkania</h1>
            <p className="text-gray-500 mt-1">Archiwum minionych wydarzeń</p>
          </div>
          <Link
            to="/"
            className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 text-center"
          >
            Przeglądaj aktualne
          </Link>
        </div>

        {isLoading && (
          <div className="text-center text-gray-500 py-12">Ładowanie historii...</div>
        )}

        {error && (
          <div className="text-center text-red-400 py-12">Błąd: {error}</div>
        )}

        {!isLoading && !error && meetings.length === 0 && (
          <div className="text-center py-16 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
            <p className="text-lg font-medium text-gray-500 mb-4">Brak odbytych spotkań.</p>
            <p className="text-gray-600 text-sm">Historia jest pusta.</p>
          </div>
        )}

        {!isLoading && !error && meetings.length > 0 && (
          <div className="space-y-4">
            {meetings.map((meeting, index) => (
              <Link
                to={`/meeting/${meeting.id}`}
                key={`${meeting.title}-${meeting.date}-${meeting.time}-${index}`}
                
                className="block bg-gray-800/60 border border-gray-700/60 rounded-xl p-5 transition-all shadow-sm opacity-75 grayscale-[30%] hover:grayscale-0 hover:opacity-100 hover:border-gray-500 group"
              >
                <h3 className="text-lg font-bold text-gray-400 group-hover:text-purple-400 transition-colors">
                  {meeting.title}
                </h3>
                
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {meeting.date}{meeting.time ? ` · ${meeting.time.slice(0, 5)}` : ""}
                </p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{meeting.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {meeting.meeting_city}{meeting.meeting_region ? `, ${meeting.meeting_region}` : ""}
                  </span>
                  {meeting.street && (
                    <span>{meeting.street}</span>
                  )}
                  {meeting.number_of_seats != null && (
                    <span>{meeting.number_of_seats} miejsc</span>
                  )}
                  {meeting.price != null && (
                    <span>
                      {Number(meeting.price) === 0 ? "Darmowe" : `${meeting.price} PLN`}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}