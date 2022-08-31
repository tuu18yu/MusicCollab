import React from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import defaultProfilePhoto from '../../data/default_profile_photo.jpeg';



function AdminProfileViewHeader (props) {

    return(
        <div className="profile-header no-overflow">
            <div id="hidden-container">
            <img id="profile-photo" src={(props.currentUser && props.currentUser.profilePhoto) ? props.currentUser.profilePhoto.imageUrl : defaultProfilePhoto} alt={"User Profile"}/>
            <h2 id="profile-name">{props.currentUser.profileName}</h2>
            </div>
        </div>

    )
}

AdminProfileViewHeader.propTypes = {
    currentUser: PropTypes.object,
    page: PropTypes.string
};

export default AdminProfileViewHeader;