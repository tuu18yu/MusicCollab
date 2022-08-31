import React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProfileViewNav (props) {

    const profileClass = props.page === 'profile' ? "side-nav-link active-page": "side-nav-link";
    const followingsClass = props.page === 'followings' ? "side-nav-link active-page": "side-nav-link";
    const followersClass = props.page === 'followers' ? "side-nav-link active-page": "side-nav-link";
  
    return (
        <div id="side-nav">
            <Link to={{
                pathname: "/FollowersView",
                state: {
                    header: "Followers",
                    list: props.currentUser.followers,
                    externalView: props.externalView
                }}} className={followersClass}>Followers: <span className="internal-profile-stats-num">{props.currentUser.followersNum}</span></Link>
            <Link to={{
                pathname: "/FollowingsView",
                state: {
                    header: "Followings",
                    list: props.currentUser.followings,
                    externalView: props.externalView
                }}} className={followingsClass}>Following: <span className="internal-profile-stats-num">{props.currentUser.followingsNum}</span></Link>
            <Link to="/ProfileView" className={profileClass}>Profile</Link>
        </div>
    );
}

ProfileViewNav.propTypes = {
    page: PropTypes.string,
    currentUser: PropTypes.object,
    externalView: PropTypes.bool
};

export default ProfileViewNav;