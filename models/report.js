const mongoose = require('mongoose')

const artistSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    profileName: String,
    usename: String
}, { _id : false });


const Report = mongoose.model('Report', {
	// id: {
	// 	type: Number,
	// 	required: true,
    //     unique: true
	// },
    date: {
        type: String,
        required: true,
        default: ""
    },

    reported: {
		type: Object,
		required: true,
		minlegth: 1,
		trim: true
	},

    user: {
		type: artistSchema,
		required: true,
		trim: true
	},

    reason: {
		type: String,
		required: false,
	},

    type: {
		type: String,
		required: true,
	},

    isArchived: {
        type: Boolean,
        required: true,
        default: false
    }

  
})

module.exports = { Report }