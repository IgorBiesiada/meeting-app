import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function OAuthCallback() {
  const { provider } = useParams(); 
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Przetwarzanie logowania...");

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setStatus("Błąd: Brak kodu autoryzacji.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    const authenticateWithBackend = async () => {
      try {
        
        const response = await fetch(`${API_URL}auth/${provider}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify({ code: code }),
        });

        const data = await response.json();

        if (response.ok) {
          
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          
          setStatus("Zalogowano pomyślnie! Przekierowanie...");
          
          
          setTimeout(() => navigate("/"), 1000);
        } else {
          console.error("Błąd z backendu:", data);
          setStatus("Błąd logowania. Spróbuj ponownie.");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        console.error("Błąd sieci:", error);
        setStatus("Błąd połączenia z serwerem.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    authenticateWithBackend();
  }, [provider, searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center border border-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-100">{status}</h2>
        <p className="text-gray-400 text-sm mt-2">Proszę czekać, weryfikujemy dane z {provider}...</p>
      </div>
    </div>
  );
}