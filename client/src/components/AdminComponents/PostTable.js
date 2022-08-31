import React from 'react';
import './styles.css';
import SearchBar from './SearchBar';
import {Link} from 'react-router-dom';
import { deletePost } from '../../actions/post';
import { addActivty } from '../../actions/user';

class PostTable extends React.Component {
    state = {
        selected: [],
        query: ""
    }

    getDateTime = () => {
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        return dateTime
    }

    logActivity = (time, action) => {
        addActivty({ time: time, action: action }, this.props.currentUser)
    }

    queryCallBack = (childData) => {
        this.setState({
            query: childData
        })
    }

    tableHeader() {
        return(
            <tr>
                <th id='inputText'> Select </th>
	 			<th id='inputText'> Post ID </th>
                <th id='inputText'> Title </th>
	 			<th id='inputText'> Artist </th>
                <th id='inputText'> Date Posted </th>
                <th id='inputText'> View / Edit </th>
                <th id='inputText'> Delete </th>
            </tr>
        )
    }

    removePost = (post) => {
        const filteredPosts = this.props.posts.filter((p) => { return p !== post })
        this.props.setPosts(["posts", filteredPosts])
        deletePost(post._id)
        this.logActivity(this.getDateTime(), `deleted post '${post.title}' by '${post.artist.profileName}'"`)
    }

    handleChange = (post) => {
        const selectedList = this.state.selected
        const find = selectedList.indexOf(post)
      
        if (find > -1) {
          selectedList.splice(find, 1)
        } else {
          selectedList.push(post)
        }
      
        this.setState({
            selected: selectedList
        })
    }

    deleteSelected = () => {
        const selected = this.state.selected
        let postList = this.props.posts
        for (let post of selected ) {
            let filteredList = postList.filter((p) => { return p !== post })
            postList = filteredList
            this.logActivity(this.getDateTime(), `deleted post '${post.title}' by '${post.artist.profileName}'"`)
        }

        for (let p of selected ) {
            deletePost(p._id)
        }

        this.setState({
            selected: []
        })
        this.props.setPosts(["posts", postList])
    }

    filterPosts = (posts, query) => {
        if (query === "") {
            return this.tableData(this.props.posts)
        }
        const lowerQuery = query.toLowerCase()

        const filteredList =  posts.filter((post) => {
            const name = post.title.toLowerCase()
            return name.includes(lowerQuery)
        })

        return this.tableData(filteredList)
    };


    tableData = (searchResult) => {
        return searchResult.map((post) => {
            return (
                <tr key= {post._id}>
                    <td><input type="checkbox" onChange={ () => this.handleChange(post) }/></td>
                    <td id='inputText'>{post._id}</td>
                    <td id='inputText'>{post.title}</td>
                    <td id='inputText'>{post.artist.profileName}</td>
                    <td id='inputText'>{post.dateCreated}</td>
                    <td><Link to={{
                                pathname: `/CoverPage/${post.title}`,
                                state: { postId: post._id }
                                }}>
                        <button type="view"> View / Edit </button></Link></td>
                    <td><button type="select" onClick={ () => this.removePost(post) }>Delete</button></td>
                </tr>
            )
        })
    }

   render() { 
      return (
        <div className="table-container">
            <h3 className="box-title">Post Management</h3>
                <SearchBar parentCallBack={ this.queryCallBack }/>
                <table className='table'>
                <tbody>
                        { this.tableHeader() }
                        { this.filterPosts(this.props.posts, this.state.query) }
                </tbody>
                </table>
                <div className='footer'>
                    <button id='right-button' type="deleteAll" onClick={ this.deleteSelected }>Delete Selected</button>
                </div>
        </div>
      )
   }
}

export default PostTable