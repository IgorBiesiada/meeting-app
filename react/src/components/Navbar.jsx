import { Link } from "react-router-dom";

export default function Navbar() {
    
return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-outline">
            Zaloguj
          </Link>
          <Link to="/register" className="btn btn-primary">
            Rejestracja
          </Link>
        </div>
        
      </div>
    </nav>
  );

}