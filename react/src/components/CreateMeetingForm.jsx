import { useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete"; 

const API_URL = import.meta.env.VITE_API_BASE_URL;

function formatErrorMessages(errorData) {
  return Object.entries(errorData).map(([key, value]) => {
    const message = Array.isArray(value) ? value.join(" ") : String(value);
    return { key, message };
  });
}

export default function CreateMeetingForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    number_of_seats: "",
    price: "",
    meeting_city: "",
    meeting_region: "",
    street: "",
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [locationKey, setLocationKey] = useState(0);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleLocationSelect = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      meeting_city: locationData.city || "",
      meeting_region: locationData.region || "",
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      number_of_seats: "",
      price: "",
      meeting_city: "",
      meeting_region: "",
      street: "",
    });
    setLocationKey((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.meeting_city.trim()) {
      setError({ meeting_city: ["Wybierz miasto z listy podpowiedzi."] });
      return;
    }
  
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setError({ auth: ["Musisz być zalogowany, aby utworzyć spotkanie."] });
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        number_of_seats: Number(formData.number_of_seats),
        price: formData.price === "" ? "0" : formData.price,
        meeting_city: formData.meeting_city,
        meeting_region: formData.meeting_region,
        street: formData.street,
      };

      const response = await fetch(`http://localhost:8000/api/meetings/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        resetForm();
      } else {
        setError(data); 
      }

    } catch (err) {
      console.error("Błąd sieci:", err);
      setError({ non_field_errors: ["Błąd połączenia z serwerem."] });
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-900 px-4 py-12">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-2">
          Utwórz spotkanie
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Wypełnij szczegóły, aby zaprosić innych
        </p>
        
        
        {error && (
          <div className="text-red-400 bg-red-500/10 p-4 rounded-lg text-sm mb-6 border border-red-500/20">
             {formatErrorMessages(error).map(({ key, message }) => (
                <p key={key} className="mb-1 last:mb-0">
                  <span className="font-bold capitalize">{key.replace(/_/g, " ")}:</span> {message}
                </p>
             ))}
          </div>
        )}

        
        {success && (
          <div className="text-emerald-400 bg-emerald-500/10 p-4 rounded-lg text-sm mb-6 border border-emerald-500/20 text-center font-bold">
            Spotkanie zostało utworzone pomyślnie!
          </div>
        )}
        
        
        <div className="mb-5">
          <input
            type="text"
            name="title"
            placeholder="Tytuł spotkania (np. Wspólne kodowanie w Pythonie)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        
        <div className="mb-5">
          <textarea
            name="description"
            placeholder="Opis spotkania..."
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10 resize-none"
          ></textarea>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <div className="w-full sm:w-1/2">
            <label className="block text-gray-400 text-xs mb-1 ml-1">Data spotkania</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-gray-400 text-xs mb-1 ml-1">Godzina</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <div className="w-full sm:w-1/2">
             <input
              type="number"
              name="number_of_seats"
              placeholder="Ilość miejsc"
              min="1"
              value={formData.number_of_seats}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
            />
          </div>
          <div className="w-full sm:w-1/2 relative">
            <input
              type="number"
              name="price"
              placeholder="Cena (0 jeśli darmowe)"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">PLN</span>
          </div>
        </div>

        
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-4 text-sm text-gray-400">Lokalizacja</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        
        <LocationAutocomplete key={locationKey} onLocationSelect={handleLocationSelect} />

        {formData.meeting_city && (
          <p className="text-sm text-emerald-400 mb-4 -mt-3">
            Wybrano: {formData.meeting_city}
            {formData.meeting_region ? `, ${formData.meeting_region}` : ""}
          </p>
        )}

        
        <div className="mb-6 mt-[-0.5rem]">
          <input
            type="text"
            name="street"
            placeholder="Ulica i numer lokalu (np. Długa 15/2)"
            value={formData.street}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        
        <button 
          type="submit" 
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
        >
          Opublikuj spotkanie
        </button>
      </form>
    </div>
  );
}