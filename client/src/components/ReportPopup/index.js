import React, { useState } from 'react';
import "./styles.css";
import PropTypes from 'prop-types';
import { addReport } from '../../actions/report';

function ReportPopup (props) {

    const [submitted, setSubmitted] = useState(false);

    const [state, setState] = useState({value: ''})

    if(!props.trigger) return null;

    const handleSubmit = () => {
        //on submit a post request will be made to the server with the report details
        let userInfo = {id: props.currentUser._id, profileName: props.currentUser.profileName }
        if (props.reportType === "post") {
            userInfo = {id: props.currentUser.id, profileName: props.currentUser.profileName }
        } 

        const form = {
            type: props.reportType,
            user: userInfo,
            date: getDateTime(),
            reason: state.value,
            reported: props.reported
        }

        addReport(form)
        setSubmitted(true);
    };

    const getDateTime = () => {
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        return dateTime
    }

    const handleClose = () => {
        setSubmitted(false);
        props.handleTrigger();
    };


    const handleChange = (event) => {
        setState({value: event.target.value})
    }  

    return(
        <div className="popup-overlay">
            <button className="popup-close-btn" onClick={handleClose}>X</button>
            <div className="popup-content">
                <h3 className="box-title">Reason for Report</h3>
                <textarea id="report-text-box" className="bio-text-box"name="report-reason" placeholder={"Cannot leave this area blank!"} onChange={handleChange.bind(this)} value={state.value} />
                {!submitted && <button className="box-btn margin-10" onClick={handleSubmit}>Submit</button>}
                {submitted && <label className="box-label margin-10">Report Submitted</label>}
            </div>
        </div>
    );
}

ReportPopup.propTypes = {
    trigger: PropTypes.bool,
    currentUser: PropTypes.object,
    reported: PropTypes.object,
    handleTrigger: PropTypes.func,
    reportType: PropTypes.string
};

export  default ReportPopup;

