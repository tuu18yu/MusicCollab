import React, { useEffect, useState }  from 'react';
import "./styles.css";
import EditUserHeader from '../../components/ProfileSettingsHeader/editUserHeader';
import ProfileSettingsContent from '../../components/ProfileSettingsContent';
import { getUserByID } from '../../actions/user';
import { useLocation } from 'react-router';

function EditUser () {

    const [user, setUser] = useState();
    const location = useLocation();
    const {userId} = location.state

    const updateUser = (id, setState) => {

        getUserByID(id, setState) 

    }

    const updateWithUserId = () => {

        updateUser(userId, setUser)

    }

    useEffect(() => {

        if(userId) {
            updateWithUserId();
        }

    }, [])

    return (
        <div className="page"> 
             {user && <EditUserHeader currentUser={user} />}
             {user && <ProfileSettingsContent currentUser={user} updateUser={updateWithUserId}/>}
        </div>
 
     );

}

export default EditUser;