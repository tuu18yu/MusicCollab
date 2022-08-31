import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUserByID } from '../../actions/user';
import RequestsHeader from '../../components/RequestsHeader';
import { getReceivedRequests } from '../../actions/request';
import RequestComment from '../../components/CoverContent/requestComments';


function ReceivedRequests (props) {

    const [requests, setRequest] = useState([]);
    const [viewedRequest, setViewed] = useState({comments: [], _id: null});
    const [user, setUser] = useState()

    const setUserInfo  = (data) => {
        setUser(data);
    }
    const setReceivedRequests  = (data) => {
        setRequest(data);
    }
    const setViewedRequest  = (data) => {
        setViewed(data);
    }

    function setComment(child) {
        const name = 'comments'
        setViewed(inputs => ({...inputs, [name]: child}))
    }

    useEffect(() => {

            if(props.currentUser && props.currentUser.id) {
                getUserByID(props.currentUser.id, setUserInfo)
                getReceivedRequests(props.currentUser.id, setReceivedRequests)
            }

    }, [props.currentUser])


    return (
        <div className="page">
            {(requests.length === 0) && <h2>No feature Requests</h2>}
            {(requests.length!== 0) && <RequestsHeader requests={requests} setViewedRequest={setViewedRequest} sentRequest={false}/>}
            {(requests.length!== 0) && viewedRequest._id && <RequestComment setComment={setComment} currentPost={viewedRequest} currentUser={user}/>}
        </div>
    );
}

ReceivedRequests.propType = {
    currentUser: PropTypes.object
};

export default ReceivedRequests;
