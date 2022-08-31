import React, { useState, useEffect } from 'react';
import CoverHeader from '../../components/CoverHeader';
import CoverContent from '../../components/CoverContent';
import "./styles.css";
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { getPost, getIsLiked } from '../../actions/post';
import { getUser } from '../../actions/user';


function CoverPage (props) {

    const [externalView, setExternalView] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const location = useLocation();
    const { postId } = location.state;


    //will check if the currentUserid provided through link matches the curentUser Id
    //If it does not, a get request will be made to get the currentUser's information

    const toggleView = () => {
        setExternalView(!externalView);
    };

    const [post, setPost] = useState({
        id: null,
        coverPhoto: {imageUrl: null},
        audio: {audioUrl: null},
        title: null,
        artist: {id: null, profileName: null},
        description: null,
        recievedLikes: [],
        likesCount: null,
        categories: [],            
        tags: [],
        references: [],
        comments: [],
        dateCreated: null
    })

    // function setPostChanged(child) {
    //     const name = child[0]
    //     setPost(inputs => ({...inputs, [name]: child[1]}))
    // }

    const [user, setUser] = useState({
        username: null,
        isAdmin: null,
        id: null,
        password: null,
        profileName: null,
        email: null,
        interests: null,
        uploadedWorks: null,
        downloadedWorks: null,
        likedWorks: [], 
        followers: null,
        followings: null,
        lastLogIn: null,
        activityLog: null,
        profilePhoto: null,
        accessTo: null
    })

    function setComment(child) {
        const name = 'comments'
        setPost(inputs => ({...inputs, [name]: child}))
    }

    function checkLiked() {
        const result = user.likedWorks.filter(work => (work === postId))
        if (result.length !== 0) {
            setIsLiked(true)
        }
        else {
            setIsLiked(false)
        }
    }

    useEffect(() => {
        if (postId) {
            getPost(postId, setPostInfo)
        } 
    }, [])

    useEffect(() => {
        if (props.currentUser) {
            getUser(props.currentUser, setUserInfo)
        }
    }, [props.currentUser])

    const setUserInfo = (data) => {
        setUser(data)
    }
    const setPostInfo = (data) => {
        setPost(data)
    }
    useEffect(() => {
        if (user.id) {
            checkLiked()
        }
        console.log('chnaged')
    }, [user])

    useEffect(() => {
        if (post.id && user.id) {
            if (user.id === post.artist.id) {
                setExternalView(false)
            } else if (user.isAdmin) {
                setExternalView(false)
            }
            else {
                setExternalView(true)
            }

            for (let pID of user.accessTo) {
                if (pID === postId) {
                    setHasAccess(true)
                }
            }
        }
        console.log('chnaged')
    }, [post, user])


    return (
       <div className="page"> 
            <CoverHeader hasAccess={hasAccess} externalView={externalView} currentPost={post} currentUser={user} setWork={props.setWork} page={'cover'} toggleView={toggleView} isLiked={isLiked} setIsLiked={setIsLiked}/>
            <CoverContent setComment={setComment} externalView={externalView} currentPost={post} currentUser={user}/>
        </div>

    );
    
}

CoverPage.propTypes = {
    currentUser: PropTypes.object,
    setComment: PropTypes.func,
    setUserInfo: PropTypes.func
};

export default CoverPage;