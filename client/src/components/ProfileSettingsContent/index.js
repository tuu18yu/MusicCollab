import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import SelectCategories from '../SelectCategories';
import FormRow from '../FormRow';
import { updateUserProfileById, updateUserPasswordById } from '../../actions/user';
import { checkPassword } from '../../actions/user';


function ProfileSettingsContent (props) {

    const defaultProfileInputs = {
        profileName: props.currentUser.profileName,
        email: props.currentUser.email,
        interests: props.currentUser.interests
    };

    const defaultPasswordInput = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    };

    const [editProfile, setEditProfile] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [profileFormInputs, setProfileFormInputs] = useState(defaultProfileInputs);
    const [passwordFormInputs, setPasswordFormInputs] = useState(defaultPasswordInput);

    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setProfileFormInputs(inputs => ({...inputs, [name]: value}))
    }

    const handleInterestChange = (interestList) => {
        const name = 'interests';
        setProfileFormInputs(inputs => ({...inputs, [name]: interestList}))
    }

    const handleEdit = (event) => {
        //on save changes a post request will be made to the server with the profile form inputs
        event.preventDefault();
        if(editProfile) {
            if(!profileFormInputs.profileName || !profileFormInputs.email) {
                setEditProfile(!editProfile);
                alert("Invalid Inputs");
                return;
            }
            else {
                const id = {"id": props.currentUser._id, "isAdmin": false};
                updateUserProfileById({...id, ...profileFormInputs});
            }
        }
        
        setEditProfile(!editProfile);
        
    };

    const handlePasswordInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setPasswordFormInputs(inputs => ({...inputs, [name]: value}))
    }

    const changeValidPassword = (changed) => {
        if(changed === 1) {
            alert("Successfully changed password")
            setPasswordFormInputs(defaultPasswordInput);
            setChangePassword(!changePassword);
            props.updateUser()
        }
        else if(changed === 0) {
            alert("Failed to change password")
            setPasswordFormInputs(defaultPasswordInput);
            setChangePassword(!changePassword);
        }
    }

    const passwordValidation = (validity) => {
        if(validity === 1){
            if(passwordFormInputs.newPassword === "" || passwordFormInputs.confirmPassword === ""){
                return alert("You must fill all fields")
            }
            if(passwordFormInputs.newPassword !== passwordFormInputs.confirmPassword) {
                return alert("Passwords don't match!");
            } else {
                //call to server
                updateUserPasswordById(props.currentUser._id, passwordFormInputs.newPassword, changeValidPassword);
                return;
            }
        }
        else if(validity === 0){
            return alert("Wrong password!");
        }
        else {
            return alert("Could not verify password"); 
        }
    }
    


    const handlePasswordChange = (event) => {
        event.preventDefault();
        if(changePassword) {
            if(passwordFormInputs.oldPassword === ""){
                return alert("You must fill all fields")
            }
            checkPassword(props.currentUser.username, passwordFormInputs.oldPassword, passwordValidation)
        }
        else {
            setChangePassword(!changePassword);
        }
        //a post request will be made to the server with the new password
        
        
    };

    const handlePasswordCancel = () => {
        setChangePassword(!changePassword);
        setPasswordFormInputs(defaultPasswordInput);
    };

    const handleProfileCancel = () => {
        setEditProfile(!editProfile);
        setProfileFormInputs(defaultProfileInputs);
    };

    const profileClass = "input-box" + (!editProfile ? " disable" : "");

    const passwordClass = "input-box" + (!changePassword ? " disable" : "");


    return (
        <div id="container">
            <div id="header-container">
                <h1 className="page-title">Profile Settings</h1>
            </div>

            <div id="settings-container">
                <h3 className="section-title">Profile</h3>
                <form id="profile-form">
                    <FormRow label={"Profile Name"} type={"text"} className={profileClass} value={profileFormInputs.profileName} 
                        handleChange={handleInputChange} name={"profileName"}/>
                    <br/>
                    <FormRow label={"Email"} type={"text"} className={profileClass} value={profileFormInputs.email} 
                        handleChange={handleInputChange} name={"email"}/>
                    <br/>
                    <div className="row">
                        <label className="input-label">Interests</label>
                        <SelectCategories selectedValues={profileFormInputs.interests} disabled={!editProfile} handleSelect={handleInterestChange}/>
                       </div>
                </form>
                <br/>
                <button type="submit" form="profile-form" className="btn section-btn" id="change-profile-info-btn" onClick={handleEdit}>
                   {editProfile ? 'Save Changes' : 'Edit'}
                </button>
                {editProfile && <button className="btn section-btn settings-cancel-btn" onClick={handleProfileCancel}>Cancel</button>}
                
                <br/>
                <br/>

                <div id="password-container">
                    <h3 className="section-title">Password</h3>
                    <form id="password-form">
                        <FormRow label={"Old Password"} type={"password"} className={passwordClass} value={passwordFormInputs.oldPassword} 
                            handleChange={handlePasswordInputChange} name={"oldPassword"}/>
                        <br/>
                        <FormRow label={"New Password"} type={"password"} className={passwordClass} value={passwordFormInputs.newPassword} 
                            handleChange={handlePasswordInputChange} name={"newPassword"}/>
                        <br/>
                        <FormRow label={"Confirm Password"} type={"password"} className={passwordClass} value={passwordFormInputs.confirmPassword} 
                            handleChange={handlePasswordInputChange} name={"confirmPassword"}/>
                    </form>
                    <br/>
                    <button type="submit" form="password-form" className="btn section-btn" onClick={handlePasswordChange}>
                        {changePassword ? 'Save password' : 'Change Password'}
                    </button>
                    {changePassword && <button className="btn section-btn settings-cancel-btn" onClick={handlePasswordCancel}>Cancel</button>}
                </div>
            </div>
        </div>      
    );
}
    

ProfileSettingsContent.propTypes = {
    currentUser: PropTypes.object,
    updateUser: PropTypes.func
};

export default ProfileSettingsContent;