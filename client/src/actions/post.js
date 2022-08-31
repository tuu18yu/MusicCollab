// environment configutations
import ENV from '../config.js'
const API_HOST = ENV.api_host


// A function to send a POST request with a new user
export const addPost = (workForm) => {
    // the URL for the request
    const url = `${API_HOST}/posts`;

    // The data we are going to send in our request
    const post = workForm;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: post,
        headers: {
            Accept: "application/json, text/plain, */*"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                alert("Your work was successfully uploaded");
                console.log("Post was successfully added")
                
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                alert("Your work was not uploaded. Try again");
                console.log("failed to add post")
                
            }
        })
        .catch(error => {
            console.log("post error: " + error);
            alert("Your work was not uploaded. Try again");
            
        });
};

export const updatePost = (workForm) => {
    // the URL for the request
    const url = `${API_HOST}/posts/updatePost`;
    console.log("in add post")

    // The data we are going to send in our request
    const post = workForm;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "PATCH",
        body: post,
        headers: {
            Accept: "application/json, text/plain, */*"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                alert("Your work was successfully uploaded");
                console.log("Post was successfully added")
                
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                alert("Your work was not uploaded. Try again");
                console.log("failed to add post")
                
            }
        })
        .catch(error => {
            console.log("post error: " + error);
            alert("Your work was not uploaded. Try again");
            
        });
};



export const getUsersPosts = async (userID,setState) => {

    const url = `${API_HOST}/posts/usersPosts/${userID}`;

    try {
        const res =  await fetch(url);

        if (res.status !== 200) {
            console.log("Could not get user's posts");
            return;
        }

        const result = res.json();

        result.then(json => {
            console.log("got user's posts");
            console.log("this is result " + result)
            // the resolved promise with the JSON body
            if(json) {
                setState([...json]);
            }
            
        })

    }
    catch(error) {
        console.log(error);
    };
    
};


export const getPostsWithIds = async (idsList, setState) => {

    const url = `${API_HOST}/posts/getWorksByIds`;

    const  list = {
        ids: idsList
    }

    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(list),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    try {
        const res =  await fetch(request);

        if (res.status !== 200) {
            console.log("Could not get works");
            return;
        }

        const result = res.json();

        result.then(json => {
            console.log("got works");
            console.log("this is result " + result)
            // the resolved promise with the JSON body
            if(json) {
                setState([...json]);
            }
            
        })

    }
    catch(error) {
        console.log(error);
    };
    
};

export const getExplorePosts = async (type, setState) => {
    let url;
    if(type === 'trending') {
        url = `${API_HOST}/posts/trendingWorks`;
    }
    else if(type === 'recent'){
        url = `${API_HOST}/posts/recentWorks`
    }
    else {
        return;
    }

    try {
        const res =  await fetch(url);

        if (res.status !== 200) {
            console.log("Could not get works");
            return;
        }

        const result = res.json();

        result.then(json => {
            console.log("got works");
            // the resolved promise with the JSON body
            if(json) {
                setState([...json]);
            }
            
        })

    }
    catch(error) {
        console.log(error);
    };
    
};


export const getAllPosts = async (setState) => {

    const url = `${API_HOST}/posts/allWorks`;

    try {
        const res =  await fetch(url);

        if (res.status !== 200) {
            console.log("Could not get works");
            return;
        }

        const result = res.json();

        result.then(json => {
            console.log("got all works");
            // the resolved promise with the JSON body
            if(json) {
                setState([...json]);
            }
            
        })

    }
    catch(error) {
        console.log(error);
    };
    
};

export const getPost = (id, setPost) => {

    const url = `${API_HOST}/api/posts/${id}`;


    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "get",
        headers: {
            Accept: "application/json, text/plain, /",
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
            setPost({
                id: json.id,
                coverPhoto: json.coverPhoto,
                audio: json.audio,
                title: json.title,
                artist: json.artist,
                description: json.description,
                recievedLikes: json.recievedLikes,
                likesCount: json.likesCount,
                categories: json.categories,            
                tags: json.tags,
                references: json.references,
                comments: json.comments,
                dateCreated: json.dateCreated
            });
        })
        .catch(error => {
            console.log(error);
        });
};

export const addPostComment = (comment, postID) => {
    // the URL for the request
    const url = `${API_HOST}/api/posts/comment/${ postID }`;

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
                console.log("successfully added comment")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to add comment")
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const deleteComment = (postID, commentID) => {
    // the URL for the request
    const url = `${API_HOST}/api/posts/comment/${postID}/${commentID}`;

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
                console.log("successfully deleted comment")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to delete comment")
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const deletePost = (id) => {
    // the URL for the request
    const url = `${API_HOST}api/posts/${id}`;

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
                console.log("successfully removed post")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to remove post")
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const addLikedUser = (userID, postID) => {
    // the URL for the request
    const url = `${API_HOST}/api/posts/recievedLikes/${ postID }`;
    const postJSON = {id: userID}
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

export const removedLikeUser = (userID, postID) => {
    // the URL for the request
    const url = `${API_HOST}/api/posts/recievedLikes/${postID}/${userID}`;

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
                console.log("successfully removed user from liked list")
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("failed to remove user from liked list")
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const changeLikedCounts = (postID, number) => {
    // the URL for the request
    const url = `${API_HOST}/api/posts/likesCount/${ postID }`;
    const postJSON = {n: number}
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

export const getPostInfo = (setPostData) => {
    // the URL for the request
    const url = `${API_HOST}/api/posts`;

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
            setPostData({posts: json.posts});
        })
        .catch(error => {
            console.log(error);
        });
};


// export const getIsLiked = (id, userId, setIsLiked) => {

//     const url = `${API_HOST}/api/posts/isLiked/${id}/${userId}`;


//     // Create our request constructor with all the parameters we need
//     const request = new Request(url, {
//         method: "get",
//         headers: {
//             Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json"
//         }
//     });

//     // Send the request with fetch()
//     fetch(request)
//         .then(res => {
//             if (!res) {
//                 setIsLiked(false);
//             }
//             else {
//                 setIsLiked(true)
//             }
//         })
//         .catch(error => {
//             console.log(error);
//         });
// };


