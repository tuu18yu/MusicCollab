import React, { useState } from 'react';
import ExploreView from '../../components/ExploreView';
import PropTypes from 'prop-types';
import "./styles.css";
import { Link } from 'react-router-dom';


function PersonalizedFeed (props) {
 
   //A get request will be made to the server to get any notifications for the current user
   //A get request will be made to the server to get works that may interest them
   //A get request will be made to the server to get the works they liked

   const defaultNotifications = [
        {
            title: "Features",
            color: "#752d76",
            notifications: [
                {
                    content: "Your work Pain is featured in Iconology!",
                    linkPath: "/Features"
                }
            ]
        },
        {
            title: "Comments",
            color: "#962fcb",
            notifications: [
                {
                    content: "User102 commented on your Pain post",
                    linkPath: "/Coverpage"
                },
                {
                    content: "User103 commented on your Pain post",
                    linkPath: "/Coverpage"
                },
                {
                    content: "User104 commented on your Pain post",
                    linkPath: "/Coverpage"
                },
                {
                    content: "User105 commented on your Pain post",
                    linkPath: "/Coverpage"
                },
                {
                    content: "User106 commented on your Pain post",
                    linkPath: "/Coverpage"
                }
            ]
        },
        {
            title: "Likes",
            color: "rgb(177 72 153)",
            notifications: [
                {
                    content: "User983 liked your pain post",
                    linkPath: "/Coverpage"
                },
                {
                    content: "User693 liked your pain post",
                    linkPath: "/Coverpage"
                }
            ]
        },
        {
            title: "Followings",
            color: "#854ab9",
            notifications: [
                {
                    content: "User102 started following you",
                    linkPath: "/Profile"
                },
                {
                    content: "User103 started following you",
                    linkPath: "/Profile"
                },
                {
                    content: "User105 started following you",
                    linkPath: "/Profile"
                }
            ]
        } 
    ];

    const [notifications, setNotifications] = useState(defaultNotifications);

    const handleClear = (idx) => {
        //a delete request will be made to the database to remove all notifications of the specified type
        let newNotifications = [...notifications];
        newNotifications[idx].notifications = [];
        setNotifications(newNotifications);
    }

    const generateNotifications = (title, color, notifications, idx) => {
        return (
            
                <div key={idx} className="notifications">
                    <h3 className="notifications-header" style={{backgroundColor: color}}>
                        {title}
                        <button className="box-btn notifications-btn"
                            onClick={() =>{handleClear(idx)}}>
                                Clear
                        </button>
                    </h3>
                    <ul className="notifications-list">
                        {
                            notifications.map((notification, id) => {
                                return(
                                    <li key={id}>
                                        <p key={id}>{notification.content}</p> 
                                        <Link key={id+notification.content} to={notification.linkPath}className="arrow-link">{">"}</Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>

        );
    };


    return (
        <div className="personalized-feed">
            <div className="large-dark-box notifications-box">
                <h3 className="box-title">Notifications</h3>
                {   
                    <div className="notifications-wrapper">
                        {notifications.map((notificationItems, idx) => {
                            return (
                                generateNotifications(notificationItems.title, notificationItems.color, notificationItems.notifications, idx)
                            );
                        })}
                    </div>
                }       
            </div>
            <br/>
            
            </div>
        
    );
}

PersonalizedFeed.propTypes = {
    works: PropTypes.array
}

export default PersonalizedFeed;
