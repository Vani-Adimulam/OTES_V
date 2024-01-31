import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import logo from "./assets/p2f-semi-logo-img.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
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
      className="navbar navbar-expand-lg navbar-fixed fixed-top"
      style={{ justifyContent: "space-between", backgroundColor: '#ffffff', margin: '0'}}
    >
      {/* <img src={logo} alt="" style={{ height: "40px", marginLeft: "15px" }} /> */}
      <span
        style={{
          float: "left",
          fontSize: "40px",
          fontWeight: "650",
          backgroundImage:
            "linear-gradient(to right, blue, orange)",
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
        {!showHomeLink && (
          <Link to="/" className="navbar-brand" onClick={handleHomeClick}>
            {/* <FontAwesomeIcon icon={faHouse} /> */}
            <span>Home</span>
          </Link>
        )}
        {!isLoggedIn && showHomeLink && (
          <Link
            to="/Login"
            className="navbar-brand"
            onClick={handleLogInClick}
          >
            {/* <FontAwesomeIcon icon={faRightToBracket} /> */}
            <span>Login</span>
          </Link>
        )}
        {isLoggedIn && showHomeLink }
      </div>
    </div>
  );
};
export default Nav;