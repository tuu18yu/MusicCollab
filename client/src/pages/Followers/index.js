import React, { useState, useEffect } from 'react';
import ProfileHeader from '../../components/ProfileHeader';
import PropTypes from 'prop-types';
import FollowList from '../../components/FollowList';
import { useLocation } from 'react-router';
import { getUserByID } from '../../actions/user';



function Follows (props) {

    const location = useLocation();
    const {header, userId} = location.state;
    const [user, setUser] = useState();
    const [loggedUser, setLoggedUser] = useState();
    const [externalView, setExternalView] = useState(false);

    useEffect(() => {

            if(userId){
                getUserByID(userId, setUser);
            }
            else if(props.currentUser && props.currentUser.id){
                getUserByID(props.currentUser.id, setUser);
            }

            if(props.currentUser && userId && props.currentUser.id) {
                if(props.currentUser.id !== userId) {
                    setExternalView(true)
                }
                else{
                    setExternalView(false)
                }
            }
            if(props.currentUser && props.currentUser.id) {
                getUserByID(props.currentUserid, setLoggedUser)
            }
  
    }, [userId, props.currentUser])



    return (
        <div className="page">
            {user && <ProfileHeader externalView={externalView} currentUser={user} page={header === 'Followings'? 'followings':'followers'} loggedUser={loggedUser}/>}
            {user && <FollowList header={header} list={header === 'Followings'? user.followings : user.followers} user={user}/>}
        </div>
    );
}

Follows.propType = {
    currentUser: PropTypes.object
};

export default Follows;
