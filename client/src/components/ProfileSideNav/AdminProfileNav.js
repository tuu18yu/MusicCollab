import React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function AdminProfileNav (props) {

    const profileClass = props.page === 'profile' ? "side-nav-link active-page": "side-nav-link";
    const settingsClass = props.page === 'settings' ? "side-nav-link active-page": "side-nav-link";

    return (
        <div id="side-nav">
            <Link to="/AdminProfile" className={profileClass}>Profile</Link>
            <Link to="/AdminProfileSettings" className={settingsClass}>Settings</Link>
        </div>
    );
}

AdminProfileNav.propTypes = {
    page: PropTypes.string,
    currentUser: PropTypes.object,
};

export default AdminProfileNav;