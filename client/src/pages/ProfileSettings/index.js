import React, { useEffect, useState }  from 'react';
import "./styles.css";
import PropTypes from 'prop-types';
import ProfileSettingsHeader from '../../components/ProfileSettingsHeader';
import ProfileSettingsContent from '../../components/ProfileSettingsContent';
import { getUserByID } from '../../actions/user';

function ProfileSettings (props) {

    const [user, setUser] = useState();

    const updateUser = (id, setState) => {

        getUserByID(id, setState) 

    }

    const updateWithCurrentId = () => {

        updateUser(props.currentUser.id, setUser)

    }

    useEffect(() => {

        if(props.currentUser && props.currentUser.id){
            getUserByID(props.currentUser.id, setUser)
        }

    }, [props.currentUser])

    return (
        <div className="page"> 
             {user && <ProfileSettingsHeader currentUser={user} loggedUser={user}/>}
             {user && <ProfileSettingsContent currentUser={user} updateUser={updateWithCurrentId}/>}
        </div>
 
     );

}

ProfileSettings.propTypes = {
    currentUser: PropTypes.object
};

export default ProfileSettings;