import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Loader from "../Loader/loader";
import "./Css/navBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let token = localStorage.getItem("Token");
  let decodeToken = jwtDecode(token);
  const role = decodeToken.role;

  const isRegisterPage = location.pathname === "/signup";

  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      setLoader(true);
      await axios
        .put(
          "http://localhost:8080/auth/updateIsActive",
          {},
          { headers: { auth: token } }
        )
        .then(() => {
          localStorage.clear();
          navigate("/login");
          setLoader(false);
        });
    } catch (error) {
      console.log("Error updating isActive status:", error);
      setLoader(false);
    }
  };

  return (
    <nav className="navbar">
      {loader && <Loader />}
      <div className="navbar-left">
        <Link to="/home">
          <span className="app-name">BlockChain .</span>
        </Link>
      </div>
      <div className="navbar-right">
        <div className="nav-options">
          {role === "DRP" && (
            <Link to="/createGovOrg" className="nav-link">
              Create Gov Organization
            </Link>
          )}
          {role === "DRP" && (
            <Link to="/addCitizen" className="nav-link">
              Add Citizen
            </Link>
          )}
          {role === "RGD" && (
            <Link to="/addBirthInfo" className="nav-link">
              Add BirthInfo
            </Link>
          )}
          {role === "DIAE" && (
            <Link to="/addPassportInfo" className="nav-link">
              Add PassportInfo
            </Link>
          )}
          {role === "DMT" && (
            <Link to="/addDrivingLicInfo" className="nav-link">
              Add DrivingLicenceInfo
            </Link>
          )}
          {role === "DRP" && (
            <Link to="/changeIdNIC" className="nav-link">
              Change IDInfo
            </Link>
          )}
          {role === "RGD" && (
            <Link to="/changeBirthNIC" className="nav-link">
              Change BirthInfo
            </Link>
          )}
          {role === "DIAE" && (
            <Link to="/changePassportInfoNIC" className="nav-link">
              Change PassportInfo
            </Link>
          )}
          {role === "DMT" && (
            <Link to="/changeDrivingLicInfoNIC" className="nav-link">
              Change DrivingLicenceInfo
            </Link>
          )}
          <Link to="/getWorldState" className="nav-link">
            View Citizen
          </Link>
          <Link to="/getHistory" className="nav-link">
            View Citizen History
          </Link>
          {role === "DRP" && !isRegisterPage && (
            <Link to="/signup" className="nav-link reg">
              Register
            </Link>
          )}
          <div className="user-dropdown">
            <button className="user-dropdown-button" onClick={handleToggle}>
              Hi {role} <span>&#9662;</span>
            </button>
            {isOpen && (
              <div className="user-dropdown-menu">
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
