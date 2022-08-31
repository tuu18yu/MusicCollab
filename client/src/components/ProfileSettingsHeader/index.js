import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import ProfileSideNav from '../ProfileSideNav';
import defaultProfilePhoto from '../../data/default_profile_photo.jpeg';
import { updateUserPhotoByID } from '../../actions/user';


function ProfileSettingsHeader (props) {

    const [photoChanged, setPhotoChanged] = useState(false);
    const [savedProfileImageSrc, setSavedProfileImageSrc] = useState(props.currentUser.profilePhoto ? props.currentUser.profilePhoto.imageUrl : defaultProfilePhoto);
    const [profileImageSrc, setProfileImageSrc] = useState(props.currentUser.profilePhoto ? props.currentUser.profilePhoto.imageUrl : defaultProfilePhoto);
    const [imageFile, setImageFile] = useState();
    const [followersNum, setFollowersNum] = useState()
    const [followingsNum, setFollowingsNum] = useState()


    useEffect(() =>
    {
        if(props.currentUser) {
            setFollowersNum(props.currentUser.followers.length)
            setFollowingsNum(props.currentUser.followings.length)
        }
    }, [props.currentUser])
   
    const handleImgChange = (event) => {
        const image = event.target.files[0];
        if(image) {
            setProfileImageSrc(URL.createObjectURL(image));
            setPhotoChanged(true);
            setImageFile(image);
        }
    }

    const handleSave = () => {

        if(imageFile) {
            let form = new FormData();
            form.append("userId", props.currentUser._id);
            form.append("imageId", props.currentUser.profilePhoto ? props.currentUser.profilePhoto.imageId : "");
            form.append("image", imageFile);
            updateUserPhotoByID(form)
            setPhotoChanged(false);
            setSavedProfileImageSrc(profileImageSrc)
        }
        //a post call will be made to send the new profile photo to the server
        
    }

    const handleCancel = () => {
        setPhotoChanged(false);
        setProfileImageSrc(savedProfileImageSrc);
    }

    return (
            <div className="profile-header">
                <div id="profile-photo-container">
                    <img id="profile-photo" src={profileImageSrc} alt={"User Profile"}/>
                    <label id="change-photo-label" htmlFor="photo">Change Photo</label>
                    <input id="photo" type="file" accept=".png, .jpg, .jpeg" onChange={(event) => {handleImgChange(event)}}/>
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
                <ProfileSideNav page={'settings'} currentUser={props.currentUser} externalView={false} followersNum={followersNum} followingsNum={followingsNum}/>
            </div> 
        );
}


ProfileSettingsHeader.propTypes = {
    currentUser: PropTypes.object,
    imgSrc: PropTypes.string,
    handleImgChange: PropTypes.func
};

export default ProfileSettingsHeader;