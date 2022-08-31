import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.css';
import { addRequestComment, deleteRequestComment } from '../../actions/request';


function RequestComment (props) {
    
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
        const filteredList = props.currentPost.comments.filter((c) => { return c !== comment })
        props.setComment(filteredList)
        deleteRequestComment(props.currentPost._id, comment._id)
    }

    const addComment = () => {
        const commentList = props.currentPost.comments
        const newComment = {profileName: props.currentUser.profileName, comment: state.comment, userId: props.currentUser._id}
        commentList.push(newComment)
        props.setComment(commentList)
        addRequestComment(newComment, props.currentPost._id)
    }

    const generateComments = (list) => {
        if(!list) return;

        return list.map((comment, idx) => {
            if (comment.userId !== props.currentUser._id) {
                return (
                    <li key={idx} className='comment-box'>
                        <div className='comment-username-container'>
                        <Link to={{
                                    pathname: `/Profile/${comment.profileName}`,
                                    state: { userId: comment.userId }
                                    }}><button id='comment-username-btn'>{comment.profileName}</button></Link>
                        </div>
                        <div className='comment-content-container'>
                            <p id='comment-content'> {comment.comment} </p>
                        </div>
                    
                    </li>
                );  
            }
            else {
                return (
                    <li key={idx} className='curr-comment-box'>
                        <div className='comment-username-container'>
                        <Link to={{
                                    pathname: `/Profile/${comment.profileName}`,
                                    state: { userId: comment.userId }
                                    }}><button className='btn'>{comment.profileName}</button></Link>
                        </div>
                        <div className='comment-content-container'>
                            <p id='comment-content'> {comment.comment} </p>
                        </div>
                        <div>
                            <button id='comment-delete-btn' onClick={ () => removeComment(comment) } >Delete</button>
                        </div>
                    </li>
                );
            } 
        });
    };


    
    return (
        <div id="profile-content">
            <div className="comment-container">
                <h3 className="box-title">Comments</h3>
                    <div id="comments">
                        <ul className="comment-list">
                            {generateComments(props.currentPost.comments)}
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
    )

}

RequestComment.propTypes = {
    currentUser: PropTypes.object,
    currentPost: PropTypes.object,
    setComment: PropTypes.func
}

export default RequestComment;