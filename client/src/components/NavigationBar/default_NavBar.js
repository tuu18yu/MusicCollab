/*Put together by Bessey*/
/*We also made edits to the css file of this component*/
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./styles.css"; 
import PropTypes from 'prop-types';

function DefaultNavigationBar(props) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            TiedNote
            <i className="fas fa-code"></i>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
              
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
                to="/LogIn"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
	            Log In
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

DefaultNavigationBar.propTypes = {
  currentUser: PropTypes.object
};

export default DefaultNavigationBar;
