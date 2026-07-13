import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Navbar from "./components/Navbar";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

export default function App() {
    const isLoggedIn = false;
    
    return(
        <BrowserRouter>
            {isLoggedIn && (
            <header> 
                <Navbar />
            </header>
            )}
            
            <main>
                <Routes>
                    <Route path="/" element={<RegisterForm />} />
                    <Route path="/login/" element={<LoginForm />} />
                </Routes>
            </main>
        
        </BrowserRouter>
        )
}