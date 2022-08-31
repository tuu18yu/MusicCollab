// environment configutations
import ENV from '../config.js'
const API_HOST = ENV.api_host

export const addReport = (workForm) => {
    // the URL for the request
    const url = `${API_HOST}/api/reports`;
    console.log("in add post")

    // The data we are going to send in our request
    const report = workForm;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(report),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                console.log("Report was successfully added")
                return 1;
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to add report")
            }
        })
        .catch(error => {
            console.log( error);
        });
};


export const deleteReport = (id) => {
    // the URL for the request
    const url = `${API_HOST}api/reports/${id}`;

    // The data we are going to send in our request

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "delete",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                console.log("successfully removed report")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to remove report")
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const getReportInfo = (setPostData) => {
    // the URL for the request
    const url = `${API_HOST}/api/reports`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "get",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(res => {
            if (res.status === 200) {
                console.log('200')
                return res.json();
            }
        })
        .then(json => {
            setPostData({reports: json.reports});
        })
        .catch(error => {
            console.log(error);
        });
};

export const getUnarchivedReportInfo = (setPostData) => {
    // the URL for the request
    const url = `${API_HOST}/api/unarchived/reports`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "get",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(res => {
            if (res.status === 200) {
                console.log('200')
                return res.json();
            }
        })
        .then(json => {
            setPostData({reports: json.reports});
        })
        .catch(error => {
            console.log(error);
        });
};

export const getArchivedReportInfo = (setPostData) => {
    // the URL for the request
    const url = `${API_HOST}/api/archived/reports`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "get",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(res => {
            if (res.status === 200) {
                console.log('200')
                return res.json();
            }
        })
        .then(json => {
            setPostData({reports: json.reports});
        })
        .catch(error => {
            console.log(error);
        });
};


export const changeArchive = (reportID, bool) => {
    // the URL for the request
    const url = `${API_HOST}/api/reports/changeArchive/${ reportID }`;
    const postJSON = {isArchived: bool}
    // The data we are going to send in our request

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(postJSON),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                console.log("successfully added liked user")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to add liked user")
            }
        })
        .catch(error => {
            console.log(error);
        });
};