import './App.css';
import Profile from './pages/Profile';
import ProfileView from './pages/Profile/ProfileView';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { useState } from 'react';
import profile_photo from './data/profile/profile_photo.jpeg'
import profile_photo2 from './data/profile/profile_photo2.jpeg'
import album_cover from './data/album_cover.jpeg';
import album_cover2 from './data/album_cover2.jpeg';
import album_cover3 from './data/album_cover3.jpeg';
import ProfileSettingsView from './pages/ProfileSettings/ProfileSettingsView';
import UploadWork from './pages/UploadWork';
import FollowsView from './pages/Followers/FollowersView';
import UserManagementPage from './components/AdminComponents/UserManagementPage';
import PostManagementPage from './components/AdminComponents/PostManagementPage';
import ReportManagementPage from './components/AdminComponents/ReportManagementPage';
import ArchivedReportManagementPage from './components/AdminComponents/ArchivedReportManagementPage';
import AdminNavigationBar from './components/AdminComponents/NavigationBar/AdminNavigationBar';
import AdminProfile from './pages/Profile/AdminProfile';
import AdminProfileSettings from './pages/ProfileSettings/AdminProfileSettings';
import ReportView from './components/AdminComponents/ReportView';
function App() {

  const [currentUser, setCurrentUser] = useState({
    id: 1,
    imgSrc: profile_photo,
    profileName:'Beat Maker',
    username: 'user',
    password: 'user',
    email: 'user@user.com',
    interests: ['R&B','Pop'],
    followersNum: 4,
    followingsNum: 4,
    bio: "you can always adjust your introductory paragraph later. Sometimes you just have to start writing. You can start at the beginning or dive right into the heart of your essay.",
    //The 2 arrays bellow will contain only ids and calls to the server will be made to get the other attributes
    works: [{
        id: 1,
        imgSrc: album_cover,
        title: 'Pain',
        artist: 'Beat Maker'}],
    downloadedWorks: [{
        id: 8,
        imgSrc: album_cover2,
        title: 'Iconology',
        artist: 'MissyE'},
        {
          id: 3,
          imgSrc: album_cover3,
          title: 'Fine Line',
          artist: 'Harry Styles'}],
    followers: [{
      id: 2,
      imgSrc: profile_photo2,
      profileName: 'Singer 101'}],
    followings: [{
      id: 2,
      imgSrc: profile_photo2,
      profileName: 'Singer 101'}]
  });

  const [userData, setUserData] = useState({
    users: [
    { username: 'abc123',  userType: 'regular', email: 'jdoe123@mail.com', password: '123', name: 'John Doe', lastLogIn: "2021-11-02 10:34:23" },
    { username: 'hihii9 9', userType: 'regular', email: 'jsmith123@mail.com', password: '123', name: 'Jane Smith', lastLogIn: "2021-10-31 16:28:02" },
    { username: 'kimyu18', userType: 'regular', email: 'kimyu18@mail.com', password: '123', name: 'Yu Jin Kim', lastLogIn: "2021-11-03 02:11:29" },
    { username: 'admin', userType: 'admin', email: 'admin@mail.com', password: 'admin', name: 'Harry Potter', lastLogIn: "2021-11-03 02:11:29", activityLog: [] }
    ]
  })

  const [postData, setPostData] = useState({
    posts: [
      { postID: 1,  name: 'Jingle Bell', genre: 'Christmas Carol', user: 'kimyu18', date: "2021-10-22 18:14:12" },
      { postID: 2,  name: 'Jingle Bell Cover', genre: 'Christmas Carol', user: 'abc123', date: "2021-11-02 10:34:23" }
    ]
  })

  const [reportData, setReportData] = useState({
    reports: [
      { reportID: 1,  reported: '1', type: 'post', user: 'kimyu18', date: "2021-10-22 18:14:12", reason: 'Plagiarism' },
      { reportID: 2,  reported: 'abc123', type: 'user', user: 'kimyu18', date: "2021-10-22 18:14:12", reason: 'Spam and scams' },
      { reportID: 3,  reported: 'abc123', type: 'user', user: 'user', date: "2021-10-22 18:14:12", reason: 'Spam and scams' }
    ]
  })

  const [currentReport, setCurrentReport] = useState({ reportID: 3,  reported: 'abc123', type: 'user', user: 'user', date: "2021-10-22 18:14:12", reason: 'Spam and scams' })

  const [archivedData, setArchivedData] = useState({
    archivedReports: []
  })

  const [adminUser, setAdminUser] = useState({ username: 'admin', userType: 'admin', email: 'admin@mail.com', password: 'admin', profileName: 'The Admin', lastLogIn: "2021-11-03 02:11:29", 
  activityLog: [" deleted user 'user123'", " deleted post 'Alphabet Song'"]  })

  function setUserChanged(child) {
    setUserData({ users: child });
  }

  function setPostChanged(child) {
    setPostData({ posts: child });
  }

  function setReportChanged(child) {
    setReportData({ reports: child });
  }

  function setArchivedChanged(child) {
    setArchivedData({ archivedReports: child });
  }


  return (
    //this should be home page
    <div>
        <BrowserRouter>
         <AdminNavigationBar/>
          <Switch>
            <Route exact path="/UserManagement" component= {() => (<UserManagementPage users={userData.users} setUsers = {setUserChanged}/>)} />
            <Route exact path="/PostManagement" component={() => (<PostManagementPage posts={postData.posts} setPosts = {setPostChanged}/>)} />
            <Route exact path="/ReportManagement" component={() => (<ReportManagementPage reports={reportData.reports} archived={archivedData.archivedReports} setReports = {setReportChanged} setArchived = {setArchivedChanged}/>)} />
            <Route exact path="/ArchivedReportManagement" component={() => (<ArchivedReportManagementPage reports={reportData.reports} archived={archivedData.archivedReports} setReports = {setReportChanged} setArchived = {setArchivedChanged}/>)} />
            <Route exact path='/Profile' render={() => (<Profile currentUser={currentUser}/>)}/>
            <Route exact path='/AdminProfile' render={() => (<AdminProfile currentUser={adminUser}/>)}/>
            <Route exact path='/AdminProfileSettings' render={() => (<AdminProfileSettings currentUser={adminUser}/>)}/>
            <Route exact path='/ProfileView' render={() => (<ProfileView currentUser={currentUser}/>)}/>
            <Route exact path='/ProfileSettingsView' render={() => (<ProfileSettingsView currentUser={currentUser}/>)}/>
            <Route exact path='/UploadWork' render={() => (<UploadWork currentUser={currentUser}/>)}/>
            <Route exact path='/FollowersView' render={() => (<FollowsView currentUser={currentUser}/>)}/>
            <Route exact path='/FollowingsView' render={() => (<FollowsView currentUser={currentUser}/>)}/>
            <Route exact path='/ReportView' render={() => (<ReportView currentReport={currentReport}/>)}/>
          </Switch>
        </BrowserRouter>
      </div>
  );
}

export default App;
