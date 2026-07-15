import { useState, useEffect } from "react";


export default function LocationAutocomplete({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY; 

  
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&lang=pl&limit=5&apiKey=${API_KEY}`
        );
        const data = await res.json();
        
        if (data.features) {
          setSuggestions(data.features);
        }
      } catch (err) {
        console.error("Błąd API Geoapify:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  
  const handleSelect = (feature) => {
    const props = feature.properties;
    
    const miasto = props.city || props.town || props.village || props.name;
    const region = props.state;
    
    
    setQuery(`${miasto}, ${region || ''}`.replace(/, $/, '')); 
    setSuggestions([]);

    
    if (onLocationSelect) {
      onLocationSelect({
        city: miasto,
        region: region,
        lat: props.lat,
        lon: props.lon,
      });
    }
  };

  return (
    <div className="relative mb-5 w-full">
      <input
        type="text"
        placeholder="Wpisz swoje miasto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 bg-gray-700 text-gray-100 border-2 border-transparent rounded-lg outline-none transition-all placeholder-gray-400 focus:border-purple-500 focus:bg-gray-600 focus:ring-4 focus:ring-purple-500/10"
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
          {suggestions.map((feature, index) => {
            const p = feature.properties;
            const nazwa = p.city || p.town || p.village || p.name;
            
            return (
              <li
                key={index}
                onClick={() => handleSelect(feature)}
                className="px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors"
              >
                <span className="font-bold">{nazwa}</span>
                {p.state && (
                  <span className="text-gray-500 text-sm ml-2">({p.state})</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}