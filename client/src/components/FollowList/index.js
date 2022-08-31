import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import "./styles.css";
import { getUsersWithIds } from '../../actions/user';
import defaultProfilePhoto from '../../data/default_profile_photo.jpeg';


function FollowList(props) {

    //given a list of userIds from props, a get request will be made to the server
    //to retrieve profilenames and images
    const [list, setList] = useState([])

    const changeList = (newList) => {
        setList(newList)
    }

    useEffect(() => {

        getUsersWithIds(props.list, changeList);
  
    }, [props.list])


    
    const generateList = (list) => {
        if(!list) return;

        return list.map((user, idx) => {
            return (
                <li key={idx}>
                    <Link className="follow-list-link" to={{
                        pathname:`/Profile/${user.profileName}`,
                        state: {
                            userId: user._id
                        }
                    }}>
                        <img className="small-profile-picture"src={user.profilePhoto ? user.profilePhoto.imageUrl : defaultProfilePhoto} alt='Small Profile'/>
                    </Link> 
                    <Link className="follow-list-link" to={{
                        pathname:`/Profile/${user.profileName}`,
                        state: {
                            userId: user._id
                        }
                    }}>{user.profileName}</Link> 
                </li>
            );   
        });
    
    };

    return (
        <div id="list-container">
            <div className="extra-large-dark-box">
                <h3 className="box-title">{props.header}</h3>
                <ul className="follow-list">
                    {generateList(list)}
                </ul>
            </div>
        </div>
    );
}

FollowList.propTypes = {
    header: PropTypes.string,
    list: PropTypes.array,
    user: PropTypes.object
}

export default FollowList;