import React, { useState } from 'react';
import ReportPopup from '../../components/ReportPopup';
import CoverContent from '../../components/CoverContent';
import { Link } from 'react-router-dom';
import "./styles.css";
import PropTypes from 'prop-types';

function CoverPage (props) {

    const [externalView, setExternalView] = useState(false);
    

    //will check if the currentUserid provided through link matches the curentUser Id
    //If it does not, a get request will be made to get the currentUser's information

    const toggleView = () => {
        setExternalView(!externalView);
    };

    const [reportPopupTrigger, setReportPopupTrigger] = useState(false);

    const handleReport = () => {
        setReportPopupTrigger(!reportPopupTrigger);
    };

    const handleDelete = () => {
        const currID = props.currentPost.id
        const filteredUsers = props.currentUser.works.filter((w) => { return w.id != currID })
        props.setWork(filteredUsers)
    }

    const handleViewChange = () => {
        toggleView();
    };

    const generateTags = (list) => {
        if(!list) return;

        return list.map((interest, idx) => {
            return (
                <li key={idx}>
                    <p className="btn">{interest}</p>
                </li>
            );   
        });
    
    };



    const [state, setState] = useState ({
        comment: ""
    })

    const handleInputChange = (event) => {
        const target=event.target
        const value=target.value

        setState({
            comment: value
        })
    }

    const removeComment = (comment) => {
        const filteredList = props.currentPost.comments.filter((c) => { return c != comment })
        props.setComment(filteredList)
    }

    const addComment = () => {
        const commentList = props.currentPost.comments
        const newComment = [props.currentUser.profileName, state.comment, props.currentUser.username]
        commentList.push(newComment)

        props.setComment(commentList)
    }

    const generateUserComments = (list) => {
        if(!list) return;

        return list.map((comment, idx) => {
            if (comment[2] != props.currentUser.username) {
                return (
                    <li key={idx} className='comment-box'>
                        <div className='comment-username-container'>
                            <Link to="/Profile"><button id='comment-username-btn'>{comment[0]}</button></Link>
                        </div>
                        <div className='comment-content-container'>
                            <p id='comment-content'> {comment[1]} </p>
                        </div>
                       
                    </li>
                );  
            }
            else {
                return (
                    <li key={idx} className='curr-comment-box'>
                        <div className='comment-username-container'>
                        <Link to="/Profile"><button className='btn'>{comment[0]}</button></Link>
                        </div>
                        <div className='comment-content-container'>
                            <p id='comment-content'> {comment[1]} </p>
                        </div>
                        <button id='comment-delete-btn' onClick={ () => removeComment(comment) } >Delete</button>
                       
                    </li>
                );
            }  
        });
    };

    const generateComments = (list) => {
        if(!list) return;

        return list.map((comment, idx) => {
            return (
                <li key={idx} className='comment-box'>
                    <div className='comment-username-container'>
                        <button id='comment-username-btn'>{comment[0]}</button>
                    </div>
                    <div className='comment-content-container'>
                        <p id='comment-content'> {comment[1]} </p>
                    </div>
                    
                </li>
            );  
        });
    };

    return (
       <div className="page"> 
            <div className="cover-no-overflow">
                <img id="cover-photo" src={props.currentPost.imgSrc} alt={"Song Cover"}/>
                <h2 id="profile-name">{props.currentPost.artist} - {props.currentPost.title}</h2>
                <div id="description-box">
                    <h3 className="box-title">Description</h3>
                    <p id="description-text">{props.currentPost.description}</p>
                    <ul id="interests-list">
                        {generateTags(props.currentPost.tags)}
                    </ul>
            </div>
            <ReportPopup trigger={reportPopupTrigger} handleTrigger={handleReport}/>
            <div id="coverButtons">
                {externalView && <button id="download-btn" className="btn" onClick={handleReport}>Download</button>}
                <button id="timeline-btn" className="btn">Time Line</button>
                {externalView && <button id="report-btn" className="btn" onClick={handleReport}>Report</button>}
                {!externalView && <button id="edit-btn" className="btn">Edit</button>}
                
            </div>
            <br/>
            {<button className="btn" onClick={handleViewChange}>{externalView ? 'Internal View': 'External View'}</button>}
            </div>
            
            <div id="profile-content">
            <div className="comment-container">
                <h3 className="box-title">Comments</h3>
                    <div id="comments">
                        <ul className="comment-list">
                            {externalView && generateComments(props.currentPost.comments)}
                            {!externalView && generateUserComments(props.currentPost.comments)}
                        </ul>
                    </div>
                    <div className='comment-content-container'>
                        <input type="text" 
                            name='keyword'
                            id='input-comment-content' 
                            placeholder="Type Comment" 
                            value={ state.comment }
                            onChange={ handleInputChange }
                        />
                        <button id="comment-submit-btn" onClick={ () => addComment() }> Submit </button>
                    </div>
            </div>
        </div>
        </div>

    );
    
}

CoverPage.propTypes = {
    currentUser: PropTypes.object,
    currentPost: PropTypes.object,
    setComment: PropTypes.func
};

export default CoverPage;
