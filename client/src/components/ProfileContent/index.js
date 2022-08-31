import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import "./styles.css";
import { getUsersPosts } from '../../actions/post';
import { getPostsWithIds } from '../../actions/post';
import { updateUserBioByID } from '../../actions/user';


function ProfileContent (props) {

    const[editMode, setEditMode] = useState(false);
    const[editBtnVal, setEditBtnVal] = useState('Edit');
    const[bio, setBio] = useState()
    const[profileWorks, setProfileWorks] = useState([]);
    const[downloadedWorks, setDownloadedWorksState] = useState([]);
    const[interests, setInterests] = useState()

    const setProfileWorksState = (works) => {
        setProfileWorks(works)
    }

    useEffect(() => {

        getUsersPosts(props.user._id, setProfileWorksState);
        getPostsWithIds(props.user.downloadedWorks, setDownloadedWorksState);
        setBio(props.user.biography)
        setInterests(props.user.interests)
  
    }, [props.user])

    const generateWorks = (works) => {
        if(!works) return;
        return works.map((work, idx) => {
            return (
                <li key={idx}>
                    <Link className="profile-works-link" to={{
                        pathname: `/CoverPage/${work.title}`,
                        state: { postId: work._id }
                        }}>
                        <img src={work.coverPhoto.imageUrl} alt='work cover'/>
                    </Link> 
                    <Link className="profile-works-link" to={{
                                pathname: `/CoverPage/${work.title}`,
                                state: { postId: work._id }
                                }}>{work.title}</Link> 
                </li>
            );   
        });
    
    };

    const generateInterests = (list) => {
        if(!list) return;

        return list.map((interest, idx) => {
            if(interest){
                return (
                    <li key={idx}>
                        <p className="interest">{interest}</p>
                    </li>
                );
            }   
        });
    
    };

    const updateUserInfo = async () => {
        await updateUserBioByID(props.user._id, bio)
        await props.updateUser();
    }

    const handleEdit = () => {
        if(editMode === false) {
            setEditMode(true);
            setEditBtnVal('Save');
        } else {
            //on Save a post request will be made to the server with the new bio
            updateUserInfo()
            setEditMode(false);
            setEditBtnVal('Edit');
        }
    }

    const handleCancel = () => {
        setEditMode(false);
        setEditBtnVal('Edit');
        setBio(props.user.biography);
    }

    const worksBox = () => { 
        return (
                                <div className="large-dark-box">
                                    <h3 className="box-title">Works</h3>
                                    <div className="profile-works">
                                        <ul className="small-works-list">
                                        {generateWorks(profileWorks)}
                                        </ul>
                                    </div>
                                </div>
    );};

    const handleTextChange = (e) => {
        setBio(e.target.value);
    }

    const bioBox = () => { return (
                                <div className={props.externalView ? "tall-small-dark-box" : "small-dark-box height-200"}>
                                    <h3 className="box-title">Biography</h3>
                                    <div id="bio-container">
                                        <textarea className="bio-text-box" name="biography" value={bio} onChange={handleTextChange}
                                            readOnly={props.externalView || (!props.externalView && !editMode)}/>
                                    </div>
                                    {!props.externalView && 
                                        (<div className="bio-btns">
                                            <button className="box-btn margin-left" onClick={handleEdit}>{editBtnVal}</button>
                                            {editMode && <button className="box-btn red-box-btn" onClick={handleCancel}>Cancel</button>}
                                        </div>)
                                    }
                                </div>
    );};

    const interestsBox = () => { return (
                                <div className="tall-small-dark-box">
                                    <h3 className="box-title">Interests</h3>
                                    <ul className="interests-list">
                                        {generateInterests(interests)}
                                    </ul>
                                </div>
    );};

    const downloadsBox = () => { 
        return ( 
            <div className="small-dark-box height-300">
                <h3 className="box-title">Downloads</h3>
                <div className="profile-works">
                    <ul className="small-works-list">
                        {generateWorks(downloadedWorks)}
                    </ul>
                </div>
            </div>
    );};



    return (
        <div id="profile-content">
            {!props.externalView && bioBox()}
            {props.externalView && 
                (<div id="top-profile-content">
                    {bioBox()}
                    {interestsBox()}
                </div>)}
            {!props.externalView && downloadsBox()}      
            {worksBox()}

            
        </div>
    )

}

ProfileContent.propTypes = {
    user: PropTypes.object,
    externalView: PropTypes.bool,
    updateUser: PropTypes.func
}

export default ProfileContent;