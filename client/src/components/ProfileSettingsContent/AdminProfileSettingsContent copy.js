import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import FormRow from '../FormRow';


function AdminProfileSettingsContent (props) {

    const defaultProfileInputs = {
        profileName: props.currentUser.profileName,
        email: props.currentUser.email,
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

    const handleEdit = (event) => {
        event.preventDefault();
        setEditProfile(!editProfile);
        //on save changes a post request will be made to the database with the profile form inputs
    };

    const handlePasswordInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setPasswordFormInputs(inputs => ({...inputs, [name]: value}))
    }


    const handlePasswordChange = (event) => {
        event.preventDefault();
        if(changePassword) {
            if(passwordFormInputs.oldPassword !== props.currentUser.password) {
                return alert("Wrong password!");
            } else if(passwordFormInputs.newPassword !== passwordFormInputs.confirmPassword) {
                return alert("Passwords don't match!");
            } else {
                //a post request will be made to the database with the passowrd form inputs
                setPasswordFormInputs(defaultPasswordInput);
            }
        }
        setChangePassword(!changePassword);
        
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
    

AdminProfileSettingsContent.propTypes = {
    currentUser: PropTypes.object
};

export default AdminProfileSettingsContent;