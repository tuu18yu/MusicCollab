import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import ProfileViewNav from '../ProfileSideNav/ProfileViewNav';
import ReportPopup from '../ReportPopup';


function ProfileViewHeader (props) {

    const [followBtnVal, setFollowBtnVal] = useState('+ Follow');
    const [followBtnId, setFollowBtnId] = useState('follow-btn');
    const [reportPopupTrigger, setReportPopupTrigger] = useState(false);

    const handleReport = () => {
        setReportPopupTrigger(!reportPopupTrigger);
    };

    const handleFollow = () => {
        if(followBtnVal === '+ Follow') {
            setFollowBtnVal('Unfollow');
            setFollowBtnId('unfollow-btn');
        } else {
            setFollowBtnVal('+ Follow');
            setFollowBtnId('follow-btn');

        }
    };

    return(
        <div className="profile-header no-overflow">
            <div id="hidden-container">
            
            <img id="profile-photo" src={props.currentUser.imgSrc} alt={"User Profile"}/>
            <h2 id="profile-name">{props.currentUser.profileName}</h2>
            <br/>
            {props.externalView && <button id={followBtnId} className="btn" onClick={handleFollow}>{followBtnVal}</button>}
            <br/>
            <br/>
            <ProfileViewNav page={props.page} currentUser={props.currentUser} externalView={props.externalView}/>
            <br/>
            </div>
            <div id="overflow-container">
                <ReportPopup trigger={reportPopupTrigger} handleTrigger={handleReport}/>
                {props.externalView && <button id="report-btn" className="btn" onClick={handleReport}>Report</button>}
            </div>
        </div>

    )
}

ProfileViewHeader.propTypes = {
    externalView: PropTypes.bool,
    currentUser: PropTypes.object,
    page: PropTypes.string,
    toggleView: PropTypes.func
};

export default ProfileViewHeader;