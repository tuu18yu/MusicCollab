import React from 'react'
import PostTable from './PostTable'
import 'react-router-dom'
import PropTypes from 'prop-types';
import { getPostInfo } from '../../actions/post';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";


function PostManagementPage(props) {

  //a get request will be made to the server to get the post details
  const [postData, setPostData] = useState({
    posts: []
  })

  function setPostChanged(child) {
    const name = child[0]
    setPostData(inputs => ({...inputs, [name]: child[1]}))
  }

  useEffect(() => {
    if (props.currentUser) {
      getPostInfo(setPostData)
    }
  }, [])

  return (
    <div className='management-container'>
      <PostTable setLog={props.setLog} currentUser={props.currentUser} posts={postData.posts} setPosts = {setPostChanged}/>
    </div>
  )

}

PostManagementPage.propTypes = {
  currentUser: PropTypes.object,
  setLog: PropTypes.func
};

export default PostManagementPage;