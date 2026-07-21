import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationAutocomplete from "./LocationAutocomplete"; 
import { useAuth } from "../context/AuthContext"; 

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterForm() {
  const navigate = useNavigate();
  
  const { isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    region: "",
    city: "",
    lat: "",
    lon: ""
  });
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      city: locationData.city,
      region: locationData.region,
      lat: locationData.lat,
      lon: locationData.lon,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch(`${API_URL}users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Konto założone! Możesz się zalogować.");
        navigate("/login"); 
      } else {
        setError(data); 
      }
    } catch (err) {
      console.error("Błąd sieci:", err);
      setError({ username: ["Błąd połączenia z serwerem."] });
    }
  };

  const handleGithubAuth = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID; 
    
    const redirectUri = `${window.location.origin}/oauth/github/callback`;
    
    
    const state = crypto.randomUUID();
    sessionStorage.setItem("oauth_state", state);

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email&state=${state}`;
  };

  const handleDiscordAuth = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    
    const redirectUri = `${window.location.origin}/oauth/discord/callback`;
    
    
    const state = crypto.randomUUID();
    sessionStorage.setItem("oauth_state", state);

    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email&state=${state}`;
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-900 px-4 py-8">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-2">
          Dołącz do nas
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Wypełnij dane, aby utworzyć konto
        </p>
        
        {error && (
          <div className="text-red-400 bg-red-500/10 p-3 rounded-lg text-sm mb-6 border border-red-500/20">
             {Object.keys(error).map((key) => (
                <p key={key} className="text-center">{`${key}: ${error[key]}`}</p>
             ))}
          </div>
        )}
        
        <div className="flex gap-4 mb-5">
          <input
            type="text"
            name="first_name"
            placeholder="Imię"
            value={formData.first_name}
            onChange={handleChange}
            className="w-1/2 px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Nazwisko"
            value={formData.last_name}
            onChange={handleChange}
            className="w-1/2 px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        <div className="mb-5">
          <input
            type="text"
            name="username"
            placeholder="Nazwa użytkownika"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        <div className="mb-5">
          <input
            type="email"
            name="email"
            placeholder="Adres e-mail"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        <LocationAutocomplete onLocationSelect={handleLocationSelect} />

        <div className="mb-6 mt-5">
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
        >
          Zarejestruj się
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-4 text-sm text-gray-400">lub zarejestruj przez</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleGithubAuth}
            className="w-1/2 flex items-center justify-center gap-2 py-3 bg-[#24292F] hover:bg-[#1b1f23] text-white rounded-lg transition-colors border border-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </button>
          
          <button
            type="button"
            onClick={handleDiscordAuth}
            className="w-1/2 flex items-center justify-center gap-2 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors border border-transparent"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.36,46,96.26,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Discord
          </button>
        </div>

        <p className="text-gray-400 text-sm text-center mt-6">
          Masz już konto? <a href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">Zaloguj się</a>
        </p>
      </form>
    </div>
  );
}