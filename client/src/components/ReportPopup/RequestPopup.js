import React, { useState } from 'react';
import "./styles.css";
import PropTypes from 'prop-types';
import { addRequest } from '../../actions/request';

function RequestPopup (props) {

    const [submitted, setSubmitted] = useState(false);

    const [state, setState] = useState({value: ''})

    if(!props.trigger) return null;

    const handleSubmit = () => {
        //on submit a post request will be made to the server with the report details
        const requestorInfo = {id: props.currentUser.id, profileName: props.currentUser.profileName }
        const acceptorInfo = {id: props.requestedPost.artist.id, profileName: props.requestedPost.artist.profileName }
    
        const form = {
            postId: {id: props.requestedPost.id, title: props.requestedPost.title},
            acceptor: acceptorInfo,
            requestor: requestorInfo,
            comments: [{userId: props.currentUser.id, profileName: props.currentUser.profileName, comment: state.value}]
        }

        addRequest(form)
        setSubmitted(true);
    };

    // const getDateTime = () => {
    //     const today = new Date();
    //     const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //     const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //     const dateTime = date+' '+time;
    //     return dateTime
    // }

    const handleClose = () => {
        setSubmitted(false);
        props.handleTrigger();
    };


    const handleChange = (event) => {
        setState({value: event.target.value})
    }  

    return(
        <div className="popup-overlay">
            <button className="popup-close-btn" onClick={handleClose}>X</button>
            <div className="popup-content">
                <h3 className="box-title">{`Send Request to "${ props.requestedPost.artist.profileName }" to get access to download "${props.requestedPost.title}"`}</h3>
                <textarea id="report-text-box" className="bio-text-box"name="report-reason" placeholder={"Cannot leave this area blank!"} onChange={handleChange.bind(this)} value={state.value} />
                {!submitted && <button className="box-btn margin-10" onClick={handleSubmit}>Submit</button>}
                {submitted && <label className="box-label margin-10">Request Submitted</label>}
            </div>
        </div>
    );
}

RequestPopup.propTypes = {
    trigger: PropTypes.bool,
    currentUser: PropTypes.object,
    requestedPost: PropTypes.object,
    handleTrigger: PropTypes.func
};

export  default RequestPopup;

