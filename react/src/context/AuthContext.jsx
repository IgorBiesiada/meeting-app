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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}users/me/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          const userId = userData.id || userData.pk;
          if (userId) {
            localStorage.setItem("user_id", userId);
          }
          setIsLoggedIn(true);
        } else {
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

  
  const login = async (access, refresh, userId) => {
    localStorage.setItem("access_token", access);
    if (refresh) {
      localStorage.setItem("refresh_token", refresh);
    }
    
    if (userId) {
      
      localStorage.setItem("user_id", userId);
      setIsLoggedIn(true);
    } else {
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}users/me/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${access}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          const fetchedUserId = userData.id || userData.pk;
          if (fetchedUserId) {
            localStorage.setItem("user_id", fetchedUserId);
          }
        }
      } catch (err) {
        console.error("Nie udało się pobrać ID po logowaniu:", err);
      } finally {
        setIsLoggedIn(true);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        Ładowanie sesji...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);