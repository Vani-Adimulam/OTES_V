import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import logo from "./assets/p2f-semi-logo-img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false
  );
  const [showHomeLink, setShowHomeLink] = useState(
    JSON.parse(localStorage.getItem("showHomeLink")) || true
  );
  const handleLogInClick = () => {
    setIsLoggedIn(true);
    setShowHomeLink(false);
  };
  const handleHomeClick = () => {
    setShowHomeLink(true);
    setIsLoggedIn(false);
  };
  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    localStorage.setItem("showHomeLink", JSON.stringify(showHomeLink));
  }, [isLoggedIn, showHomeLink]);
  return (
    <div
      className="navbar navbar-expand-lg navbar-dark bg-dark navbar-fixed fixed-top"
      style={{ justifyContent: "space-between" }}
    >
      {/* <img src={logo} alt="" style={{ height: "40px", marginLeft: "15px" }} /> */}
      <span
        style={{
          float: "left",
          fontSize: "40px",
          fontWeight: "650",
          backgroundImage:
          "linear-gradient(90deg, rgba(79,199,44,1) 8%, rgba(234,231,15,1) 24%, rgba(255,0,22,1) 49%)",
          WebkitBackgroundClip: "text",
          MozBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          marginLeft: "100px",
        }}
        className="navbar-brand"
      >
        Online Assessment Test
      </span>
      <div className="d-flex">
        {showHomeLink && (
          <Link to="/" className="navbar-brand" onClick={handleHomeClick}>
            <FontAwesomeIcon icon={faHouse} />
            <span>Home</span>
          </Link>
        )}
        {!isLoggedIn && showHomeLink && (
          <Link
            to="/Login"
            className="navbar-brand"
            onClick={handleLogInClick}
          >
            <FontAwesomeIcon icon={faRightToBracket} />
            <span>Login</span>
          </Link>
        )}
        {isLoggedIn && showHomeLink }
      </div>
    </div>
  );
};
export default Nav;