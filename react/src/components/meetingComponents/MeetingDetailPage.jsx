import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MeetingComments from "./MeetingComments"; 
import QuickMessage from "../QuikMessage"; 

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); 
  
  useEffect(() => {
    const fetchMeetingDetail = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("access_token"); 
        
        const response = await fetch(`http://localhost:8000/api/meetings/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        
        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.status}`);
        }

        const data = await response.json();
        setMeeting(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetingDetail();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć to spotkanie? Tej akcji nie można cofnąć.");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/api/meetings/${id}/`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        throw new Error("Nie udało się usunąć spotkania");
      }

      alert("Spotkanie zostało pomyślnie usunięte.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd podczas usuwania. Sprawdź, czy masz uprawnienia.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-900 text-gray-400">
        Pobieranie szczegółów spotkania...
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-gray-900 text-red-400 gap-4">
        <p>Nie udało się załadować spotkania: {error}</p>
        <Link to="/" className="text-purple-400 hover:text-purple-300 underline">Wróć do listy spotkań</Link>
      </div>
    );
  }

  const currentUserId = localStorage.getItem("user_id"); 
  const myId = parseInt(currentUserId, 10);
  const isOwner = meeting.created_by === myId;

  // -- POCZĄTEK DIAGNOZY --
  console.log("=== DIAGNOZA ===");
  console.log("1. Moje ID pobrane z localStorage:", currentUserId);
  console.log("2. Moje ID przekonwertowane na cyfrę:", myId);
  console.log("3. ID twórcy spotkania przesłane z Django:", meeting.created_by);
  console.log("4. Imię twórcy spotkania z Django:", meeting.creator_name);
  console.log("5. Czy React uważa że jesteś właścicielem?:", isOwner);
  console.log("6. Cały obiekt spotkania z API:", meeting);
  // -- KONIEC DIAGNOZY --


  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-900 text-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
       
        <div className="flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-purple-400 transition-colors w-fit group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Wróć do listy
          </Link>

          {isOwner && (
            <div className="flex gap-3">
              <Link 
                to={`/edit-meeting/${id}`} 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Edytuj
              </Link>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isDeleting ? "Usuwanie..." : "Usuń"}
              </button>
            </div>
          )}
        </div>

        
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">{meeting.title}</h1>
          
          
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-medium">
            <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              📅 {meeting.date}
            </span>
            <span className="text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              ⏰ {meeting.time}
            </span>
            {meeting.price !== undefined && (
              <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                💰 {meeting.price === 0 ? "Za darmo" : `${meeting.price} PLN`}
              </span>
            )}
            {meeting.number_of_seats !== undefined && (
              <span className="text-purple-400 bg-purple-400/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                👥 Miejsc: {meeting.number_of_seats}
              </span>
            )}
          </div>

          
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
              
              {meeting.creator_name ? meeting.creator_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Organizator spotkania</p>
              <p className="text-lg font-bold text-gray-100">
                {meeting.creator_name || "Użytkownik #" + meeting.author_id}
              </p>
            </div>
          </div>

          
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed mb-8">
            <p>{meeting.description}</p>
          </div>

          
          <div className="border-t border-gray-700 pt-6">
            <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/20 mb-6">
              Zapisz się na spotkanie
            </button>
            
            {!isOwner && (
              <QuickMessage 
                  receiverId={meeting.created_by} 
                  receiverName={meeting.creator_name} 
              />
            )}
          </div>
        </div>

        
        <MeetingComments meetingId={meeting.id} />

      </div>
    </div>
  );
}