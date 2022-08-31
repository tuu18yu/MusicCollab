import React from 'react';
import './styles.css';
import SearchBar from './SearchBar';
import {Link } from "react-router-dom";
import { addActivty } from '../../actions/user';
import { changeArchive, deleteReport } from '../../actions/report';

class ArchivedReportTable extends React.Component {
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
	 			<th id='inputText'> Date </th>
                <th id='inputText'> What Reported </th>
	 			<th id='inputText'> Type </th>
	 			<th id='inputText'> Reported By </th>
                <th id='inputText'> Reason </th>
                <th id='inputText'> Unarchive </th>
                <th id='inputText'> Delete </th>
            </tr>
        )
    }

    archiveReport = (report) => {
        const filteredReports = this.props.reports.filter((r) => { return r !== report })
        this.props.setReports(["reports", filteredReports])
        changeArchive(report._id, false)
        this.logActivity(this.getDateTime(), `unarchived report with ID: ${report._id}`)
    }

    removeReport = (report) => {
        const filteredReports = this.props.reports.filter((r) => { return r !== report })
        this.props.setReports(["reports", filteredReports])
        deleteReport(report._id)
        this.logActivity(this.getDateTime(), `removed report with ID: ${report._id}`)
    }

    handleChange = (report) => {
        const selectedList = this.state.selected
        const find = selectedList.indexOf(report)
      
        if (find > -1) {
          selectedList.splice(find, 1)
        } else {
          selectedList.push(report)
        }
      
        this.setState({
            selected: selectedList
        })
    }

    deleteSelected = () => {
        const selected = this.state.selected
        let reportList = this.props.reports
        for (let report of selected ) {
            let filteredList = reportList.filter((r) => { return r !== report })
            reportList = filteredList
            this.logActivity(this.getDateTime(), `removed report with ID: ${report._id}`)
        }

        for (let report of selected ) {
            changeArchive(report._id, true)
        }

        this.setState({
            selected: []
        })
        this.props.setReports(["reports", reportList])
    }

    archiveSelected = () => {
        const selected = this.state.selected
        let reportList = this.props.reports
        for (let report of selected ) {
            let filteredList = reportList.filter((r) => { return r !== report })
            reportList = filteredList
            this.logActivity(this.getDateTime(), `unarchived report with ID: ${report._id}`)
        }

        for (let report of selected ) {
            changeArchive(report._id, false)
        }

        this.setState({
            selected: []
        })
        this.props.setReports(["reports", reportList])
    }

    filterPosts = (reports, query) => {
        if (query === "") {
            return this.tableData(this.props.reports)
        }
        const lowerQuery = query.toLowerCase()

        const filteredList =  reports.filter((report) => {
            const reported = report.reported.toLowerCase()
            return reported.includes(lowerQuery)
        })

        return this.tableData(filteredList)
    };


    tableData = (searchResult) => {
        return searchResult.map((r) => {
            return (
                <tr key={r._id}>
                    <td><input type="checkbox" onChange={ () => this.handleChange(r) }/></td>
                    <td id='inputText'>{r.date}</td>
                    <td id='inputText'>{(r.type==='post')?<Link to={{
                                pathname: `/CoverPage/${r.reported.title}`,
                                state: { postId: r.reported.id }
                                }}> {r.reported.title} </Link> : 
                                <Link to={{
                                    pathname: `/Profile/${r.reported.profileName}`,
                                    state: { userId: r.reported._id }
                                    }}>{r.reported.username}</Link> }</td>
                    <td id='inputText'>{r.type}</td>
                    <td id='inputText'>{r.user.profileName}</td>
                    <td id='inputText'>{r.reason}</td>
                    <td><button type="archive" onClick={ () => this.archiveReport(r) }>Unarchive</button></td>
                    <td><button type="select" onClick={ () => this.removeReport(r) }>Delete</button></td>
                </tr>
            )
        })
    }

   render() { 
      return (
        <div className="table-container">
            <h3 className="box-title">Archived Report Management</h3>
                <SearchBar parentCallBack={ this.queryCallBack }/>
                <table className='table'>
                <tbody>
                        { this.tableHeader() }
                        { this.filterPosts(this.props.reports, this.state.query) }
                </tbody>
                </table>
                <div className='footer'>
                    <Link to="/ReportManagement"><button id='left-button' type="link" >Go Back To Reports</button></Link>
                    <button id='right-button' type="deleteAll" onClick={ () => this.deleteSelected() }>Delete Selected</button>
                    <button id='right-button-b' type="deleteAll" onClick={ () => this.archiveSelected() }>Unarchive Selected</button>
                </div>
        </div>
      )
   }
}

export default ArchivedReportTable