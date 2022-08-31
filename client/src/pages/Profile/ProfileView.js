import React, { useState } from 'react';
import ProfileViewHeader from '../../components/ProfileHeader/ProfileViewHeader';
import ProfileContent from '../../components/ProfileContent';
import "./styles.css";
import PropTypes from 'prop-types';

function ProfileView (props) {

    const [externalView, setExternalView] = useState(false);

    //will check if the currentUserid provided through link matches the curentUser Id
    //If it does not, a get request will be made to get the currentUser's information

    const toggleView = () => {
        setExternalView(!externalView);
    };


    return (
       <div className="page"> 
            <ProfileViewHeader externalView={externalView} currentUser={props.currentUser} page={'profile'} toggleView={toggleView}/>
            <ProfileContent currentUser={props.currentUser} externalView={externalView}/>
        </div>

    );
    
}

ProfileView.propTypes = {
    currentUser: PropTypes.object
};

export default ProfileView;