var exports = module.exports = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.BlogInformationSchema = new Schema({
    _artist       : {type: mongoose.Schema.ObjectId , ref : "Artist"},
    name        : String,
    text        : String,
    //placeholder : String,
    description : String,
    //url         : String,
    //width       : String,
    //height      : Number,
    //rows        : Number,
    //size        : Number,
    //class       : String,
    //icon        : String,
    //deletable   : Boolean,
    formatted   : Boolean,
    dateCreated : {type: Date, default : Date.now}
}, {collection: 'BlogInformation'});
