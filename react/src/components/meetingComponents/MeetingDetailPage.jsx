import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MeetingComments from "./MeetingComments"; 
import StarRating from "../StarRating"; 

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  
  const [isParticipant, setIsParticipant] = useState(false);
  const [seats, setSeats] = useState(0);
  const [isJoining, setIsJoining] = useState(false);
  
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
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
          cache: "no-store" 
        });
        
        if (!response.ok) throw new Error(`Błąd: ${response.status}`);
        const data = await response.json();
        console.log("DANE Z BACKENDU:", data);
        setMeeting(data);
        setSeats(data.number_of_seats || 0);
        
        if (data.is_participant !== undefined) {
            setIsParticipant(data.is_participant);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeetingDetail();
  }, [id, myId]);

  const handleJoinToggle = async () => {
    if (!myId) {
      alert("Musisz być zalogowany, aby dołączyć.");
      return;
    }

    setIsJoining(true);
    try {
      const token = localStorage.getItem("access_token");
      const action = isParticipant ? "leave" : "join";

      if (action === "join" && Number(meeting.price) > 0) {
        const response = await fetch(`http://localhost:8000/${id}/payment/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && (data.url || data.checkout_url)) {
          window.location.href = data.url || data.checkout_url; 
          return; 
        } else {
          alert(data.error || "Błąd inicjalizacji płatności");
          setIsJoining(false);
          return;
        }
      }

      const response = await fetch(`http://localhost:8000/meeting/${id}/participation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: action })
      });

      const data = await response.json();

      if (response.ok) {
        setIsParticipant(data.status === "joined");
        if (data.number_of_seats !== undefined) {
          setSeats(data.number_of_seats);
        }
      } else {
        alert(data.detail || "Wystąpił błąd");
      }
    } catch (err) {
      alert("Błąd połączenia z serwerem: " + err.message);
    } finally {
      setIsJoining(false);
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-700 mb-4 shadow-sm">
            <span className="text-yellow-400 text-xl leading-none">★</span>
            <span className="text-sm font-bold text-gray-200">
              {meeting.rating === 'Brak ocen' || meeting.rating == null
                ? 'Brak ocen' 
                : `${Number(meeting.rating).toFixed(1)} / 6`}
            </span>
          </div>
          

          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-100">{meeting.title}</h1>
            
            <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0 ml-4">
              Miejsca: <span className={seats > 0 ? "text-emerald-400" : "text-red-400"}>{seats}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 font-bold text-xl flex items-center justify-center">
              {meeting.creator_name ? meeting.creator_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Organizator spotkania</p>
              <p className="text-lg font-bold text-gray-100">{meeting.creator_name}</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 flex flex-col gap-4">
            
            {!isOwner && (
              <>
                <button 
                  onClick={handleJoinToggle}
                  disabled={isJoining || (!isParticipant && seats <= 0)}
                  className={`w-full py-3 font-semibold rounded-xl transition-colors shadow-lg disabled:opacity-50 ${
                    isParticipant 
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-red-500/20" 
                      : seats > 0 
                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20" 
                        : "bg-gray-600 text-gray-300 cursor-not-allowed" 
                  }`}
                >
                  {isJoining 
                    ? "Przetwarzanie..." 
                    : isParticipant 
                      ? "Opuść spotkanie" 
                      : seats > 0 
                        ? (Number(meeting.price) > 0 ? `Kup dostęp (${meeting.price} zł)` : "Zapisz się na spotkanie")
                        : "Brak wolnych miejsc"
                  }
                </button>
              
                <button 
                  onClick={handleStartChat}
                  disabled={isCreatingChat}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors border border-gray-600 disabled:opacity-50"
                >
                  {isCreatingChat ? "Otwieranie czatu..." : "Napisz wiadomość do organizatora"}
                </button>
              </>
            )}
            
            {isOwner && (
              <div className="text-center py-3 bg-gray-900 rounded-xl border border-gray-700 text-emerald-400 font-medium">
                Jesteś organizatorem tego spotkania
              </div>
            )}

          </div>
        </div>

        
        {isParticipant && !isOwner && (
          <StarRating meetingId={meeting.id} />
        )}

        
        <MeetingComments meetingId={meeting.id} />
        
      </div>
    </div>
  );
}