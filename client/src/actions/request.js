// environment configutations
import ENV from '../config.js'
const API_HOST = ENV.api_host

// A function to send a POST request with a new user
export const addRequest = (sentRequest) => {
    // the URL for the request
    const url = `${API_HOST}/request`;

    const data = sentRequest;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(data),
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
                console.log("Request was successfully added")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to add request")
            }
        })
        .catch(error => {
            console.log( error);
        });
};

export const acceptRequest = (requestId) => {
    // the URL for the request
    const url = `${API_HOST}/request/acceptRequest/${requestId}`;

    // The data we are going to send in our request


    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "PATCH"
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                console.log("successfully updated")
                
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to update")
                
            }
        })
        .catch(error => {
            console.log("post error: " + error);
            
        });
};


export const deleteRequest = (requestId) => {
    // the URL for the request
    const url = `${API_HOST}/request/deleteRequest/${requestId}`;

    // The data we are going to send in our request


    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "DELETE"
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                console.log("successfully updated")
                
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to update")
                
            }
        })
        .catch(error => {
            console.log("post error: " + error);
            
        });
};


// A function to send a POST request with a new user
export const getReceivedRequests = (acceptorId, setData) => {
    // the URL for the request
    const url = `${API_HOST}/request/receivedRequests/${acceptorId}`;

    // Send the request with fetch()
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                console.log('200')
                return res.json();
            }
        })
        .then(json => {
            if(json) {
                setData([...json]);
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const getSentRequests = (requestorId, setData) => {
    // the URL for the request
    const url = `${API_HOST}/request/sentRequests/${requestorId}`;

    // Send the request with fetch()
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                console.log('200')
                return res.json();
            }
        })
        .then(json => {
            if(json) {
                setData([...json]);
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const addRequestComment = (comment, requestID) => {
    // the URL for the request
    const url = `${API_HOST}/request/comment/${ requestID }`;

    // The data we are going to send in our request

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(comment),
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
                console.log("successfully added comment to request")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to add comment to request")
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const deleteRequestComment = (requestID, commentID) => {
    // the URL for the request
    const url = `${API_HOST}/request/comment/${requestID}/${commentID}`;

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
                console.log("successfully deleted comment to request")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to delete comment to request")
            }
        })
        .catch(error => {
            console.log(error);
        });
};


