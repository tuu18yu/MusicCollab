import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./styles.css";


function ProfileSettingsViewHeader (props) {

    const [photoChanged, setPhotoChanged] = useState(false);
    const [profileImageSrc, setProfileImageSrc] = useState(props.currentUser.imgSrc);
   
    const handleImgChange = (event) => {
        const image = event.target.files[0];
        if(image) {
            setProfileImageSrc(URL.createObjectURL(image));
            setPhotoChanged(true);
        }
    }

    const handleSave = () => {
        //a call will be made to send the new profile photo to the database
        setPhotoChanged(false);
    }

    const handleCancel = () => {
        setPhotoChanged(false);
        setProfileImageSrc(props.currentUser.imgSrc);
    }

    return (
            <div className="profile-header">
                <div id="profile-photo-container">
                    <img id="profile-photo" src={profileImageSrc} alt={"User Profile"}/>
                    <label id="change-photo-label" htmlFor="photo">Change Photo</label>
                    <input id="photo" type="file" accept=".png, .jpg, .jpeg" onChange={handleImgChange}/>
                </div>
                <div className="save-cancel-container" >
                    {photoChanged && <button className="box-btn" onClick={handleSave}>Save</button>}
                    {photoChanged && <button className="box-btn red-box-btn" onClick={handleCancel}>Cancel</button>}
                </div>
                <h2 id="username">{props.currentUser.username}</h2>
                <label className="header-sub-label">Username</label>        
                <br/>
                <br/>
                <br/>
                <br/>
            </div> 
        );
}


ProfileSettingsViewHeader.propTypes = {
    currentUser: PropTypes.object,
    imgSrc: PropTypes.string,
    handleImgChange: PropTypes.func
};

export default ProfileSettingsViewHeader;