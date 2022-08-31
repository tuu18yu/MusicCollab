import UserTable from './UserTable'
import React, { useState, useEffect } from 'react';
import 'react-router-dom'
import PropTypes from 'prop-types';
import { getUserInfo, getUser } from '../../actions/user';


function UserManagementPage(props) {
  
  //a get request will be made to the server to get the user details
  const [userData, setUserData] = useState({
    users: []
  })

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
      likedWorks: [], 
      followers: null,
      followings: null,
      lastLogIn: null,
      activityLog: null,
      profilePhoto: null
  })

  useEffect(() => {
    if (props.currentUser) {
        getUser(props.currentUser, setUserInfo)
    }
  }, [props.currentUser])

  const setUserInfo = (data) => {
      setUser(data)
  }


  function setUserChanged(child) {
    const name = child[0]
    setUserData(inputs => ({...inputs, [name]: child[1]}))
  }

  useEffect(() => {
    if (props.currentUser) {
      getUserInfo(setUserData)
      console.log('changed')
    }
  }, [])


    return (
      <div className='management-container'>
        <UserTable currentUser={props.currentUser} fullUser={user} setLog={props.setLog} users={userData.users} setUsers = {setUserChanged} />
      </div>
    );
}

UserManagementPage.propTypes = {
  currentUser: PropTypes.object,
  setLog: PropTypes.func
};

export default UserManagementPage;