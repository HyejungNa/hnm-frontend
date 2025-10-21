import React from "react";
import "../style/logo.style.css";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div>
      <div className="nav-logo">
        <Link to="/" className="logo">
          <span className="logo-text">HAMÉ</span>
        </Link>
      </div>
    </div>
  );
};

export default Logo;
