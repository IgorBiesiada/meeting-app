import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function CloseMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCloseMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        
        const response = await fetch(`${API_URL}meetings/close_meetings/`, { 
          headers 
        });

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania spotkań z Twojej okolicy.");
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

    fetchCloseMeetings();
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Blisko Ciebie</h1>
            <p className="text-gray-400 mt-1">Spotkania organizowane w Twoim mieście</p>
          </div>
        </div>

        {isLoading && (
          <div className="text-center text-gray-500 py-12">Szukanie spotkań...</div>
        )}

        {error && (
          <div className="text-center text-red-400 py-12">Błąd: {error}</div>
        )}

        {!isLoading && !error && meetings.length === 0 && (
          <div className="text-center py-16 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
            <p className="text-lg font-medium text-gray-400 mb-4">Brak spotkań w Twojej okolicy.</p>
            <p className="text-gray-500 text-sm">Może to czas, aby zorganizować własne?</p>
          </div>
        )}

        {!isLoading && !error && meetings.length > 0 && (
          <div className="space-y-4">
            {meetings.map((meeting, index) => (
              <Link
                to={`/meeting/${meeting.id}`}
                key={`${meeting.id || meeting.title}-${index}`}
                className="block bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-gray-800/80 transition-all cursor-pointer shadow-sm hover:shadow-md group"
              >
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-emerald-400 transition-colors">
                  {meeting.title}
                </h3>
                
                <p className="text-sm text-emerald-400 mt-1 font-medium">
                  {meeting.date}{meeting.time ? ` · ${meeting.time.slice(0, 5)}` : ""}
                </p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{meeting.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center text-gray-400">
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
                    <span>🪑 {meeting.number_of_seats} miejsc</span>
                  )}
                  {meeting.price != null && (
                    <span className="font-medium text-emerald-500/80">
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