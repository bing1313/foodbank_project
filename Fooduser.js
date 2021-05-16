var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
//mongoose.connect('mongodb://localhost:27017/myDatabase');

var Schema = mongoose.Schema;

var foodSchema = new Schema({
	username: String,
	veg: Array,
	nonperishables: Array,
	meats: Array,
	dairy: Array

    });

// export userSchema as a class called User
module.exports = mongoose.model('Fooduser', foodSchema);
