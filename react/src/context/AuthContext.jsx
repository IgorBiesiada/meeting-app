import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}auth/verify-token/`, {
          method: "GET", 
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          
          setIsLoggedIn(true);
        } else {
          
          logout();
        }
      } catch (error) {
        
        console.error("Błąd weryfikacji tokena:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []); 

  const login = (access, refresh) => {
    localStorage.setItem("access_token", access);
    if (refresh) {
      localStorage.setItem("refresh_token", refresh);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Ładowanie sesji...</div>;
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