import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
 
  const meetingId = searchParams.get("meeting_id"); 

  useEffect(() => {
    
    const timer = setTimeout(() => {
      if (meetingId) {
        navigate(`/meeting/${meetingId}`);
      } else {
        navigate("/"); 
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, meetingId]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold text-emerald-400 mb-4">Płatność udana!</h1>
      <p className="text-gray-400 mb-6">
        Potwierdzamy płatność i dodajemy Cię do spotkania. Za chwilę nastąpi przekierowanie...
      </p>
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}