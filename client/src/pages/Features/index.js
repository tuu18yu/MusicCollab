import React, { useEffect, useState } from 'react';
import "./styles.css";
import MusicSheet from '../../components/MusicSheet';
import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../../actions/user';
import { getPost, getPostsWithIds, getPostInfo } from '../../actions/post';

function Features (props) {

    //A get request will be made to the database to get all works that
    //feature and are featured in the selected work
    const location = useLocation();
    const { postId, userId } = location.state;

    const [postData, setPostData] = useState({
        posts: []
    })

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
        profilePhoto: null
    })

    const [features, setFeatures] = useState([])
    const [featuredIn, setFeaturedIn] = useState([])

    const setUserInfo = (data) => {
        setUser(data)
    }
    const setPostInfo = (data) => {
        setPost(data)
    }

    const setFeatureInfo = (data) => {
        setFeatures(data)
    }

    const setPostDataInfo = (data) => {
        setPostData(data)
    }

    useEffect(() => {
        getPostInfo(setPostDataInfo)
        getUser(userId, setUserInfo)
        getPost(postId, setPostInfo)
        
        console.log('chnaged')
    }, [])


    useEffect(() => {
        if (post.id) {
            const lists = getReferenceIds()
            getPostsWithIds(lists, setFeatureInfo)
            getFeatures()
        }
    }, [post])

    function getReferenceIds() {
        const input = []
        for (let r of post.references) {
            input.push(r.id)
        }
        return input
    }

    function getFeatures() {
        const list = []
        for (let p of postData.posts) {
            for (let r of p.references) {
                if (r.id === postId) {
                    list.push(p)
                }
            }
        }
        setFeaturedIn(list)
    }
    // const featuredIn = [
    //     {
    //         id: 8,
    //         imgSrc: album_cover2,
    //         description:"I reversed portions of this song for making my I conic song",
    //         title: "Iconology",
    //         artist: "MissyE"
    //     },
    //     {
    //         id: 5,
    //         imgSrc: album_cover6,
    //         description:"We loved this melody and beat combo! had to use it",
    //         title: 'My Universe',
    //         artist: 'Bulletproof Boys'
    //     },
    //     {
    //         id: 8,
    //         imgSrc: album_cover2,
    //         description:"I reversed portions of this song for making my I conic song",
    //         title: "Iconology",
    //         artist: "MissyE"
    //     },
    //     {
    //         id: 5,
    //         imgSrc: album_cover6,
    //         description:"We loved this melody and beat combo! had to use it",
    //         title: 'My Universe',
    //         artist: 'Bulletproof Boys'
    //     },
    //     {
    //         id: 8,
    //         imgSrc: album_cover2,
    //         description:"I reversed portions of this song for making my I conic song",
    //         title: "Iconology",
    //         artist: "MissyE"
    //     },
    //     {
    //         id: 5,
    //         imgSrc: album_cover6,
    //         description:"We loved this melody and beat combo! had to use it",
    //         title: 'My Universe',
    //         artist: 'Bulletproof Boys'
    //     }
    // ]
    

    return (
        <div className="page features-page">
            <h1 className="page-title music-sheet-title">
                <Link to={{
                            pathname: `/CoverPage/${post.title}`,
                            state: { postId: postId }
                }} className="purple-link"> {`${post.title}'s`} </Link>
                 Feature History
            </h1>

            <MusicSheet references={features} top={true}/>
            <MusicSheet references={featuredIn} top={false}/>
        </div>
        
    );

}

export default Features;