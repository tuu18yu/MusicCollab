import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import { deleteRequest, acceptRequest } from '../../actions/request';



function RequestHeader (props) {


    const generateRequests = () => {
        if(!props.requests) return;

        return props.requests.map((request, idx) => {
            if(request){
                return (
                    <li className="request-section" key={idx}>
                        {!props.sentRequest && <p className="request-title"><span className="color-purple">{request.postId.title}</span>{" from "}<span className="color-purple"> {request.requestor.profileName}</span></p>}
                        {props.sentRequest && <p className="request-title">{request.postId.title + " to "} <span className="color-purple"> {request.acceptor.profileName}</span></p>}
                        <div classname="requests-btns-container">
                            <button className="btn right-margin" onClick={() => {props.setViewedRequest(props.requests[idx])}}>View</button>
                            {!props.sentRequest && !request.isAccepted && <button className="btn background-green right-margin" onClick={() => {acceptRequest(request._id)}}>Accept</button>}
                            {!props.sentRequest && !request.isAccepted && <button className="btn background-red right-margin" onClick={() => {deleteRequest(request._id)}}>Deny</button>}
                        </div>
                    </li>
                    
                );
            }   
        });
    };
    

    //view sets
    //accept updates
    //dele
  

    return(
        <div className="request-header no-overflow">
            <div className="requests-sidebar-container">
            <h2 className="sidebar-title">{props.sentRequest ? "Sent Feature Requests" : "Received Feature Requests"}</h2>
            <ul className="requests-sidebar">
               {generateRequests()}
            </ul>
        </div>
        </div>

    )
}

RequestHeader.propTypes = {
    requests: PropTypes.object,
    setViewedRequest: PropTypes.func,
    sentRequest: PropTypes.bool
};

export default RequestHeader;
