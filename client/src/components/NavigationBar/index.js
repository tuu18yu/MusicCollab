/*Put together by Bessey*/
/*We also made edits to the css file of this component*/
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./styles.css"; 
import { logout } from "../../actions/user";
import PropTypes from 'prop-types';

function NavigationBar(props) {
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
                to={{
                  pathname: "/Profile",
                  state: {
                      userId: props.currentUser ? props.currentUser.id : ""
                  }}}
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Profile
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink
                exact
                to="/ProfileSettings"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Settings
              </NavLink>
            </li> */}
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
                to="/SentRequests"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
	               Sent Requests
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/ReceivedRequests"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
	               Received Requests
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

NavigationBar.propTypes = {
  currentUser: PropTypes.object
};

export default NavigationBar;
