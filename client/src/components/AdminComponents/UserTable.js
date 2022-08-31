import React from 'react';
import './styles.css';
import UserFooter from './UserFooter';
import SearchBar from './SearchBar';
import { Link } from "react-router-dom";
import { addActivty, deleteUser } from '../../actions/user';

class UserTable extends React.Component {
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

    callBack = (childData) => {
        const userList = this.props.users 
        userList.push(childData)
        this.props.setUsers(["users", userList])
        this.logActivity(this.getDateTime(), "added new admin '" + childData.username + "'")
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
	 			<th id='inputText'> Username </th>
                <th id='inputText'> Type </th>
	 			<th id='inputText'> Name </th>
	 			<th id='inputText'> Last Log In </th>
                <th id='inputText'> Edit </th>
                <th id='inputText'> View </th>
                <th id='inputText'> Delete </th>
            </tr>
        )
    }

    removeUser = (thisuser) => {
        const filteredUsers = this.props.users.filter((u) => { return u !== thisuser })
        this.props.setUsers(["users", filteredUsers])
        deleteUser(thisuser._id)
        this.logActivity(this.getDateTime(), "deleted user '" + thisuser.username + "'")
    }

   
    logActivity = (time, action) => {
        addActivty({ time: time, action: action }, this.props.currentUser)
    }

    handleChange = (user) => {
        const selectedList = this.state.selected
        const find = selectedList.indexOf(user)
      
        if (find > -1) {
          selectedList.splice(find, 1)
        } else {
          selectedList.push(user)
        }
      
        this.setState({
            selected: selectedList
        })
    }

    deleteSelected = () => {
        const selected = this.state.selected
        let userList = this.props.users
        for (let thisuser of selected ) {
            let filteredList = userList.filter((u) => { return u !== thisuser })
            userList = filteredList
            this.logActivity(this.getDateTime(), "deleted user '" + thisuser.username + "'")
        }
        this.setState({
            selected: []
        })

        for (let thisuser of selected ) {
            deleteUser(thisuser._id)
        }
        
        this.props.setUsers(["users", userList])
    }

    filterUsers = (users, query) => {
        if (query === "") {
            return this.tableData(this.props.users)
        }

        const lowerQuery = query.toLowerCase()

        const filteredList =  users.filter((user) => {
            const username = user.username.toLowerCase();
            return username.includes(lowerQuery);
        })

        return this.tableData(filteredList)
    };


    tableData = (searchResult) => {
        return searchResult.map((user) => {
            if (user._id === this.props.currentUser) {
                return (
                    <tr key= {user.username}>
                        <td><input type="checkbox" onChange={ () => this.handleChange(user) }/></td>
                        <td id='inputText'>{user.username}</td>
                        <td id='inputText'>{user.isAdmin ? 'admin' : 'user'}</td>
                        <td id='inputText'>{user.profileName}</td>
                        <td id='inputText'>{user.lastLogIn}</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>
                )
            }

            else {
                return (
                    <tr key= {user.username}>
                        <td><input type="checkbox" onChange={ () => this.handleChange(user) }/></td>
                        <td id='inputText'>{user.username}</td>
                        <td id='inputText'>{user.isAdmin ? 'admin' : 'user'}</td>
                        <td id='inputText'>{user.profileName}</td>
                        <td id='inputText'>{user.lastLogIn}</td>
                        <td><Link to={{
                                pathname: `/EditUser`,
                                state: { userId: user._id }
                                }}><button type="edit">Edit</button></Link> </td>
                        <td>{(user.isAdmin ? <Link to={{
                                pathname: `/AdminProfile/${user.profileName}`,
                                state: { userId: user._id }
                                }}> {<button type="view">View</button>}</Link> :
                                <Link to={{
                                    pathname: `/Profile/${user.profileName}`,
                                    state: { userId: user._id }
                                    }}> {<button type="view">View</button>}</Link> )}</td>
                        <td><button type="select" onClick={ () => this.removeUser(user) }>Delete</button></td>
                    </tr>
                )
            }

        })
    }
 
   render() { 
      return (
        <div className="table-container">
            <h3 className="box-title">User Management</h3>
                <SearchBar parentCallBack={ this.queryCallBack }/>
                <table className='table'>
                <tbody>
                        { this.tableHeader() }
                        { this.filterUsers(this.props.users, this.state.query) }
                </tbody>
                </table>
                <UserFooter parentCallBack={ this.callBack } deleteSelected = { this.deleteSelected}/>
        </div>
      )
   }
}

export default UserTable