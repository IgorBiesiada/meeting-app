import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function QuickMessage({ receiverId, receiverName }) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("idle"); 
  const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setStatus("loading");
    try {
      const token = localStorage.getItem("access_token");
     
      const response = await fetch(`${API_URL}messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          receiver: receiverId,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się wysłać wiadomości.");
      }

      setStatus("success");
      setContent("");
      
      
      setTimeout(() => setStatus("idle"), 3000);
      
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 mt-2">
      <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Napisz do: <span className="text-emerald-400">{receiverName || "organizatora"}</span>
      </h3>
      
      {status === "success" ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-lg flex items-center justify-between animate-fade-in-down">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Wiadomość została wysłana!</span>
          </div>
          
          <button 
            onClick={() => navigate("/messages")}
            className="text-sm font-bold text-emerald-300 hover:text-emerald-200 transition-colors underline"
          >
            Przejdź do czatu
          </button>
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Zapytaj o szczegóły spotkania..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none text-sm"
          />
          
          {status === "error" && (
            <span className="text-red-400 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Wystąpił błąd. Spróbuj ponownie.
            </span>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || status === "loading"}
              className="px-5 py-2 bg-gray-700 hover:bg-emerald-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed border border-gray-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 group"
            >
              {status === "loading" ? (
                "Wysyłanie..."
              ) : (
                <>
                  Wyślij
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors group-disabled:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}