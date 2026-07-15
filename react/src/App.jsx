import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import MeetingsPage from "./components/MeetingsPage"; 

export default function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(true);
    
  return(
    <BrowserRouter>
      
      <header> 
        <Navbar isLoggedIn={isLoggedIn} />
      </header>
            
      <main>
        <Routes>
          
          <Route path="/" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          
          
          <Route 
            path="/meetings" 
            element={isLoggedIn ? <MeetingsPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}