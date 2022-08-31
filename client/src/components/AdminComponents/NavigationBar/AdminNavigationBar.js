import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./styles.css"; 
import { logout } from "../../../actions/user";

function AdminNavigationBar(props) {
  const [click, setClick] = useState(false);
  const logOut = () => {
    setClick(!click)
    logout(props.changeState)
  }
  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            Music Collab
            <i className="fas fa-code"></i>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/AdminProfile"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/UserManagement"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Users
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/PostManagement"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Posts
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/ReportManagement"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Reports
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/Explore"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Explore
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={logOut}
              >
	            Log Out
              </NavLink>
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AdminNavigationBar;
