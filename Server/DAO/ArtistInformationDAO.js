(function () {
  var exports = module.exports = {};
  var express = require("express");
  var multer = require('multer');
  var cors = require('cors');
  var bodyParser = require('body-parser');
  var mongoose = require('mongoose');
  var fs = require('fs');
  var bcrypt = require("bcrypt-nodejs");

   var externalArtistInformationJs = require("../Model/ArtistInformation.js");
  var artistModel = mongoose.model('ArtistInformation', externalArtistInformationJs.ArtistInformationSchema);


 // var externalBlogInformationJs = require("../Model/BlogInformation.js");
  //var blogModel = mongoose.model('BlogInformation', externalBlogInformationJs.BlogInformationSchema);

  exports.service = {
    getArtistInformation: getArtistInformation,
    postArtistInformation: postArtistInformation,
    updateArtistInformation: updateArtistInformation,
    deleteArtistInformation: deleteArtistInformation,
    createArtist: createArtist,
    findArtistById: findArtistById,
    loggedIn: loggedIn,
    logout: logout,
    login: login,

    findArtistByArtistName: findArtistByArtistName
    //findArtistByCredentials: findArtistByCredentials,
    //findArtistByUsername: findArtistByUsername
  };
  //
  //function findArtistByUsername (username, res) {
  //
  //  artistModel
  //      .findArtistByUsername(username)
  //      .then(
  //          function(artist){
  //            res.json(artist);
  //          },
  //          function(err){
  //            res.statusCode(404).send(err);
  //          }
  //      );
  //}
  //
  //function findArtistByCredentials(username, password, res) {
  //
  //  artistModel
  //      .findArtistByCredentials(username, password)
  //      .then(
  //          function(artist){
  //            res.json(artist);
  //          },
  //          function(err){
  //            res.statusCode(404).send(err);
  //          }
  //      );
  //}
  //


  function findArtistByArtistName(username){
    return artistModel.findOne({username : username});
  }

  function findArtistById (req, res) {
    return artistModel.findOne({_id: req.params.id});
  }


  function loggedIn(req,res){
    if(req.isAuthenticated()){
      res.json(req.artist);
    }
    else {
      res.send('0');
    }
  }

  function login(req, res) {
    console.log("IN ArTIST");
    var artist= req.artist;
    res.json(artist);
  }

  function logout(req,res){
    req.logout();
    res.send(200);
  }

  function createArtist(req) {
    //console.log("user.model.server.createUser()");
    //console.log(user);
    return artistModel.create(req.body);
  }

  function getArtistInformation(req) {
    return artistModel.findOne(req.params, function (error, artist) {
      if (!error) {
        return artist;
      } else {
        return error;
      }
    });
  }


  function postArtistInformation(req) {
    var artistData = getArtistUploadData(req);
    return new artistModel(artistData).save(function (error, data) {
      if (error) {
        return error;
      } else {
        return data;
      }
    });

  }

  function updateArtistInformation(req) {
    console.log("update function");
    var artistData = getArtistUploadData(req);
    var artistDataClone = JSON.parse(JSON.stringify(artistData));
    delete artistDataClone['_id'];
    return artistModel.findOneAndUpdate({_id: artistData._id}, artistDataClone, {new: true}).then(
        function (doc, err) {
          if (!err) {
            console.log(doc);
            return doc;
          }
          else {
            console.log(err);
            return err;
          }
        });
  }

  function deleteArtistInformation(req) {
    console.log("delete function");
    return artistModel.remove(req.params, function (error, artist) {
      if (!error) {
        return "artist removed";
      } else {
        return error;
      }
    });
  }

  function getArtistUploadData(req) {
    var artistData = JSON.parse(req.body.artistData);
    artistData.displayPic = [];
    for (var i = 0; i < req.files.length; i++) {
      var image = {
        imageData: fs.readFileSync(req.files[i].path),
        imageName: req.files[i].originalname,
        fileName: req.files[i].filename,
        path: req.files[i].path,
        size: req.files[i].size,
        encoding: req.files[i].encoding
      };
      artistData.displayPic.push(image);
      console.log(image);
    }

    return artistData;
  }


})();