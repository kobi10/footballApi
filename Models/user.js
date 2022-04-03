const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    age: Number,
    email: String,
    password: String,
    createAt: {type: Date, default:Date.now},
    isApproved: {type:Boolean, default:false},
    passcode:Number
});

module.exports = mongoose.model('user', userSchema);