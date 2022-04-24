const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    homeTeamName: String,
    awayTeamName: String,
    homeScore: Number,
    awayScore: Number,
    stadium: String,
    matchDate: {type:Date, default: Date.now},
    homeWin: Boolean,
    pubName: String,//first name last name
    pubId: {type:mongoose.Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('Match', matchSchema);