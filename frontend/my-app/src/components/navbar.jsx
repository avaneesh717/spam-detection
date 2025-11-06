import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link className="nav-brand" to={token ? "/dashboard" : "/"}>Spam Detector</Link>
        {token ? (
          <nav className="nav-links">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/search">Search</Link>
            <button className="btn btn-muted" onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
          </nav>
        ) : (
          <nav className="nav-links">
            <Link className="nav-link" to="/">Login</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
