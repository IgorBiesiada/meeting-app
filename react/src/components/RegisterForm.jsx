import { useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
    console.log("Wysyłam do Django:", formData);
    
    
    const response = await fetch(`${API_URL}users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Konto utworzone pomyślnie!", data);
      alert("Konto założone! Możesz się zalogować.");
      window.location.href = "/login";
    } else {
      
      console.error("Django zwróciło błąd:", data);
      setError(data); 
    }

  } catch (err) {
    console.error("Błąd sieci:", err);
    setError({ username: ["Błąd połączenia z serwerem."] });
  }
};

  return (
    
    <div className="flex items-center justify-center min-h-[80vh]">
      
      
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
        
        
        {error?.username && (
          <p className="text-red-400 bg-red-500/10 p-3 rounded-lg text-sm mb-6 border border-red-500/20">
            {error.username[0]}
          </p>
        )}
        
        
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

        
        <button 
          type="submit" 
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  );
}