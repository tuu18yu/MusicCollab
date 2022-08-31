import React, { useEffect, useState } from 'react';
import "./styles.css";
import PropTypes from 'prop-types';
import AdminProfileSettingsHeader from '../../components/ProfileSettingsHeader/AdminProfileSettingsHeader';
import AdminProfileSettingsContent from '../../components/ProfileSettingsContent/AdminProfileSettingsContent';
import { getUserByID } from '../../actions/user';

function AdminProfileSettings (props) {

    const [user, setUser] = useState();

    const updateUser = (id, setState) => {

        getUserByID(id, setState) 

    }

    const updateWithCurrentId = () => {

        updateUser(props.currentUser.id, setUser)

    }

    useEffect(() => {

        if(props.currentUser && props.currentUser.id){
            updateWithCurrentId();
        }

    }, [props.currentUser])

    return (
        <div className="page"> 
             {user &&  <AdminProfileSettingsHeader currentUser={user}/>}
             {user && <AdminProfileSettingsContent currentUser={user} updateUser={updateWithCurrentId}/>}
        </div>
 
     );


}

AdminProfileSettings.propTypes = {
    currentUser: PropTypes.object
};

export default AdminProfileSettings;