/*
 MongoDB 2.4 database added.  Please make note of these credentials:

 Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/
 Database Name:  dump
 Password:       rr2RlNQArDKq
 Username:       admin

 */
var express = require("express");
var multer = require('multer');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var externalArtUploadJs = require("./Server/Model/ArtUpload.js");
var externalArtistInformationJs = require("./Server/Model/ArtistInformation.js");
var externalBlogInformationJs = require("./Server/Model/BlogInformation.js");
var externalPortfolioInformationJs = require("./Server/Model/PortfolioInformation.js");
var externalResources = require("./Server/resources/resources.js");

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require("bcrypt-nodejs");

var GoogleStrategy = require('passport-google-oauth2').Strategy;

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(bodyParser({'limit':'50mb'}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy(localStrategy));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

var facebookConfig = {
    clientID     : process.env.FACEBOOK_CLIENT_ID_PROJECT,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET_PROJECT,
    callbackURL  : process.env.FACEBOOK_CALLBACK_URL
};

passport.use(new FacebookStrategy(facebookConfig, facebookLogin));

/* Configure the database*/
mongoose.connect(externalResources.reources['connectionUrl']);
var artModel = mongoose.model('ArtInformation', externalArtUploadJs.ArtUploadSchema);
var artistModel = mongoose.model('ArtistInformation', externalArtistInformationJs.ArtistInformationSchema);

/*Configure the multer.*/
app.use(multer({dest: './uploads/'}).array('uploadedData'));

app.get("/auth/google", passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read']
}));
app.get("/auth/google/callback", passport.authenticate('google', {
    successRedirect: '/#/profile',
    failureRedirect: '/#/login'
}));

var googleConfig = {
    clientID     : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL  : process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback   : true
};

passport.use('google', new GoogleStrategy(googleConfig, googleLogin));

app.get('/process', function (req, res) {
    res.json(process.env);
});

// congifuring the blog database

var blogModel = mongoose.model('BlogInformation', externalBlogInformationJs.BlogInformationSchema);

var portfolioModel = mongoose.model('PortfolioInformation', externalPortfolioInformationJs.PortfolioInformationSchema);

/*Run the server.*/
var ipAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipAddress);


// CRUD FUNCTION CALLS FOR ART

app.post('/rest/upload', function (req, res) {
    var artData = JSON.parse(req.body.artData);
    artData.uploadedImages = [];
    for (var i = 0; i < req.files.length; i++) {
        var image = {
            imageData: fs.readFileSync(req.files[i].path),
            imageName: req.files[i].originalname,
            fileName: req.files[i].filename,
            path: req.files[i].path,
            size: req.files[i].size,
            encoding: req.files[i].encoding
        };
        artData.uploadedImages.push(image);
        console.log(image);
    }

    var newArtObject = new artModel(artData);
    newArtObject.save(function (error, data) {
        if (error) {
            res.send({error: error});
        } else {
            res.json(data);
        }
    });

});




// functions for passport authentications:

app.get("/auth/facebook",passport.authenticate('facebook'), facebookLogin);
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/#/profile',
        failureRedirect: '/#/login'
    }));

function facebookLogin(token, refreshToken, profile, done){
    artistModel
        .findOne({'facebook.id': profile.id})
        .then(
            function(fbuser){
                if(fbuser) {
                    return done(null, fbuser);
                }
                else {
                    fbuser = {
                        username: profile.displayName.replace(/ /g,''),
                        facebook: {
                            token: token,
                            id: profile.id,
                            displayName: profile.displayName
                        },
                        email: "example@ex.com",
                        name: profile.displayName.replace(/ /g,'')
                    };
                    console.log(fbuser);
                    artistModel
                        .create(fbuser)
                        .then(
                            function(artist){

                                console.log("FBUSER CREATED!");
                                done(null,artist);
                            }
                        );
                }
            }
        )
}


function googleLogin(request, accessToken, refreshToken, profile, done){
    var id = {"email": profile.email};
    artistModel
        .findOne(id)
        .then(
            function(googleUser) {
                if(googleUser) {
                    done(null, googleUser);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var googleUser = {
                        username: emailParts[0],
                        name: emailParts[0],
                        email: email,
                        google: {
                            id: profile.id,
                            token: accessToken
                        }
                    };
                    artistModel
                        .create(googleUser)
                        .then(
                            function(artist){
                                done(null,artist);
                            },
                            function(error){
                                done(error,null);
                            }
                        );
                }
            },
            function(error){
                done(error,null);
            }
        );
}


function localStrategy(username,password,done){
    var id = {"email":username};
    artistModel
        .findOne(id)
        .then(
            function(artist){
                if(artist && password == artist.password) {
                    done (null, artist);
                }
                else{
                    done(null,false);
                }

            },
            function(error){
                done(error);
                console.log("4")
            }
        );
}

function serializeUser(artist, done) {
    done(null, artist);
}

function deserializeUser(artist, done) {
    console.log("5");
    artistModel
        .findById(artist._id)
        .then(
            function(artist){
                done(null, artist);
            },
            function(error){
                done(error, null);
            }
        );
}


// CRUD FUNCTION CALLS FOR ARTIST

var externalArtistDAO = require('./Server/DAO/ArtistInformationDAO.js');

app.get('/rest/artists/:email', function(req, res) {
    externalArtistDAO.service.getArtistInformation(req).then(function (response) {
        res.send(response);
    });
});

app.get('/rest/artist/:id', function(req, res) {
    externalArtistDAO.service.findArtistById(req).then(function (response) {
        res.send(response);
    });
});

app.get('/rest/artist/', function(req, res) {
    externalArtistDAO.service.findArtistById(req).then(function (response) {
        res.send(response);
    });
});

app.post('/rest/logout', function(req, res) {
    req.logout();
    res.send(200);
});

app.get('/rest/loggedin', function(req, res) {
    if(req.isAuthenticated()){
        console.log(req);
        res.json(req.user);
    }
    else {
        res.send('0');
    }
});


app.post('/rest/artist/', function(req) {
    externalArtistDAO.service.createArtist(req).then(function (response) {
        res.send(response);
    });
});

app.post('/rest/login', passport.authenticate('local'), function(req, res) {
    var user = req.user;
    console.log(user);
    return res.json(user);
});



app.post('/rest/artists', function(req, res) {
    externalArtistDAO.service.postArtistInformation(req).then(function(response) {
        res.send(response);
    });
});

app.put('/rest/artists', function(req, res) {
    externalArtistDAO.service.updateArtistInformation(req).then(function(response) {
        res.send(response);
    });
});


app.delete('/rest/artists', function(req, res) {
    externalArtistDAO.service.deleteArtistInformation(req).then(function(response) {
        res.send(response);
    });
});

// CRUD operations for BLOG

app.delete('/rest/blog/:blogId', function deleteBlog(req, res){
    var id = req.params.blogId;
    blogModel
        .remove({_id: id})
        .then(
            function(stats){
                console.log(stats);
                res.send(200);
            },
            function(error){
                res.sendStatus(400);
            });
});

app.put('/rest/blog/:blogId', function updateBlog(req, res){
    var id = req.params.blogId;
    var newBlog = req.body;
    blogModel
        .update({_id: id},{
            $set: newBlog
        })
        .then(
            function(newBlog) {
                console.log(newBlog);
                res.json(newBlog);
            },
            function(error) {
                res.sendStatus(400);
            }
        );

});

app.post('/rest/artist/:artistId/blog', function createBlog(req, res){
    var blog = req.body;

    blogModel
        .create(blog)
        .then(
            function(blog) {
                res.json(blog);
            },
            function(err){
                res.statusCode(400).send(err);
            }
        );

});

app.get('/rest/artist/:artistId/blog', function findBlogForArtistId(req, res){
    var artistId = req.params.artistId;
    blogModel
        .find({"_artist": artistId})
        .then(
            function(blogs) {
                console.log(blogs);
                res.json(blogs);
            },
            function(error) {
                res.sendStatus(400);
            }
        );
});

app.get('/rest/blog/:blogId', function findBlogByBlogId(req, res){
    var id = req.params.blogId;
    blogModel
        .findById(id)
        .then(
            function(blog){
                console.log(blog);
                res.json(blog);
            },
            function(error){
                res.sendStatus(400);
            }
        );

});

app.put('/artist/:artistId/blog', function reorderBlog(req, res) {
    var artistId = req.params.artistId;
    var start = parseInt(req.query.start);
    var end =  parseInt(req.query.end);

    blogModel
        .reorderBlog(start, end, artistId)
        .then(
            function (stats) {
                res.sendStatus(200);
            },
            function (error) {
                res.sendStatus(400);
            });
});

app.get('/rest/allArts/:artistName', function (req, res) {
    var artistName = req.params.artistName;
    console.log(artistName);
    artModel.find({'artistName': artistName}, function (error, art) {
        if (art) {
            res.send(art);
        } else {
            res.send(error);
        }

    });
});

// CRUD operations for Portfolio

app.delete('/rest/portfolio/:portfolioId', function deletePortfolio(req, res){
    var id = req.params.portfolioId;
    portfolioModel
        .remove({_id: id})
        .then(
            function(stats){
                console.log(stats);
                res.send(200);
            },
            function(error){
                res.sendStatus(400);
            });
});

app.put('/rest/portfolio/:portfolioId', function updatePortfolio(req, res){
    var id = req.params.portfolioId;
    var newPortfolio = req.body;
    portfolioModel
        .update({_id: id},{
            $set: newPortfolio
        })
        .then(
            function(newPortfolio) {
                console.log(newPortfolio);
                res.json(newPortfolio);
            },
            function(error) {
                res.sendStatus(400);
            }
        );

});

app.post('/rest/artist/:artistId/portfolio', function createPortfolio(req, res){
    var portfolio = req.body;

    portfolioModel
        .create(portfolio)
        .then(
            function(portfolio) {
                res.json(portfolio);
            },
            function(err){
                res.statusCode(400).send(err);
            }
        );

});

app.get('/rest/artist/:artistId/portfolio', function findPortfoliosForArtistId(req, res){
    var artistId = req.params.artistId;
    portfolioModel
        .find({"_artist": artistId})
        .then(
            function(portfolios) {
                res.json(portfolios);
            },
            function(error) {
                res.sendStatus(400);
            }
        );
});

app.get('/rest/portfolio/:portfolioId', function findPortfolioByPortfolioId(req, res){
    var id = req.params.portfolioId;
    portfolioModel
        .findById(id)
        .then(
            function(portfolio){
                console.log(portfolio);
                res.json(portfolio);
            },
            function(error){
                res.sendStatus(400);
            }
        );

});

//delete Art

app.delete('/rest/art/:artId', function deleteArt(req,res){

    var id = req.params.artId;
    artModel
        .remove({_id: id})
        .then(
            function(stats){
                console.log(stats);
                res.send(200);
            },
            function(error){
                res.sendStatus(400);
            });

});

