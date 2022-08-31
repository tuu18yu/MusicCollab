import React from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import { clearActivity } from '../../actions/user';


function AdminProfileContent (props) {

    const generateLogs = (list) => {
        if(!list) return;

        return list.map((log, idx) => {
            return (
                <li key={idx}>
                    <p>{log}</p>
                </li>
            );   
        });
    
    };

    function clear() {
        props.setUser(["activityLog", []])
        clearActivity(props.currentUser.id)
    }

    const activityLogBox = () => { return (
                                <div className="large-dark-box-activty">
                                    <h3 className="box-title">Activity Log</h3>
                                    <div>
                                        <ul>
                                        {generateLogs(props.currentUser.activityLog)}
                                        </ul>
                                    </div>    
                                </div>
    );};


    return (
        <div id="profile-content">  
            {activityLogBox()}
            {!props.isView && <button type="select" onClick={ () => clear() }>Clear Logs</button>}
        </div>
    )

}

AdminProfileContent.propTypes = {
    currentUser: PropTypes.object,
    isView: PropTypes.bool,
    setUser: PropTypes.func

}

export default AdminProfileContent;