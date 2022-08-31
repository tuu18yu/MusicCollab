import React from 'react';
import "./styles.css";
import PropTypes from 'prop-types';
import ProfileSettingsViewHeader from '../../components/ProfileSettingsHeader/ProfileSettingsView';
import ProfileSettingsContent from '../../components/ProfileSettingsContent';



function ProfileSettingsView (props) {

    return (
        <div className="page"> 
             <ProfileSettingsViewHeader currentUser={props.currentUser}/>
             <ProfileSettingsContent currentUser={props.currentUser}/>
        </div>
 
     );


}

ProfileSettingsView.propTypes = {
    currentUser: PropTypes.object
};

export default ProfileSettingsView;