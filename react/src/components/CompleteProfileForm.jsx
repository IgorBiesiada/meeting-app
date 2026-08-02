import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationAutocomplete from "./LocationAutocomplete"; 

export default function CompleteProfileForm() {
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!locationData || !locationData.city) {
      setError("Musisz wybrać miasto z listy!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}users/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          city: locationData.city,
        })
      });

      if (response.ok) {
        navigate("/meetings");
      } else {
        const data = await response.json();
        setError(data.detail || "Coś poszło nie tak przy zapisie.");
      }
    } catch (err) {
      setError("Błąd połączenia z serwerem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-2 text-purple-400">
          Uzupełnij profil
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Skąd jesteś? Wybierz swoje miasto, abyśmy mogli dopasować spotkania.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          
          <LocationAutocomplete 
            onLocationSelect={(data) => setLocationData(data)} 
          />

          {error && (
            <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded border border-red-500/50">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !locationData}
            className={`w-full py-2 px-4 rounded-lg font-bold text-white transition-colors ${
              (isLoading || !locationData)
                ? "bg-purple-600/50 cursor-not-allowed" 
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isLoading ? "Zapisywanie..." : "Zapisz i wejdź"}
          </button>
        </form>
      </div>
    </div>
  );
}