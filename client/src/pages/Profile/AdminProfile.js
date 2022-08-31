import React, { useState, useEffect } from 'react';
import AdminProfileHeader from '../../components/ProfileHeader/AdminProfileHeader';
import AdminProfileContent from '../../components/ProfileContent/AdminProfileContent';
import "./styles.css";
import PropTypes from 'prop-types';
import { getUser } from '../../actions/user';

function AdminProfile (props) {

    const [externalView, setExternalView] = useState(false);
    //will check if the currentUserid provided through link matches the curentUser Id
    //If it does not, a get request will be made to get the currentUser's information

    const toggleView = () => {
        setExternalView(!externalView);
    };

    const [user, setUser] = useState({
            username: null,
            isAdmin: null,
            id: null,
            password: null,
            profileName: null,
            email: null,
            interests: null,
            uploadedWorks: null,
            downloadedWorks: null,
            likedWorks: null, 
            followers: null,
            followings: null,
            lastLogIn: null,
            activityLog: null,
            profilePhoto: {imageUrl: null}
    })

    function setUserChanged(child) {
        const name = child[0]
        setUser(inputs => ({...inputs, [name]: child[1]}))
    }
    
    
    useEffect(() => {
        getUser(props.currentUser, setUser)
        console.log('chnaged')
    }, [])


    return (
        <div className="page"> 
            <AdminProfileHeader externalView={externalView} currentUser={user} page={'profile'} toggleView={toggleView}/>
            <AdminProfileContent currentUser={user} externalView={externalView} setUser = {setUserChanged} />
        </div>

    );
}

AdminProfile.propTypes = {
    currentUser: PropTypes.object
};

export default AdminProfile;