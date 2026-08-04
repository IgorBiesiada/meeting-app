import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MeetingComments from "./MeetingComments"; 

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  
  const currentUserId = localStorage.getItem("user_id"); 
  const myId = (currentUserId && currentUserId !== "undefined" && currentUserId !== "null") 
    ? parseInt(currentUserId, 10) 
    : null;

  useEffect(() => {
    const fetchMeetingDetail = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("access_token"); 
        const response = await fetch(`http://localhost:8000/api/meetings/${id}/`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error(`Błąd: ${response.status}`);
        setMeeting(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeetingDetail();
  }, [id]);

  const handleStartChat = async () => {
    if (!myId) {
      alert("Błąd: Nie można zidentyfikować użytkownika. Odśwież stronę.");
      return;
    }

    setIsCreatingChat(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ participant: [myId, meeting.created_by] })
      });

      if (!response.ok) throw new Error("Nie udało się utworzyć czatu");
      
      const chatData = await response.json();
      navigate(`/chat/${chatData.id}`);
    } catch (err) {
      alert("Wystąpił błąd przy otwieraniu czatu: " + err.message);
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (isLoading) return <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-900 text-gray-400">Pobieranie...</div>;
  if (error || !meeting) return <div className="text-red-400">Błąd...</div>;

  const isOwner = meeting.created_by === myId;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-900 text-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">{meeting.title}</h1>
          
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 font-bold text-xl flex items-center justify-center">
              {meeting.creator_name ? meeting.creator_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Organizator spotkania</p>
              <p className="text-lg font-bold text-gray-100">{meeting.creator_name}</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/20 mb-4">
              Zapisz się na spotkanie
            </button>
            
            
            {!isOwner && (
              <button 
                onClick={handleStartChat}
                disabled={isCreatingChat}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors border border-gray-600 disabled:opacity-50"
              >
                {isCreatingChat ? "Otwieranie czatu..." : "Napisz wiadomość do organizatora"}
              </button>
            )}
          </div>
        </div>

        <MeetingComments meetingId={meeting.id} />
      </div>
    </div>
  );
}