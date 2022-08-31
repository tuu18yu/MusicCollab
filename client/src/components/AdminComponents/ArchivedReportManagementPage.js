import React from 'react'
import ArchivedReportTable from './ArchivedReportTable'
import 'react-router-dom'
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getArchivedReportInfo } from '../../actions/report';

function ArchivedReportManagementPage(props) {

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
      getArchivedReportInfo(setReportData)
    }
  }, [])

  return (
    <div className='management-container'>
      <ArchivedReportTable setLog={props.setLog} currentUser={props.currentUser} reports={reportData.reports} setReports = {setReportChanged}/>
    </div>
  )
}

ArchivedReportManagementPage.propTypes = {
  currentUser: PropTypes.object,
  setLog: PropTypes.func
  
};

export default ArchivedReportManagementPage;