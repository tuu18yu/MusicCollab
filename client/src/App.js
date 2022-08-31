import './App.css';
import Profile from './pages/Profile';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { checkSession } from './actions/user';

import profile_photo from './data/profile/profile_photo.jpeg'
import profile_photo2 from './data/profile/profile_photo2.jpeg'
import album_cover from './data/album_cover.jpeg';
import album_cover2 from './data/album_cover2.jpeg';
import album_cover3 from './data/album_cover3.jpeg';
import album_cover4 from './data/album_cover4.jpeg';
import album_cover5 from './data/album_cover4.png';
import album_cover6 from './data/album_cover5.jpeg';
import music from './data/bensound-downtown.mp3';

import ProfileSettings from './pages/ProfileSettings';
import UploadWork from './pages/UploadWork';
import Follows from './pages/Followers';
import NavigationBar from './components/NavigationBar';
import Features from './pages/Features';

import LogInPage from './pages/LoginBox/LogInPage';
import SignUp from './pages/SignUp/SignUp';

import EditUser from './pages/ProfileSettings/editUser';

import CoverPage from './pages/Coverpage/CoverPage';
import CoverpageSettings from './pages/CoverpageSettings';

import ProfileView from './pages/Profile/ProfileView';
import ProfileSettingsView from './pages/ProfileSettings/ProfileSettingsView';
import FollowsView from './pages/Followers/FollowersView';
import UserManagementPage from './components/AdminComponents/UserManagementPage';
import PostManagementPage from './components/AdminComponents/PostManagementPage';
import ReportManagementPage from './components/AdminComponents/ReportManagementPage';
import ArchivedReportManagementPage from './components/AdminComponents/ArchivedReportManagementPage';
import AdminNavigationBar from './components/AdminComponents/NavigationBar/AdminNavigationBar';
import AdminProfile from './pages/Profile/AdminProfile';
import AdminProfileView from './pages/Profile/AdminProfileView';
import AdminProfileSettings from './pages/ProfileSettings/AdminProfileSettings';
import ReportView from './components/AdminComponents/ReportView';

import ExplorePage from './pages/Explore';
import PersonalizedFeed from './pages/PersonalizedFeed';
import SentRequests from './pages/SentRequests';
import ReceivedRequests from './pages/ReceivedRequests';


function App() {

  const [currentPost, setCurrentpost] = useState({
    id: 1,
    imgSrc: album_cover,
    title: 'Pain',
    audio: music,
    artist: 'Beat Maker',
    description: 'A song that I wrote while I was in pain.',
    recievedLikes: [],
    categories: ['R&B', 'Pop'],
    tags: ['Hurting', 'Heal'],
    references:[{workId: 2, name: "Fine Line - Harry Styles", description: 'Used melody line'}],
    comments: [['Beat Maker', 'I am looking for a vocal for this song', 'user'], ['Jennifer Kim', 'This beat is great!', 'kimyu18'], ['The Best Vocalist', 'Can I collaborate with you?', 'hihii99']],
    public: true})

    function setUserInfo(child) {
      const name = child[0]
      setCurrentUser(inputs => ({...inputs, [name]: child[1]}))
    }

    function setPostInfo(child) {
      const name = child[0]
      setCurrentpost(inputs => ({...inputs, [name]: child[1]}))
    }

    function setPostComment(child) {
      const name = 'comments'
      setCurrentpost(inputs => ({...inputs, [name]: child}))
    }

  const [currentUser, setCurrentUser] = useState({
    id: 1,
    profilePhotoUrl: profile_photo,
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
    likedWorks: [{
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
      profileName: 'Singer 101'}],
    activityLog: []
  });

    const works = [
        {
          id: 1,
          imgSrc: album_cover,
          title: 'Pain',
          artist: 'Beat Maker'
        },
        {
          id: 8,
          imgSrc: album_cover2,
          title: 'Iconology',
          artist: 'MissyE'
        },
        {
          id: 3,
          imgSrc: album_cover3,
          title: 'Fine Line',
          artist: 'Harry Styles'
        },
        {
          id: 2,
          imgSrc: album_cover4,
          title: 'Lost In Japan (Remix)',
          artist: 'Zedd'
        },
        {
          id: 4,
          imgSrc: album_cover5,
          title: 'Unlocked (instrumentals)',
          artist: 'Kenny Beats'
        },
        {
          id: 5,
          imgSrc: album_cover6,
          title: 'My Universe',
          artist: 'Bulletproof Boys'
        }];

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
  activityLog: [" deleted user 'user123'", " deleted post 'Alphabet Song'"], imgSrc: profile_photo })


  function setPostChanged(child) {
    setPostData({ posts: child });
  }

  function setReportChanged(child) {
    setReportData({ reports: child });
  }

  function setArchivedChanged(child) {
    setArchivedData({ archivedReports: child });
  }

  function setLog(child) {
    const logs = adminUser.activityLog
    logs.push(child)
    const name = 'activityLog'
    setAdminUser(inputs => ({...inputs, [name]: logs}))
  }

  const [state, setState] = useState({
    username: null,
    isAdmin: null,
    id: null
  })


  function changeState(child) {
    setState(child)
  }

  useEffect(() => {

      checkSession(changeState); // sees if a user is logged in

  }, [])
  

  return (
    //this should be home page
    <div>
      <BrowserRouter>
        {state.username && !state.isAdmin && <NavigationBar changeState={changeState} currentUser={state}/>}
        {state.username && state.isAdmin && <AdminNavigationBar changeState={changeState} />}
        <Switch> 
          <Route exact path='/SignUp' render={() => (<SignUp/>)}/>

          <Route
              exact path={["/", "/LogIn", '/AdminProfile'] /* any of these URLs are accepted. */ }
              render={ () => (
                !state.username ? <LogInPage changeState={changeState} /> : !state.isAdmin ? <ExplorePage currentUser={state}/> : <AdminProfile currentUser={state.id}/>
              )}
          />

          {/* <Route exact path='/CoverPage' render={() => (<CoverPage setComment={setPostComment} currentPost={currentPost} currentUser={currentUser} setUserInfo={setUserInfo}/>)}/> */}
          <Route exact path='/CoverPage/:title' render={() => (<CoverPage currentUser={state.id} setUserInfo={setUserInfo}/>)}/>
          <Route exact path='/Features/:title' render={() => (<Features/>)}/>
          <Route exact path='/CoverPage' render={() => (<CoverPage setComment={setPostComment} currentPost={currentPost} currentUser={currentUser} setUserInfo={setUserInfo}/>)}/>
          <Route exact path='/CoverPageSettings/:title' render={() => (<CoverpageSettings currentUser={state}/>)}/>
          <Route exact path='/SentRequests' render={() => (<SentRequests currentUser={state}/>)}/>
          <Route exact path='/ReceivedRequests' render={() => (<ReceivedRequests currentUser={state}/>)}/>
          
          <Route exact path='/EditUser' render={() => (<EditUser/>)}/>
          <Route exact path='/Profile' render={() => (<Profile currentUser={state}/>)}/>
          <Route path='/Profile/:profileName' render={() => (<Profile currentUser={state}/>)}/>
          <Route exact path='/ProfileSettings' render={() => (<ProfileSettings currentUser={state}/>)}/>
          <Route exact path='/UploadWork' render={() => (<UploadWork currentUser={state}/>)}/>
          <Route exact path='/Followers' render={() => (<Follows currentUser={state}/>)}/>
          <Route exact path='/Followings' render={() => (<Follows currentUser={state}/>)}/>
          <Route exact path='/Features' render={() => (<Features/>)}/>
          <Route exact path='/Explore' render={() => (<ExplorePage currentUser={state}/>)}/>
          <Route exact path='/Home' render={() => (<PersonalizedFeed works={works}/>)}/>


          <Route exact path='/ReportView' render={() => (<ReportView currentReport={currentReport}/>)}/>
          <Route exact path="/UserManagement" component= {() => (<UserManagementPage currentUser={state.id} setLog={setLog} />)} />
          <Route exact path="/PostManagement" component={() => (<PostManagementPage currentUser={state.id} setLog={setLog} posts={postData.posts} setPosts = {setPostChanged}/>)} />
          <Route exact path="/ReportManagement" component={() => (<ReportManagementPage setLog={setLog} currentUser={state.id} reports={reportData.reports} archived={archivedData.archivedReports} setReports = {setReportChanged} setArchived = {setArchivedChanged}/>)} />
          <Route exact path="/ArchivedReportManagement" component={() => (<ArchivedReportManagementPage setLog={setLog} currentUser={state.id} reports={reportData.reports} archived={archivedData.archivedReports} setReports = {setReportChanged} setArchived = {setArchivedChanged}/>)} />
          <Route exact path='/AdminProfile' render={() => (<AdminProfile currentUser={state.id}/>)}/>
          <Route exact path='/AdminProfile/:profileName' render={() => (<AdminProfileView/>)}/>
          <Route exact path='/AdminProfileSettings' render={() => (<AdminProfileSettings currentUser={state}/>)}/>
          <Route exact path='/ProfileView' render={() => (<ProfileView currentUser={currentUser}/>)}/>
          <Route exact path='/ProfileSettingsView' render={() => (<ProfileSettingsView currentUser={currentUser}/>)}/>
          <Route exact path='/FollowersView' render={() => (<FollowsView currentUser={currentUser}/>)}/>
          <Route exact path='/FollowingsView' render={() => (<FollowsView currentUser={currentUser}/>)}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
  
}

export default App;