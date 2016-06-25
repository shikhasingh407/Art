var exports = module.exports = {};

/* Configure the database*/
var connectionUrl = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/ArtGalleryFramework';


exports.reources = {
  connectionUrl : connectionUrl
};