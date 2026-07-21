import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function GithubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasFetched = useRef(false);
  
  const [status, setStatus] = useState("Trwa logowanie przez GitHub...");
  const [errorDetails, setErrorDetails] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const savedState = sessionStorage.getItem("oauth_state");
    
    if (code && !hasFetched.current) {
      hasFetched.current = true;

      
      if (returnedState !== savedState) {
        console.error("Invalid OAuth state");
        setStatus("Błąd weryfikacji sesji (Invalid State).");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }
      
      fetch(`${API_URL}auth/github/`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then(async (res) => {
          const data = await res.json();
          
          
          if (res.ok && data.access) { 
            
            
            login(data.access, data.refresh);
            
            sessionStorage.removeItem("oauth_state");
            navigate("/meetings"); 
          } else {
            setStatus("Django odrzuciło logowanie!");
            setErrorDetails(JSON.stringify(data));
          }
        })
        .catch((err) => {
          setStatus("Błąd sieci!");
          setErrorDetails(err.toString());
        });
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className={`text-xl font-bold mb-4 ${errorDetails ? 'text-red-500' : 'text-purple-400 animate-pulse'}`}>
        {status}
      </div>
      {errorDetails && (
        <div className="bg-gray-800 p-4 rounded-lg border border-red-500/30 text-red-400 max-w-2xl break-all font-mono text-sm">
          {errorDetails}
        </div>
      )}
    </div>
  );
}