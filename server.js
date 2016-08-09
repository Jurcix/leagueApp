var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var Build = require('./models/builds');
var jwt = require('jsonwebtoken');

mongoose.connect(config.database);

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 9001;
var router = express.Router();

router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.',
                    error: err
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else if (config.allowedUrls.indexOf(req.url) === -1) {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    } else {
        //if there is no token but api path is allowed through config
        next();
    }
});

router.get('/', function (req, res) {
    res.json({
        message: 'WOAH IT WORKS!',
        users: {},
        Builds: {
            getAllBuilds: 'GET:       /api/builds - Get all builds.',
            createBuild: 'POST:       /api/createbuild - Create a build.',
            getBuildById: 'GET:   /api/builds/:build_id - get build by ID. ',
            updateBuildById: 'PUT:   /api/user/builds/:build_id - - update build by ID.',
            deleteBuildById: 'DELETE:   /api/user/builds/:build_id - - delete build by ID.'
        },
        authenticate: {
            authenticate: 'POST:      /api/login - send username and password to get token'
        }
    });
});

require('./rest/builds.rest.js')(router, Build);

router.post('/login', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {

        if (err) {
            console.log('ERROR AUTH USER: ' + err.errmsg);
            res.status(403).json({error: err});
            return;
        }

        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 60 * 60 * 72 // expires in 24 hours
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Token is set!',
                    token: token,
                    userID: user._id,
                    username: user.username
                });
            }

        }

    });
});


app.use('/api', router);
app.listen(port);
var logMessage = 'API is running on: http://localhost:' + port + '/api';
console.log(logMessage);