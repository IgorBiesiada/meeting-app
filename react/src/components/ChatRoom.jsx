import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const currentUserId = Number(localStorage.getItem("user_id"));

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
  useEffect(() => {
    const fetchChatDetails = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Brak tokena dostępu");

        const response = await fetch(`${API_URL}chats/${chatId}/messages/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Nie udało się pobrać konwersacji.");
        }

        const data = await response.json();
        setMessages(data.messages || []);
        setOtherUser(data.other_participant || null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatDetails();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUser) return;

    try {
      const token = localStorage.getItem("access_token");
      
      
      const response = await fetch(`${API_URL}user_messages/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          receiver_id: otherUser.id,
          content: newMessage
        })
      });

      if (!response.ok) {
        throw new Error("Nie udało się wysłać wiadomości.");
      }

      const sentMessage = await response.json();
      
      
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas wysyłania wiadomości.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      
      
      <div className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/80 px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            to="/messages" 
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-white font-bold text-base shadow-inner">
            {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : "?"}
          </div>

          <div>
            <h2 className="text-base font-semibold text-white leading-tight">
              {otherUser?.name || "Czat"}
            </h2>
            <span className="text-xs text-emerald-400 font-medium">Aktywny</span>
          </div>
        </div>
      </div>

      
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-y-auto space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>Brak wiadomości w tej konwersacji. Napisz pierwszą!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSentByMe = msg.sender === currentUserId;

            return (
              <div 
                key={msg.id} 
                className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[75%]] sm:max-w-md rounded-2xl px-4 py-3 shadow-md ${
                    isSentByMe 
                      ? "bg-emerald-600 text-white rounded-br-none" 
                      : "bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                  <span className={`block text-[10px] mt-1 text-right ${isSentByMe ? "text-emerald-200" : "text-gray-500"}`}>
                    {new Date(msg.created_at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      
      <div className="bg-gray-800/80 backdrop-blur-md border-t border-gray-700/80 p-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Napisz wiadomość..."
            className="flex-1 bg-gray-900 border border-gray-700 focus:border-emerald-500 text-white rounded-xl px-4 py-3 outline-none text-sm transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  );
}