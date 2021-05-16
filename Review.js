var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reviewSchema = new Schema({
	review: {type: String},
    rating: {type: Number},
    author: {type: String},
    comments: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Review', reviewSchema);