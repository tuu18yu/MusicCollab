/* User mongoose model */
const { Int32 } = require('mongodb/lib/bson');
const mongoose = require('mongoose');

const referenceSchema = mongoose.Schema( {

	id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},

    description: {
		type: String,
		required: false,
	},

    name: {
		type: String,
		required: false,
	}
})

const commentSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
		required: true,
		minlegth: 1,
		trim: true
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

const artistSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    profileName: String
}, { _id : false });

const coverPhotoSchema = new mongoose.Schema({
    imageId: String,
    imageUrl: String,
    createdOn: Date
}, { _id : false });

const audioSchema = new mongoose.Schema({
    audioId: String,
    audioUrl: String,
    createdOn: Date
}, { _id : false });


const Post = mongoose.model('Post', {
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },

    coverPhoto: {
        type: coverPhotoSchema,
        required: true
	},

 
    audio: {
        type: audioSchema,
		required: true
    },

    title: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},

    artist: {
		type: artistSchema,
		required: true,
		trim: true
	},

    description: {
		type: String,
		required: false,
	},

    recievedLikes: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        required: true,
        default: []
    },

    categories: {
        type: [String],
		required: true,
        default: []
    },

    tags: {
        type: [String],
		required: true,
        default: []
    },

    references: {
        type: [referenceSchema],
        required: true,
        default: []
    },

    comments: {
        type: [commentSchema],
        required: true,
        default: []
    },
    likesCount: {
        type: Number,
        required: true,
        default: 0
    }
})


module.exports = { Post }