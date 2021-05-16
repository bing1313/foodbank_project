var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    author: {type: String},
    comment: {type: String}
});

module.exports = mongoose.model('Comment', commentSchema);