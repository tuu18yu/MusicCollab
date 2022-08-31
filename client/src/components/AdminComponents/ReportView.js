import React from 'react';
import {Link } from "react-router-dom";
import './styles.css';

function ReportView() {

    // const location = useLocation();
    // const { reportId } = location.state;


    // //will check if the currentUserid provided through link matches the curentUser Id
    // //If it does not, a get request will be made to get the currentUser's information

    // const toggleView = () => {
    //     setExternalView(!externalView);
    // };

    // const [post, setPost] = useState({
    //     id: null,
    //     reported
    // })

    // // function setPostChanged(child) {
    // //     const name = child[0]
    // //     setPost(inputs => ({...inputs, [name]: child[1]}))
    // // }

    // const [user, setUser] = useState({
    //     username: null,
    //     isAdmin: null,
    //     id: null,
    //     password: null,
    //     profileName: null,
    //     email: null,
    //     interests: null,
    //     uploadedWorks: null,
    //     downloadedWorks: null,
    //     likedWorks: [], 
    //     followers: null,
    //     followings: null,
    //     lastLogIn: null,
    //     activityLog: null,
    //     profilePhoto: null
    // })

    // function setComment(child) {
    //     const name = 'comments'
    //     setPost(inputs => ({...inputs, [name]: child}))
    // }

    // function checkLiked() {
    //     const result = user.likedWorks.filter(work => (work === postId))
    //     if (result.length !== 0) {
    //         setIsLiked(true)
    //     }
    //     else {
    //         setIsLiked(false)
    //     }
    // }

    // useEffect(() => {
    
    //     getPost(postId, setPostInfo)
    
    // }, [])

    // useEffect(() => {
    //     if (props.currentUser) {
    //         getUser(props.currentUser, setUserInfo)
    //     }
    //     getPost(postId, setPostInfo)
    
    // }, [props.currentUser])

    // const setUserInfo = (data) => {
    //     setUser(data)
    // }
    // const setPostInfo = (data) => {
    //     setPost(data)
    // }
    // useEffect(() => {
    //     if (user.id) {
    //         checkLiked()
    //     }
    //     console.log('chnaged')
    // }, [user])

    // useEffect(() => {
    //     if (post.id) {
    //         if (user.id === post.artist.id) {
    //             setExternalView(false)
    //         } else {
    //             setExternalView(true)
    //         }
    //     }
    //     console.log('chnaged')
    // }, [post])

    return(
        <div className="report-box">
            <h3 className="box-title">Report Detail</h3>
            <div className="report-container">
                <div>
                    <div className="report-small">
                        <h3 className="report-label">Report ID:</h3>
                        <h3 className="report-info">{this.props.currentReport.reportID}</h3>
                    </div>
                    <Link to="/ProfileView"><div className="report-small-reported">
                        <h3 className="report-label">Reported:</h3>
                        <h3 className="report-info">{this.props.currentReport.reported}</h3>
                    </div></Link>
                </div>
                <div>
                    <div className="report-small">
                        <h3 className="report-label">Type:</h3>
                        <h3 className="report-info">{this.props.currentReport.type}</h3>
                    </div>
                    <div className="report-small">
                        <h3 className="report-label">Date:</h3>
                        <h3 className="report-info">{this.props.currentReport.date}</h3>
                    </div>
                </div>
            </div>
            <h3 className="box-title">Reason</h3>
            <div className="report-container">
                <p className="report-reason">{this.props.currentReport.reason}</p>
            </div>
        </div>
    )
}

export default ReportView