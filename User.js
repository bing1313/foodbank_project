var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    name: String,
    description: String,
    contact_info: String, 
    food_availability: String,
    pickup_date: String,
    pickup_time: String,
    contentType: String,
    profileType: String,
    address: String,
    zipcode: String,
    path:String,
    image: Buffer,
    reviews: [{
            type: mongoose.Schema.ObjectId, 
            ref: 'Review'
        }]
    });

module.exports = mongoose.model('User', userSchema);
