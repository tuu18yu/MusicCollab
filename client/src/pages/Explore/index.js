import React, { useState, useEffect } from 'react';
import ExploreView from '../../components/ExploreView';
import PropTypes from 'prop-types';
import "./styles.css";
import CategoryWork from '../../components/CategoryWorks';
import SelectReference from '../../components/SelectReference';
import { getExplorePosts, getPostsWithIds, getAllPosts } from '../../actions/post';
import { getUserByID } from '../../actions/user';

function ExplorePage (props) {

    //a get request will be made to the server to retrieve trending and newly uploaded works
    //this data will be stored in a state variable and passed to the corresponding
    //ExploreView components below

    // const categoryWorks = [
    //     {
    //         name:'R&B',
    //         works: [props.works[1], props.works[2]] 
    //     },
    //     {
    //         name:'Pop',
    //         works: [props.works[3], props.works[0], props.works[2], props.works[5]] 
    //     },
    //     {
    //         name:'Jazz',
    //         works: []
    //     },
    //     {
    //         name:'Hiphop',
    //         works: [props.works[1], props.works[2]] 
    //     },
    //     {
    //         name:'Instrumentals',
    //         works: [props.works[4]] 
    //     },
    //     {
    //         name:'Acapella',
    //         works: []
    //     }
    // ];

    
    //a get request will be made to the server to get all work names and ids in the database
    
    const [categoryName, setCategoryName] = useState("");
    const [categoryWorks, setCategoryWorks] = useState([]);
    const [displayedWorks, setDisplayedWorks] = useState()
    const [searchedWorks, setSearchedWorks] = useState([]);
    const [searchMode, setSearchMode] = useState(false);
    const [trendingWorks, setTrendingWorks] = useState([]);
    const [recentWorks, setRecentWorks] = useState([]);
    const [loggedUser, setLoggedUser] = useState();
    const [likedWorks, setLikedWorks] = useState([]);
    const [works, setWorks] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

   const setTrending = (data) => {setTrendingWorks(data)}
   const setRecent = (data) => {setRecentWorks(data)}
   const setLiked = (data) => {setLikedWorks(data)}
   const setAllWorks = (data) => {setWorks(data)}

   const updateUser = (id, setState) => {

    getUserByID(id, setState) 

    }

    const updateLoggedUser = () => {

        updateUser(props.currentUser.id, setLoggedUser)

    }

    useEffect(() => {

        getExplorePosts("trending", setTrending)
        getExplorePosts("recent", setRecent)
        getAllPosts(setAllWorks)
        if(props.currentUser && props.currentUser.id) {
            updateLoggedUser(); 
        }
  
    }, [props.currentUser])


    const allWorks = works.map((work) => {
        return {name: work.title + " by " + work.artist.profileName, id: work._id }});


    useEffect(() => {

        if(loggedUser) {
            getPostsWithIds(loggedUser.likedWorks, setLiked)
            if (loggedUser.isAdmin) {
                setIsAdmin(true)
            }
        }
    
    }, [loggedUser])


    const handleClick = (category) => {
        //a get request will be made to the server to retrieve the works under the specified category
        const results = works.filter(work => work.categories.includes(category))
        setCategoryWorks(results);
        setCategoryName(category);
    }

    const handleSearch = () => {
        //a get request will be made to the server to get the work details
        //such as cover image title and artist for the selected ids
        const workIds = searchedWorks.map(work => work.id);
        const results = works.filter(work => workIds.includes(work._id));
        console.log(results)
        setDisplayedWorks(results);
        setSearchMode(true);
    }
    // <ExploreView works={props.works.slice(2,4)} title={"Recently Uploaded"}/>
    //                 <CategoryWork handleClick={handleClick}/>
    //                 <ExploreView works={categoryWorks[categoryIdx].works} title={categoryWorks[categoryIdx].name}/>
    //<ExploreView works={displayedWorks} title={displayedWorks.length ? "Search Results" : "No Search Results"}/>
                

    return (
        <div className="page explore-page">
            <div className="header">
                {searchMode && <button className="box-btn" onClick={() => {setSearchMode(false); setSearchedWorks([])}}>Back</button>}
                <div className="search-box">
                    <SelectReference options={allWorks} selectedOptions={searchedWorks} selectLimit={-1}
                        handleSelect={selectedWork => {setSearchedWorks(selectedWork)}} placeholder="Select works to search for"/>
                
                    <button className="btn" onClick={handleSearch}>
                        Search
                    </button>
                </div>
                
            </div>   
            {!searchMode && 
            (   <div className="bottom-page">
                    <ExploreView works={trendingWorks} title={"Trending"}/>
                    <ExploreView works={recentWorks} title={"Recently Uploaded"}/>
                    {!isAdmin && <ExploreView works={likedWorks} title={"Liked Works"}/>}
                    <CategoryWork handleClick={handleClick}/>
                    <ExploreView works={categoryWorks} title={categoryName}/>
                    
                </div>
            )}

            {searchMode &&
            (
                <div className="search-page">
                    <ExploreView works={displayedWorks} title={displayedWorks.length ? "Search Results" : "No Search Results"}/>
                </div>
            )}
        </div>
        
    );
}

ExplorePage.propTypes = {
    currentUser: PropTypes.object
}

export default ExplorePage;
