/* server.js for react-express-authentication */
"use strict";

/* Server environment setup */
// To run in development mode, run normally: node server.js
// To run in development with the test user logged in the backend, run: TEST_USER_ON=true node server.js
// To run in production mode, run in terminal: NODE_ENV=production node server.js
const env = process.env.NODE_ENV // read the environment variable (will be 'production' in production mode)

const USE_TEST_USER = env !== 'production' && process.env.TEST_USER_ON // option to turn on the test user.
const TEST_USER_ID = '5fb8b011b864666580b4efe3' // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
const TEST_USER_EMAIL = 'test@user.com'
//////

const log = console.log;
const path = require('path')

const express = require("express");
// starting the express server
const app = express();

// enable CORS if in development, for React local development server to connect to the web server.
const cors = require('cors')
if (env !== 'production') { app.use(cors()) }
//app.use(cors())

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
// mongoose.set('useFindAndModify', false); // for some deprecation issues

// import the mongoose models
const { Post } = require("./models/post");
const { User } = require("./models/user");
const { Report } = require("./models/report");
const { Request } = require("./models/request");

// to validate object IDs
const { ObjectID } = require("mongodb");

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// cloudinary: configure using credentials found on your Cloudinary Dashboard
// sign up for a free account here: https://cloudinary.com/users/register/free
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'drb9bln9e',
    api_key: '613421648522464',
    api_secret: 'u2mxWbV7NoXdDAo9pzfMh1lodw8'
});

// body-parser: middleware for parsing parts of the request into a usable object (onto req.body)
const bodyParser = require('body-parser') 
app.use(bodyParser.json({
    limit: '50mb'
  }));
  
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));
  
// app.use(bodyParser.json()) // parsing JSON body
// app.use(bodyParser.urlencoded({ extended: true })); // parsing URL-encoded form data (from form POST requests)


// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require('connect-mongo'); // to store session information on the database in production


function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
    return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log('Issue with mongoose connection')
        res.status(500).send('Internal server error')
        return;
    } else {
        next()  
    }   
}

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
    if (env !== 'production' && USE_TEST_USER)
        req.session.user = TEST_USER_ID // test user on development. (remember to run `TEST_USER_ON=true node server.js` if you want to use this user.)

    if (req.session.user) {
        User.findById(req.session.user).then((user) => {
            if (!user) {
                return Promise.reject()
            } else {
                req.user = user
                next()
            }
        }).catch((error) => {
            res.status(401).send("Unauthorized")
        })
    } else {
        res.status(401).send("Unauthorized")
    }
}


/*** Session handling **************************************/
// Create a session and session cookie
app.use(
    session({
        secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
            httpOnly: true
        },
        // store the sessions on the database in production
        store: env === 'production' ? MongoStore.create({
                                                mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/MusicCollabAPI'
                                 }) : null
    })
);

// A route to login and create a session
// A route to login and create a session
app.post("/users/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // log(email, password);
    // Use the static method on the User model to find a user
    // by their email and password
    User.findByUsernamePassword(username, password)
        .then(user => {
            // Add the user's id to the session.
            // We can check later if this exists to ensure we are logged in.
            req.session.user = user._id;
            req.session.username = user.username;
            req.session.isAdmin = user.isAdmin;
             // we will later send the email to the browser when checking if someone is logged in through GET /check-session (we will display it on the frontend dashboard. You could however also just send a boolean flag).
            res.send({ username: user.username,  isAdmin: user.isAdmin, id: user._id });
        })
        .catch(error => {
            res.status(400).send()
        });
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
    // Remove the session
    req.session.destroy(error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});

// A route to check if a user is logged in on the session
app.get("/users/check-session", (req, res) => {
    if (env !== 'production' && USE_TEST_USER) { // test user on development environment.
        req.session.user = TEST_USER_ID;
        req.session.email = TEST_USER_EMAIL;
        res.send({ currentUser: TEST_USER_EMAIL })
        return;
    }

    if (req.session.user) {
        res.send({ username: req.session.username,  isAdmin: req.session.isAdmin, id: req.session.user });
    } else {
        res.status(401).send();
    }
});

// A route to get user info
app.get("/users/details/:username", async (req, res) => {
    
    if(!req.params.username) {
        res.status(401).send('Invalid username provided');
        return;
    }
    
    const username = req.params.username;

	try {

		const user = await User.findOne({username: username})
		
		if(!user) {
			res.status(404).send('Resource not found')
			return;
		}

        

		res.send(user)

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		
        res.status(500).send(error) // 400 for bad request gets sent to client.
        return;
	}
	
});


// A route to get user info
app.get("/users/:id", async (req, res) => {
    
    if(!req.params.id) {
        res.status(401).send('Invalid id provided');
        return;
    }
    
    const id = req.params.id;

	try {

		const user = await User.findOne({_id: id})
		
		if(!user) {
			res.status(404).send('Resource not found')
			return;
		}

		res.send(user)

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		
        res.status(500).send(error) // 400 for bad request gets sent to client.
        return;
	}
	
});

app.post("/users/checkPassword", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // log(email, password);
    // Use the static method on the User model to find a user
    // by their username and password
    User.findByUsernamePassword(username, password)
        .then(user => {
            // Add the user's id to the session.
            // We can check later if this exists to ensure we are logged in.
            if(user){
                res.send({result: "valid"});
            }
            else{
                res.send({result: "invalid"});
            }
        })
        .catch(error => {
            if(error){
                console.log(error);
                res.status(400).send(err);
            }
            else {
                res.send({result: "invalid"});
            }
            
            
        });
});


app.patch("/users/bio", async (req, res) => {

    const id = req.body.userId;
    const bio = req.body.biography;

	try {

        		
		const result = await User.findOneAndUpdate({_id: id} , {$set: {"biography" : bio }}, {new: true, useFindAndModify: false})


		if(!result) {
			res.status(404).send('Resource not found')
			return;
		}

        

		res.send(result)

	} catch(error) {
		log(error) // log server error to the console, not to the client.
        res.status(500).send(error) // 400 for bad request gets sent to client.
        return;
	}
	
});


app.patch("/users/updatePassword", async (req, res) => {

    const id = req.body.id;
    const password = req.body.password;

	try {

        User.findById(id, function(err, doc) {
            if(err){
                console.log(err)
                res.status(400).send(err)
                return
            }
            if(doc){
                doc.password = password;
                doc.save();
                res.send("successfully changed password")
            }
            else{
                res.status(404).send('Resource not found')
            }
            
          });	
		//const result = await User.findOneAndUpdate({_id: id} , {$set: {"password" : password }}, {new: true, useFindAndModify: false})


		// if(!result) {
		// 	res.status(404).send('Resource not found')
		// 	return;
		// }

		// res.send(result)

	} catch(error) {
		log(error) // log server error to the console, not to the client.
        res.status(500).send(error) // 400 for bad request gets sent to client.
        return;
	}
	
});

app.patch("/users/updateProfile", async (req, res) => {

    const id = req.body.id;
    let data;

    if(req.body.isAdmin) {
        data = {
            "profileName": req.body.profileName,
            "email": req.body.email
        }
    }
    else {
        data = {
            "profileName" : req.body.profileName,
            "email" : req.body.email,
            "interests" : req.body.interests
        }
    }

	try {		
		const result = await User.findOneAndUpdate({_id: id} , {$set: data}, {new: true, useFindAndModify: false})
        const test = await Post.updateMany({"artist.id": id }, { $set: { "artist.profileName": req.body.profileName } } );
        const test2 = await Post.updateMany({"comments.userId": id}, { $set: { "comments.$[].profileName": req.body.profileName } } );
        const test3 = await Request.updateMany({"comments.userId": id}, { $set: { "comments.$[].profileName": req.body.profileName } } );
        const test4 = await Request.updateMany({"requestor.id": id }, { $set: { "requestor.profileName": req.body.profileName } } );
        const test5 = await Request.updateMany({"acceptor.id": id }, { $set: { "acceptor.profileName": req.body.profileName } } );

		if(!result) {
			res.status(404).send('Resource not found')
			return;
		}

        if(!test) {
			res.status(404).send('Resource not found')
			return;
		}

        if(!test2) {
			res.status(404).send('Resource not found')
			return;
		}

		res.send(result)

	} catch(error) {
		log(error) // log server error to the console, not to the client.
        res.status(500).send(error) // 400 for bad request gets sent to client.
        return;
	}
	
});

app.patch("/users/updateCoverPhoto", multipartMiddleware, async (req, res) => {

    const id = req.body.userId;
    const imageId = req.body.imageId;

    if(!id) {
        return res.status(400).send("Invald IDs")
    }

	try {

        await cloudinary.v2.uploader.upload(
            req.files.image.path, // req.files contains uploaded files
            function async (err, result) {
                if(err) {
                    console.log(err)
                    return res.status(400).send(err)
                }
                // Create a new image using the Image mongoose model
                const img = {
                    imageId: result.public_id, // image id on cloudinary server
                    imageUrl: result.url, // image url on cloudinary server
                    createdOn: new Date(),
                };

                User.findOneAndUpdate({_id: id} , {$set: {"profilePhoto" : img }}, {new: true, useFindAndModify: false})
                    .then( result2 => {
                        if(!result2) {
                            res.status(404).send('Resource not found')
                        }
                        else {
                            res.send(result2)
                        }
        
                        
                    })
            });

        if(imageId) {
            await cloudinary.v2.uploader.destroy(
                imageId, // req.files contains uploaded files
                function (err, result) {
                    if(err) {
                        console.log(err)
                        return res.status(400).send(err)
                    }
                });
    }


	} catch(error) {
		log(error) // log server error to the console, not to the client.
        res.status(500).send(error) // 400 for bad request gets sent to client.
        return;
	}
	
});

app.post('/users/getUsersByIds', async (req, res) => {
	// Add code here

    const ids = req.body.ids;

	try {
		
        const results = await User.find({
            '_id': {$in : ids}
        });

        results ? res.send(results) : res.status(404).send('Resource not found')

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})

//add a user to another users followings list 
app.post('/users/addFollowing/:userId/:addedUserId', async (req, res) => {
	// Add code here


    const userId = req.params.userId;
    const addedUserId = req.params.addedUserId;


	try {
		
        const results = await User.findOneAndUpdate({_id: userId}, {$addToSet: {followings: addedUserId} }, {new: true, useFindAndModify: false})
        console.log(results)
        if(!results) {
			res.status(404).send('Resource not found')
			return;
		}

        const results2 = await User.findOneAndUpdate({_id: addedUserId}, {$addToSet: {followers: userId} }, {new: true, useFindAndModify: false})
        console.log(results2)
        results2 ? res.send(results2) : res.status(404).send('Resource not found')

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})

app.delete('/users/removeFollowing/:userId/:addedUserId', async (req, res) => {
	// Add code here

    const userId = req.params.userId;
    const addedUserId = req.params.addedUserId;

	try {
		
        const results = await User.findOneAndUpdate({_id: userId}, {$pull: {followings: addedUserId} }, {new: true, useFindAndModify: false})

        if(!results) {
			res.status(404).send('Resource not found')
			return;
		}

        const results2 = await User.findOneAndUpdate({_id: addedUserId}, {$pull: {followers: userId} }, {new: true, useFindAndModify: false})

        results2 ? res.send(results2) : res.status(404).send('Resource not found')

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})


/// Route for getting works for 1 user
app.get('/posts/usersPosts/:userId', async (req, res) => {
	// Add code here

	const userId = req.params.userId

	try {
		const post = await Post.find({"artist.id": userId})
		post ? res.send(post) : res.status(404).send('Resource not found')
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})



//Posts routes

app.post('/posts/getWorksByIds', async (req, res) => {
	// Add code here

    const ids = req.body.ids;

	try {
		
        const results = await Post.find({
            '_id': {$in : ids}
        });

        results ? res.send(results) : res.status(404).send('Resource not found')

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})
app.get('/posts/allWorks', async (req, res) => {
	// Add code here

	try {
		const result = await Post.find()
        res.send(result)
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})


app.get('/posts/recentWorks', async (req, res) => {
	// Add code here

	try {
		await Post.find({}).sort({dateCreated: 'desc'}).exec((err, docs) => { 
            if(err){
                console.log(err)
                res.status(404).send('Resource not found')
                return;
            }
            res.send(docs)

        });
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})

app.get('/posts/trendingWorks', async (req, res) => {
	// Add code here

	try {
		await Post.find({}).sort({likesCount: 'desc'}).exec((err, docs) => { 
            if(err){
                console.log(err)
                res.status(404).send('Resource not found')
                return;
            }

            res.send(docs)

        });
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})


app.post('/posts', multipartMiddleware, async (req, res) => {
    log(`Adding post`)
 
    // Create a new student using the Student mongoose model
    const post = new Post({
        coverPhoto: {},
        audio: {},
        artist: {id: req.body.userId, profileName: req.body.artist},
        description: req.body.description,
        tags: JSON.parse(req.body.hashtags),
        categories: JSON.parse(req.body.categories),
        references: JSON.parse(req.body.references),
        title: req.body.title
    })

    try {

        await cloudinary.v2.uploader.upload(
            req.files.originalImage.path, // req.files contains uploaded files
            function (err, result) {
                if(err) {
                    console.log(err)
                    return res.status(400).send(err)
                }
                // Create a new image using the Image mongoose model
                const img = {
                    imageId: result.public_id, // image id on cloudinary server
                    imageUrl: result.url, // image url on cloudinary server
                    createdOn: new Date(),
                };

                post.coverPhoto = img
            });

        await cloudinary.v2.uploader.upload(
            req.files.originalAudio.path, 
            {
                resource_type: "video",
            },
            function (err, result) {

                
                if(err) {
                    console.log(err)
                    return res.status(400).send(err)
                }

                // Create a new image using the Image mongoose model
                const audio = {
                    audioId: result.public_id, // image id on cloudinary server
                    audioUrl: result.url, // image url on cloudinary server
                    createdOn: new Date(),
                };

                post.audio = audio;
            });



        const result = await post.save() 
        result ? res.send(result) :  res.status(400).send('Failed to add work')

    } catch(error) {
        log(error) // log server error to the console, not to the client.
        res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
    }
})

app.patch('/posts/updatePost', multipartMiddleware, async (req, res) => {
    log(`Updating post`)

    const id = req.body.postId;
    const imageId = req.body.imageId;
    const audioId = req.body.audioId;
 
    // Create a new student using the Student mongoose model
    let post = {
        description: req.body.description,
        tags: JSON.parse(req.body.hashtags),
        categories: JSON.parse(req.body.categories),
        references: JSON.parse(req.body.references),
        title: req.body.title
    }

    try {
        const test = await Request.updateMany({"postId.id": id }, { $set: { "postId.title": req.body.title } } );
        
        if(req.files && req.files.originalImage) {

            await cloudinary.v2.uploader.upload(
                req.files.originalImage.path, // req.files contains uploaded files
                function (err, result) {
                    if(err) {
                        console.log(err)
                        return res.status(400).send(err)
                    }
                    // Create a new image using the Image mongoose model
                    const img = {
                        imageId: result.public_id, // image id on cloudinary server
                        imageUrl: result.url, // image url on cloudinary server
                        createdOn: new Date(),
                    };

                    post.coverPhoto = img
                });

                console.log("uploaded image")
        }
        
        if(req.files && req.files.originalAudio) {
        
            await cloudinary.v2.uploader.upload(
                req.files.originalAudio.path, 
                {
                    resource_type: "video",
                },
                function (err, result) {

                    
                    if(err) {
                        console.log(err)
                        return res.status(400).send(err)
                    }

                    // Create a new image using the Image mongoose model
                    const audio = {
                        audioId: result.public_id, // image id on cloudinary server
                        audioUrl: result.url, // image url on cloudinary server
                        createdOn: new Date(),
                    };

                    post.audio = audio;
                });

            console.log("uploaded audio")
        }

        Post.findOneAndUpdate({_id: id} , {$set: post}, {new: true, useFindAndModify: false})
                    .then( result2 => {
                        if(!result2) {
                            res.status(404).send('Resource not found')
                        }
                        else {
                            res.send(result2)
                        }
                        
                    })
        if(req.files && req.files.originalImage) {
            await cloudinary.v2.uploader.destroy(
                imageId, // req.files contains uploaded files
                function (err, result) {
                    if(err) {
                        console.log(err)
                        return res.status(400).send(err)
                    }
                });
        }
        if(req.files && req.files.originalAudio) {

            await cloudinary.v2.uploader.destroy(
                audioId, // req.files contains uploaded files
                function (err, result) {
                    if(err) {
                        console.log(err)
                        return res.status(400).send(err)
                    }
                });
        }

    } catch(error) {
        log(error) // log server error to the console, not to the client.
        res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
    }
})


app.get("/api/posts/:id", async (req, res) => {
    
    const id = req.params.id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const post = await Post.findById(id)
		if (!post) {
			post.status(404).send('Resource not found')  // could not find this student
		} else {
			/// sometimes we might wrap returned object in another object:
			//res.send({student})   
			res.send({  
                id: post._id,
                coverPhoto: post.coverPhoto,
                audio: post.audio,
                title: post.title,
                artist: post.artist,
                description: post.description,
                likesCount: post.likesCount,
                recievedLikes: post.recievedLikes,
                categories: post.categories,            
                tags: post.tags,
                references: post.references,
                comments: post.comments,
                dateCreated: post.dateUploaded
            });
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
	
});

//request routes

app.post('/request', multipartMiddleware, async (req, res) => {
    log(`Adding request`)
 
    // Create a new student using the Student mongoose model
    const request = new Request({
        requestor: req.body.requestor,
        acceptor: req.body.acceptor,
        postId: req.body.postId,
        comments: req.body.comments
    })

    try {

        const result = await request.save() 
        result ? res.send(request) :  res.status(400).send('Failed to send request')

    } catch(error) {
        log(error) // log server error to the console, not to the client.
        res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
    }
})


app.get('/request/sentRequests/:requestorId', async (req, res) => {
	// Add code here

    const id = req.params.requestorId

	try {
		
        const results = await Request.find({
            'requestor.id': id
        });

        results ? res.send(results) : res.status(404).send('Resource not found')

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})


app.get('/request/receivedRequests/:acceptorId', async (req, res) => {
	// Add code here

    const id = req.params.acceptorId

	try {
		
        const results = await Request.find({
            'acceptor.id': id
        });

        results ? res.send(results) : res.status(404).send('Resource not found')

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})

app.delete('/request/deleteRequest/:requestId', async (req, res) => {
	// Add code here

    const id = req.params.requestId

	// Delete a user by their _id
	try {
		const student = await Request.findByIdAndRemove(id)

		if (!student) {
			res.status(404).send()
		} else {   
			res.send(student)
		}
	} catch(error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}
})


app.patch('/request/acceptRequest/:requestId', async (req, res) => {
	// Add code here
    log("in heer")
    const id = req.params.requestId

	try {

        const results = await Request.findOneAndUpdate({_id: id} , {isAccepted : true}, {new: true, useFindAndModify: false})
		const result = await User.findOneAndUpdate({_id: results.requestor.id } , {$push: {"accessTo": results.postId.id}}, {new: true, useFindAndModify: false})
        results ? res.send(results) : res.status(404).send('Resource not found')

	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

})
/*********************************************************/

/*** API Routes below ************************************/
// User API Route
// app.post('/api/users', mongoChecker, async (req, res) => {
//     log(req.body)

//     // Create a new user
//     const user = new User({
//         email: req.body.email,
//         password: req.body.password
//     })

//     try {
//         // Save the user
//         const newUser = await user.save()
//         res.send(newUser)
//     } catch (error) {
//         if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
//             res.status(500).send('Internal server error')
//         } else {
//             log(error)
//             res.status(400).send('Bad Request') // bad request for changing the student.
//         }
//     }
// })

/** User resource routes **/
// a POST route to *create* a user
app.post('/api/users', mongoChecker, async (req, res) => {
    log(`Adding user ${req.body.username}`)

    // Create a new student using the Student mongoose model
    const user = new User({
        username: req.body.username,
        profileName: req.body.profileName,
        email: req.body.email,
        interests: req.body.interests,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    })


    // Save student to the database
    // async-await version:
    try {
        const result = await user.save() 
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
    }
})

// a POST route to *create* a log
// {
//    time : '',
//    action: ''
// }
app.post('/api/users/activity/:id', mongoChecker, async (req, res) => {
    log(`Adding log`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const log = await User.findOneAndUpdate({_id: id}, {$push: {"activityLog": req.body.time + ' - ' + req.body.action}}, {new: true, useFindAndModify: false})
		if (!log) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(log)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

app.delete('/api/users/activity/:id', mongoChecker, async (req, res) => {
    log(`clearing logs`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const log = await User.findOneAndUpdate({_id: id}, {"activityLog": []}, {new: true, useFindAndModify: false})
		if (!log) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(log)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

// a GET route to get all users
app.get('/api/users', mongoChecker, async (req, res) => {

    // Get the students
    try {
        const users = await User.find()
        // res.send(students) // just the array
        res.send({ users }) // can wrap students in object if want to add more properties
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }

})

// A route to get user info
app.get("/api/users/:id", async (req, res) => {
    
    const id = req.params.id

	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const user = await User.findById(id)
		if (!user) {
			user.status(404).send('Resource not found')  // could not find this student
		} else {
			/// sometimes we might wrap returned object in another object:
			//res.send({student})   
			res.send({  
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
                password: user.password,
                profileName: user.profileName,
                email: user.email,
                interests: user.interests,
                uploadedWorks: user.uploadedWorks,
                downloadedWorks: user.downloadedWorks,
                likedWorks: user.likedWorks, 
                followers: user.followers,
                followings: user.followings,
                lastLogIn: user.lastLogIn,
                activityLog: user.activityLog,
                profilePhoto: user.profilePhoto,
                accessTo: user.accessTo
            });
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
	
});


// Delete User
app.delete('/api/users/:id', async (req, res) => {
	const id = req.params.id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 

	// Delete a user by their _id
	try {
		const student = await User.findByIdAndRemove(id)
        await User.updateMany({}, { $pull: { "followings": id } });
        await User.updateMany({}, { $pull: { "followers": id } });
        await Post.updateMany({}, { $pull: { "recievedLikes": id } });
        await Report.updateMany({}, { $pull: { "reported.$._id": id} });
		if (!student) {
			res.status(404).send()
		} else {   
			res.send(student)
		}
	} catch(error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}

	
})


app.post('/api/users/likedWorks/:id', mongoChecker, async (req, res) => {
    log(`Liking Posts`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const liked = await User.findOneAndUpdate({_id: id}, {$push: {"likedWorks": req.body.id }}, {new: true, useFindAndModify: false})
		if (!liked) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(liked)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

app.delete('/api/users/likedWorks/:id/:post_id', (req, res) => {
	// Add code here
	const id = req.params.id
	const post_id = req.params.post_id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	User.findOneAndUpdate({_id: id}, {$pull: {"likedWorks":  post_id}}, {new: true, useFindAndModify: false})
	.then((like) => {
		if (!like) {
			res.status(404).send()
		} else {   
			res.send(like)
		}
	})
	.catch((error) => {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}) 
})

app.post('/api/users/downloadedWorks/:id', mongoChecker, async (req, res) => {
    log(`Downloading Posts`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const liked = await User.findOneAndUpdate({_id: id}, {$push: {"downloadedWorks": req.body.id }}, {new: true, useFindAndModify: false})
		if (!liked) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(liked)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})


app.post('/api/users/setLastLogIn/:id', async (req, res) => {
	// check mongoose connection established.
	log(`changing last log in info`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const log = await User.findOneAndUpdate({_id: id}, {"lastLogIn": req.body.time}, {new: true, useFindAndModify: false})
		if (!log) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(log)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})
//---------------------------------------------------------------------------------------------------------------------------------------------//

// a GET route to get all posts
app.get('/api/posts', mongoChecker, async (req, res) => {

    // Get the students
    try {
        const posts = await Post.find()
        // res.send(students) // just the array
        res.send({ posts }) // can wrap students in object if want to add more properties
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }

})

// A route to get user info
app.get("/api/posts/:id", async (req, res) => {
    
    const id = req.params.id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const post = await Post.findById(id)
		if (!post) {
			post.status(404).send('Resource not found')  // could not find this student
		} else {
			/// sometimes we might wrap returned object in another object:
			//res.send({student})   
			res.send({  
                id: post._id,
                coverPhoto: post.coverPhoto,
                audio: post.audio,
                title: post.title,
                artist: post.artist,
                description: post.description,
                likesCount: post.likesCount,
                recievedLikes: post.recievedLikes,
                categories: post.categories,            
                tags: post.tags,
                references: post.references,
                comments: post.comments,
                dateCreated: post.dateUploaded
            });
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
	
});

app.post('/api/posts/comment/:id', mongoChecker, async (req, res) => {
    log(`Adding comment`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const comment = await Post.findOneAndUpdate({_id: id}, {$push: {"comments": req.body }}, {new: true, useFindAndModify: false})
		if (!comment) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(comment)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

app.delete('/api/posts/comment/:id/:comment_id', (req, res) => {
	// Add code here
	const id = req.params.id
	const comment_id = req.params.comment_id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	Post.findOneAndUpdate({_id: id}, {$pull: {"comments": {"_id": comment_id}}}, {new: true, useFindAndModify: false})
	.then((comment) => {
		if (!comment) {
			res.status(404).send()
		} else {   
			res.send(comment)
		}
	})
	.catch((error) => {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}) 
})

app.post('/api/posts/recievedLikes/:id', mongoChecker, async (req, res) => {
    log(`Adding Users To liked list`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const liked = await Post.findOneAndUpdate({_id: id}, {$push: {"recievedLikes": req.body.id }}, {new: true, useFindAndModify: false})
		if (!liked) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(liked)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

app.delete('/api/posts/recievedLikes/:id/:user_id', (req, res) => {
	// Add code here
	const id = req.params.id
	const user_id = req.params.user_id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	Post.findOneAndUpdate({_id: id}, {$pull: {"recievedLikes":  user_id}}, {new: true, useFindAndModify: false})
	.then((like) => {
		if (!like) {
			res.status(404).send()
		} else {   
			res.send(like)
		}
	})
	.catch((error) => {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}) 
})

// Delete Post
app.delete('/api/posts/:id', async (req, res) => {
	const id = req.params.id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 

	// Delete a user by their _id
	try {
		const post = await Post.findByIdAndRemove(id)
        await User.updateMany({}, { $pull: { "likedWorks": id } });
        await User.updateMany({}, { $pull: { "accessTo": id } });
        await User.updateMany({}, { $pull: { "downloadedWorks": id } });
        await Post.updateMany({}, { $pull: { "references": {"id": id} } });
        await Report.updateMany({}, { $pull: { "reported.$.id": id} });
		if (!post) {
			res.status(404).send()
		} else {   
			res.send(post)
		}
	} catch(error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}

	
})

app.post('/api/posts/likesCount/:id', mongoChecker, async (req, res) => {
    log(`changing count likes`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const log = await Post.findOneAndUpdate({_id: id}, {"likesCount": req.body.n}, {new: true, useFindAndModify: false})
		if (!log) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(log)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

// A route to get user info
app.get("/api/posts/isLiked/:id/:userId", async (req, res) => {

    const id = req.params.id
    const userId = req.params.userId


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const liked = await Post.find({_id: id, recievedLikes: { $in: [userId] }})
		res.send(liked)

	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
	
});

// -----------------------------------------------------------------------------------------

app.post('/api/reports', async (req, res) => {
    log(`Adding report`)

    // Create a new student using the Student mongoose model
    const report = new Report({
        type: req.body.type,
        user: req.body.user,
        date: req.body.date,
        reason: req.body.reason,
        reported: req.body.reported 
    })

    // async-await version:
    try {
        const result = await report.save() 
        res.send(result)
    } catch(error) {
        log(error) // log server error to the console, not to the client.
        res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
    }
})

app.get('/api/reports', mongoChecker, async (req, res) => {

    // Get the students
    try {
        const reports = await Report.find()
        // res.send(students) // just the array
        res.send({ reports }) // can wrap students in object if want to add more properties
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }

})


app.get('/api/unarchived/reports', mongoChecker, async (req, res) => {

    // Get the students
    try {
        const reports = await Report.find({isArchived: false})
        // res.send(students) // just the array
        res.send({ reports }) // can wrap students in object if want to add more properties
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.get('/api/archived/reports', mongoChecker, async (req, res) => {

    // Get the students
    try {
        const reports = await Report.find({isArchived: true})
        // res.send(students) // just the array
        res.send({ reports }) // can wrap students in object if want to add more properties
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }

})


// Delete User
app.delete('/api/reports/:id', async (req, res) => {
	const id = req.params.id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 

	// Delete a user by their _id
	try {
		const report = await Report.findByIdAndRemove(id)
		if (!report) {
			res.status(404).send()
		} else {   
			res.send(report)
		}
	} catch(error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}

	
})

app.post('/api/reports/changeArchive/:id', mongoChecker, async (req, res) => {
    log(`changing archive status`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const log = await Report.findOneAndUpdate({_id: id}, {"isArchived": req.body.isArchived}, {new: true, useFindAndModify: false})
		if (!log) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(log)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

app.post('/request/comment/:id', mongoChecker, async (req, res) => {
    log(`Adding comment`)
    const id = req.params.id

   // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// If id valid, findById
	try {
		const comment = await Request.findOneAndUpdate({_id: id}, {$push: {"comments": req.body }}, {new: true, useFindAndModify: false})
		if (!comment) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(comment)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

app.delete('/request/comment/:id/:comment_id', (req, res) => {
	// Add code here
	const id = req.params.id
	const comment_id = req.params.comment_id


	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	Request.findOneAndUpdate({_id: id}, {$pull: {"comments": {"_id": comment_id}}}, {new: true, useFindAndModify: false})
	.then((comment) => {
		if (!comment) {
			res.status(404).send()
		} else {   
			res.send(comment)
		}
	})
	.catch((error) => {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}) 
})
// other student API routes can go here...
// ...

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    // check for page routes that we expect in the frontend to provide correct status code.
    const goodPageRoutes = ["/", "/LogIn", "/SignUp"];
    if (!goodPageRoutes.includes(req.url)) {
        // if url not in expected page routes, set status to 404.
        res.status(404);
    }

    // send index.html
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 3000;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});
