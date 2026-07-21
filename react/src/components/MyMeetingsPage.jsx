import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Musisz być zalogowany, aby zobaczyć swoje spotkania.");
        }

        const response = await fetch(`${API_URL}meetings/my_meetings/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania Twoich spotkań.");
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

    fetchMyMeetings();
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Moje spotkania</h1>
            <p className="text-gray-400 mt-1">Spotkania utworzone przez Ciebie</p>
          </div>
          <Link
            to="/meetings/create"
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 text-center"
          >
            Dodaj spotkanie
          </Link>
        </div>

        {isLoading && (
          <div className="text-center text-gray-400 py-12">Ładowanie spotkań...</div>
        )}

        {error && (
          <div className="text-center text-red-400 py-12">Błąd: {error}</div>
        )}

        {!isLoading && !error && meetings.length === 0 && (
          <div className="text-center py-16 bg-gray-800 border border-gray-700 rounded-2xl">
            <p className="text-lg font-medium text-gray-400 mb-4">Brak spotkań.</p>
            <p className="text-gray-500 text-sm mb-6">Nie utworzyłeś jeszcze żadnego spotkania.</p>
            <Link
              to="/meetings/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
            >
              Utwórz pierwsze spotkanie
            </Link>
          </div>
        )}

        {!isLoading && !error && meetings.length > 0 && (
          <div className="space-y-4">
            {meetings.map((meeting, index) => (
              /* TUTAJ JEST ZMIANA: <div ...> na <Link ...> */
              <Link
                to={`/meeting/${meeting.id}`}
                key={`${meeting.title}-${meeting.date}-${meeting.time}-${index}`}
                className="block bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-gray-800/80 transition-all shadow-sm hover:shadow-md group"
              >
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-purple-400 transition-colors">
                  {meeting.title}
                </h3>
                <p className="text-sm text-emerald-400 mt-1 font-medium">
                  {meeting.date}{meeting.time ? ` · ${meeting.time.slice(0, 5)}` : ""}
                </p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{meeting.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {meeting.meeting_city}{meeting.meeting_region ? `, ${meeting.meeting_region}` : ""}
                  </span>
                  {meeting.street && (
                    <span className="text-gray-600">{meeting.street}</span>
                  )}
                  {meeting.number_of_seats != null && (
                    <span className="text-gray-600">{meeting.number_of_seats} miejsc</span>
                  )}
                  {meeting.price != null && (
                    <span className="text-emerald-500/80 font-medium">
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