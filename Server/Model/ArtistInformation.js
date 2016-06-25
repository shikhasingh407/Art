var exports = module.exports = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.ArtistInformationSchema = new Schema({
  username: {type: String},
  email: {type: String},
  password: {type: String},
  name: {type: String},
  address: String,
  phone: Number,
  dob: {type: Date, default: Date.now},
  displayPic: [],
  facebook: {
    token: String,
    id: String,
    displayName: String
  },
  google: {
    token: String,
    id: String
  },
  isActive: {type: Boolean, default: true}
}, {collection: 'ArtistInformation'});
