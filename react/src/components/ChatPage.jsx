import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("access_token");
  const myId = parseInt(localStorage.getItem("user_id"), 10);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch("http://localhost:8000/api/chat/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setChats(await res.json());
    };
    fetchChats();
  }, [token]);

  useEffect(() => {
    if (!chatId) return;
    
    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:8000/api/chat/${chatId}/messages/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(await res.json());
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    fetchMessages();
    
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const res = await fetch(`http://localhost:8000/api/chat/${chatId}/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content: newMessage })
    });

    if (res.ok) {
      const sentMsg = await res.json();
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage("");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      
      const chatsRes = await fetch("http://localhost:8000/api/chat/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (chatsRes.ok) setChats(await chatsRes.json());
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gray-900 text-gray-100 font-sans border-t border-gray-800">
      
      
      <div className="w-1/3 border-r border-gray-700 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-xl font-bold">Twoje Wiadomości</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className={`p-4 border-b border-gray-800 cursor-pointer transition-colors flex items-center gap-3
                ${parseInt(chatId) === chat.id ? "bg-gray-800 border-l-4 border-purple-500" : "hover:bg-gray-800/50"}`}
            >
              
              <div className="w-10 h-10 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center font-bold flex-shrink-0">
                {chat.other_user?.username?.charAt(0).toUpperCase()}
              </div>
              
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <p className="font-semibold text-gray-200 truncate">
                    {chat.other_user?.username}
                  </p>
  
                  {chat.last_message && (
                    <p className="text-xs text-gray-500">
                      {new Date(chat.last_message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 truncate">
                  {chat.last_message ? chat.last_message.content : "Brak wiadomości na tym czacie"}
                </p>
              </div>
            </div>
          ))}
          {chats.length === 0 && (
             <div className="p-4 text-gray-500 text-center">Brak wiadomości</div>
          )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col bg-gray-900">
        {!chatId ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Wybierz konwersację z menu po lewej stronie, aby rozpocząć czat.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const isMe = msg.sender.id === myId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div 
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMe 
                          ? "bg-purple-600 text-white rounded-br-none" 
                          : "bg-gray-700 text-gray-100 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMe ? "text-purple-200" : "text-gray-400"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Napisz wiadomość..."
                  className="flex-1 bg-gray-700 text-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Wyślij
                </button>
              </form>
            </div>
          </>
        )}
      </div>
      
    </div>
  );
}