//name,desc,thumbnail (profile pic from my arts),

var exports = module.exports = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.PortfolioInformationSchema = new Schema({
    _artist       : {type: mongoose.Schema.ObjectId , ref : "Artist"},
    name        : String,
    description : String,
    arts : []
}, {collection: 'PortfolioInformation'});
