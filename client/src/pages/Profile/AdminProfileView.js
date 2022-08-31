import React, { useState, useEffect } from 'react';
import AdminProfileViewHeader from '../../components/ProfileHeader/AdminProfileViewHeader';
import AdminProfileContent from '../../components/ProfileContent/AdminProfileContent';
import "./styles.css";
import { getUser } from '../../actions/user';
import { useLocation } from 'react-router';

function AdminProfileView (props) {

    //will check if the currentUserid provided through link matches the curentUser Id
    //If it does not, a get request will be made to get the currentUser's information
    const location = useLocation()
    const { userId } = location.state

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

    
    useEffect(() => {
        getUser(userId, setUserInfo)
    }, [])

    const setUserInfo = (data) => {
        setUser(data)
    }

    return (
        <div className="page"> 
            <AdminProfileViewHeader currentUser={user} page={'profile'} />
            <AdminProfileContent currentUser={user} isView={true} setUser = {null} />
        </div>

    );
}

export default AdminProfileView;