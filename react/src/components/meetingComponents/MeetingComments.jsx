import { useState, useEffect } from "react";

export default function MeetingComments({ meetingId }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (isCommentsOpen) {
      const fetchComments = async () => {
        setIsLoading(true);
        setError(null);
        try {
          
          const token = localStorage.getItem("access_token");
          const response = await fetch(`http://localhost:8000/api/comments_list/${meetingId}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
          });
          
          if (!response.ok) {
            throw new Error("Błąd podczas pobierania komentarzy");
          }
          
          const data = await response.json();
          setComments(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
          setError("Nie udało się załadować dyskusji.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchComments();
    }
  }, [isCommentsOpen, meetingId]);

   
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    const token = localStorage.getItem("access_token");
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/add_comment/${meetingId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się dodać komentarza");
      }

      const addedComment = await response.json();
      
      
      setComments([...comments, addedComment]);
      setNewComment(""); 
    } catch (err) {
      console.error(err);
      alert("Błąd dodawania komentarza. Upewnij się, że jesteś zalogowany.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl mt-6">
      
      <button 
        onClick={() => setIsCommentsOpen(!isCommentsOpen)}
        className="w-full flex items-center justify-between p-6 bg-gray-800 hover:bg-gray-750 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-100">
            Dyskusja {comments.length > 0 && `(${comments.length})`}
          </h2>
        </div>
        <svg 
          className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isCommentsOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      
      <div className={`transition-all duration-300 ease-in-out ${isCommentsOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 pt-0 border-t border-gray-700/50">
          
          
          <form onSubmit={handleCommentSubmit} className="mb-8 mt-6 flex gap-3 items-start">
            
            <div className="shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm mt-0.5">
              Ty
            </div>
            
            
            <div className="relative flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Napisz komentarz..."
                disabled={isSubmitting}
                className="w-full bg-gray-900 border border-gray-700 rounded-full pl-5 pr-12 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="absolute right-1.5 top-1.5 p-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-transparent disabled:text-gray-600 text-white rounded-full transition-colors"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>

          
          {isLoading ? (
            <div className="text-center text-gray-500 text-sm py-4">Ładowanie dyskusji...</div>
          ) : error ? (
            <div className="text-center text-red-400 text-sm py-4">{error}</div>
          ) : (
            <div className="space-y-5">
              {comments.map((comment, index) => (
                <div key={comment.id || index} className="flex gap-3">
                  
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gray-700 text-gray-300">
                    {comment.author ? comment.author.charAt(0).toUpperCase() : "U"}
                  </div>
                  
                  <div className="flex-1">
                    
                    <div className="bg-gray-900 border border-gray-700/50 rounded-2xl rounded-tl-none px-4 py-3 inline-block max-w-full">
                      <span className="font-semibold text-sm text-gray-200 block mb-0.5">
                        {comment.author || "Użytkownik"}
                      </span>
                      <span className="text-sm text-gray-300">
                        {comment.text}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1 ml-2">
                      {comment.date || "przed chwilą"}
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  Nikt jeszcze nic nie napisał. Bądź pierwszy!
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}