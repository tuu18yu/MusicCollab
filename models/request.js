const mongoose = require('mongoose')

const artistSchema2 = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    profileName: String
}, { _id : false });

const postSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    title: String
}, { _id : false });

const commentSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
		required: true,
		minlegth: 1,
		trim: true,
	},

    profileName: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},

    comment: {
		type: String,
		required: true
	}
})


const Request = mongoose.model('Request', {
	// id: {
	// 	type: Number,
	// 	required: true,
    //     unique: true
	// },
    postId: postSchema,
   
	requestor: {
        type: artistSchema2 ,
        required: false
    },

	acceptor: {
        type:artistSchema2 ,
        required: false
    },

    isAccepted: {
        type: Boolean,
        required: true,
        default: false
    },

    comments: {
        type: [commentSchema],
        required: true,
        default: []
    }

  
})

module.exports = { Request }