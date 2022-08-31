import React from 'react'
import ReportTable from './ReportTable'
import 'react-router-dom'
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getUnarchivedReportInfo } from '../../actions/report';

function ReportManagementPage(props) {

  //a get request will be made to the server to get the report details
  const [reportData, setReportData] = useState({
    reports: []
  })

  function setReportChanged(child) {
    const name = child[0]
    setReportData(inputs => ({...inputs, [name]: child[1]}))
  }

  useEffect(() => {
    if (props.currentUser) {
      getUnarchivedReportInfo(setReportData)
    }
  }, [])

  return (
    <div className='management-container'>
      <ReportTable setLog={props.setLog} currentUser={props.currentUser} reports={reportData.reports} setReports = {setReportChanged}/>
    </div>
  )
}

ReportManagementPage.propTypes = {
  currentUser: PropTypes.object,
  setLog: PropTypes.func
  
};

export default ReportManagementPage;