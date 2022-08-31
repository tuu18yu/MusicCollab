import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import ReportPopup from '../ReportPopup';
import RequestPopup from '../ReportPopup/RequestPopup';
import {Link } from "react-router-dom";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { likePost, unlikePost, downloadPost } from '../../actions/user';
import { removedLikeUser, addLikedUser, changeLikedCounts } from '../../actions/post';


function CoverHeader (props) {

    const [reportPopupTrigger, setReportPopupTrigger] = useState(false);
    const [requestPopupTrigger, setRequestPopupTrigger] = useState(false);


    // const checkLiked = () => {
    //     const likedList = props.currentUser.likedWorks
    //     for (let work of likedList) {
    //         if (work.id === props.currentPost.id) {
    //             setIsLiked({isLiked: true})
    //         }
    //     }
    // }

    const setlikePost = () => {
        let now = props.currentPost.likesCount
        if (!props.isLiked) {
            now = now + 1
            props.setIsLiked(true)
            likePost(props.currentUser.id, props.currentPost.id)
            addLikedUser(props.currentUser.id, props.currentPost.id)
            changeLikedCounts(props.currentPost.id, now)
        }
        else {
            now = now -1
            props.setIsLiked(false)
            unlikePost(props.currentUser.id, props.currentPost.id)
            removedLikeUser(props.currentUser.id, props.currentPost.id)
            changeLikedCounts(props.currentPost.id, now)
        }
    }

    const handleReport = () => {
        setReportPopupTrigger(!reportPopupTrigger);
    };

    const handleRequest = () => {
        setRequestPopupTrigger(!requestPopupTrigger);
    };

    const handleDownload = () => {
        downloadPost(props.currentUser.id, props.currentPost.id)
    }


    // const handleViewChange = () => {
    //     props.toggleView();
    // };

    

    const generateTags = (list) => {
        if(!list) return;

        return list.map((interest, idx) => {
            return (
                <li className="hashtag-cover-page" key={idx} id='descriptionTags'>
                    {'#'+ interest}
                </li>
            );   
        });
    
    };

    const generateGenres = (list) => {
        if(!list) return;

        return list.map((interest, idx) => {
            return (
                <li key={idx}>
                    <p className="interest">{interest}</p>
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


    return(
        <div className="cover-no-overflow">
                <img id="cover-photo" src={props.currentPost.coverPhoto.imageUrl} alt={"Song Cover"}/>
                <h3 id="profile-name"> {props.currentPost.title} by <Link to={{
                            pathname: `/Profile/${props.currentPost.artist.profileName}`,
                            state: { userId: props.currentPost.artist.id }
                }} className="purple-link"> {`${props.currentPost.artist.profileName}`} </Link> </h3>
                <AudioPlayer
                    src={props.currentPost.audio.audioUrl} autoPlayAfterSrcChange={false}/>
                <div id="coverButtons2">
                    {props.externalView && <button id="like-btn" className="btn" onClick={setlikePost}>{props.isLiked ? '💔 Unlike':'💜 Like'}</button>}
                </div>
                 <div id="description-box">
                    <h3 className="box-title">Description</h3>
                    <p id="description-text">{props.currentPost.description}</p>
                    <ul id="interests-list" className="no-left-padding">
                    <p className="hashtag">{(props.currentPost && props.currentPost.tags) ? props.currentPost.tags.join(" #") : ""}</p>
                        {//generateTags(props.currentPost.tags)
                        }
                    </ul>
                    <ul id="interests-list1">
                        {generateInterests(props.currentPost.categories)}
                    </ul>
                </div>
            <ReportPopup reportType={"post"} currentUser={props.currentUser} reported={props.currentPost} trigger={reportPopupTrigger} handleTrigger={handleReport}/>
            <RequestPopup currentUser={props.currentUser} requestedPost={props.currentPost} trigger={requestPopupTrigger} handleTrigger={handleRequest}/>
            <div id="coverButtons">
                {props.externalView && (props.hasAccess ? 
                <a href={props.currentPost.audio.audioUrl} target="_blank" onClick={handleDownload} id="download-btn" className="btn" download>Download</a>
                : <button className="btn" id="download-btn" onClick={handleRequest}>Request</button>) }
                <Link to={{
                            pathname: `/Features/${props.currentPost.title}`,
                            state: { postId: props.currentPost.id, userId: props.currentUser.id }
                        }} id="timeline-btn" className="btn">🎼 Features</Link>
                
                {!props.externalView && <Link to={{
                            pathname: `/CoverPageSettings/${props.currentPost.title}`,
                            state: { postId: props.currentPost.id }
                        }}  id="edit-btn" className="btn">Edit</Link>}
            </div>
            <br/>
            {props.externalView && <button id="report-btn" className="btn" onClick={handleReport}>Report</button>}
        </div>

    )
}

CoverHeader.propTypes = {
    externalView: PropTypes.bool,
    currentPost: PropTypes.object,
    currentUser: PropTypes.object,
    setWork: PropTypes.func,
    page: PropTypes.string,
    toggleView: PropTypes.func,
    setIsLiked: PropTypes.func,
    isLiked: PropTypes.bool,
    hasAccess: PropTypes.bool
};

export default CoverHeader;
