import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function MessagesList() {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Brak tokena dostępu");

        
        const response = await fetch(`${API_URL}chats/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Nie udało się pobrać listy konwersacji.");
        }

        const data = await response.json();
        setChats(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        
        <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-6">
          <div className="p-3 bg-gray-800 rounded-xl border border-gray-700 text-emerald-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Twoje wiadomości</h1>
        </div>

        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{error}</p>
          </div>
        )}

        
        {!error && chats.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 border border-gray-800 rounded-2xl">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            <h3 className="text-xl font-medium text-gray-400 mb-1">Skrzynka jest pusta</h3>
            <p className="text-gray-500">Nie masz jeszcze żadnych konwersacji.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => {
              const otherUser = chat.other_participant || { name: "Nieznany użytkownik" };
              const lastMsg = chat.last_message;

              return (
                <Link
                  key={chat.id}
                  to={`/messages/${chat.id}`}
                  className="block bg-gray-800/80 border border-gray-700/80 hover:border-emerald-500/50 hover:bg-gray-800 rounded-xl p-4 transition-all duration-200 group relative"
                >
                  <div className="flex items-center gap-4">
                    
                    <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-inner bg-gradient-to-br from-purple-500 to-emerald-500">
                      {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : "?"}
                    </div>

                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base font-semibold text-gray-200 truncate group-hover:text-emerald-400 transition-colors">
                          {otherUser.name}
                        </h3>
                        {lastMsg && (
                          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                            {formatDate(lastMsg.created_at)}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-400 truncate text-sm">
                        {lastMsg ? lastMsg.content : <span className="italic text-gray-500">Brak wiadomości...</span>}
                      </p>
                    </div>

                    
                    <div className="text-gray-600 group-hover:text-emerald-400 transition-colors pl-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}