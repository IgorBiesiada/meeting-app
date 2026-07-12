import { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Tu strzelasz do swojego endpointu logowania (np. JWT Token Obtain)
      console.log("Wysyłam dane logowania:", formData);
      
      /* PRZYKŁAD INTEGRACJI Z DJANGO SIMPLE JWT:
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // SUKCES: Zapisujemy token w pamięci przeglądarki!
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        console.log("Zalogowano pomyślnie, token zapisany.");
        
        // Tutaj przekierowujesz usera (np. window.location.href = "/dashboard")
      } else {
        // BŁĄD (np. 401 Unauthorized - złe hasło)
        setError("Nieprawidłowa nazwa użytkownika lub hasło.");
      }
      */

    } catch (err) {
      console.error(err);
      setError("Błąd połączenia z serwerem.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-2">
          Witaj ponownie
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Zaloguj się na swoje konto
        </p>
        
        {/* Obsługa błędu (np. złe hasło z Django) */}
        {error && (
          <p className="text-red-400 bg-red-500/10 p-3 rounded-lg text-sm mb-6 border border-red-500/20 text-center">
            {error}
          </p>
        )}
        
        {/* Pole: Nazwa użytkownika */}
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

        {/* Pole: Hasło */}
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        {/* Przycisk */}
        <button 
          type="submit" 
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
        >
          Zaloguj się
        </button>

        {/* Opcjonalny link na dół */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Nie masz jeszcze konta? <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">Zarejestruj się</a>
        </p>
      </form>
    </div>
  );
}