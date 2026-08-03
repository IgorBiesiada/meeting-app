import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Wysyłam zapytanie do:", `${import.meta.env.VITE_API_BASE_URL}users/me/`);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}users/me/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        console.log("Status odpowiedzi HTTP:", response.status);

        if (response.ok) {
          const userData = await response.json();
          const userId = userData.id || userData.pk;
          if (userId) {
            localStorage.setItem("user_id", userId);
          }
          setIsLoggedIn(true);
        } else {
          const errorText = await response.text();
          console.error("DJANGO ODRZUCIŁO ZAPYTANIE! Szczegóły:", errorText);
          logout();
        }
      } catch (error) {
        console.error("BŁĄD SIECI / CORS:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = (access, refresh, userId) => {
    localStorage.setItem("access_token", access);
    if (refresh) {
      localStorage.setItem("refresh_token", refresh);
    }
    if (userId) {
      localStorage.setItem("user_id", userId);
    }
    setIsLoggedIn(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        Ładowanie sesji...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);