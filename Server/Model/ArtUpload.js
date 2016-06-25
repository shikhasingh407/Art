var exports = module.exports = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.ArtUploadSchema = new Schema({
  uniqueName: String,
  artName: String,
  artistName: String,
  artType: String,
  description: String,
  rating: Number,
  likes: Number,
  //sellingPrice: Number,
  //sellingSince: Date,
  availableFrom: {type: Date, default: Date.now},
  startDate: {type: Date, default: Date.now},
  uploadedImages: []
//{
//    imageData : Buffer,
//    imageName : String,
//    fileName : String,
//    path : String,
//    size : Number
//}
}, {collection: 'ArtInformation'});
