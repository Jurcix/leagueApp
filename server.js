//~~~~~~~~Required libraries and files~~~~~~~~~~~
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var Build = require('./models/builds');
var User = require('./models/users');
var jwt = require('jsonwebtoken');
var cors = require('cors');



//~~~~~~~~~~~~~~Database setup~~~~~~~~~~~~~~~~~~~
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.set('superSecret', config.secret);

//~~~~~~~~~~~~~~Body parser settup~~~~~~~~~~~~~~~

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 9001;
var router = express.Router();

//~~~~~~~~~~~~~~~~~Token setter~~~~~~~~~~~~~~~~~~
router.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Content-Type", "application/json");

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var requestUrl = new RegExp(req.url);
    var configUrl = config.allowedUrls.join();
    if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.' + token,
                    error: err
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else if (requestUrl.test(configUrl) === false) {   // pataisyti!!
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    } else {
        next();
    }
});

//Show json object when user goes to: "http://localhost:9001/api"

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

//~~~~~~~~~~~~~~~~~Rest files~~~~~~~~~~~~~~~~~~~~~~~~~
require('./rest/builds.rest.js')(router, Build);
require('./rest/users.rest.js')(router, User);

//~~~~~~~~~~~~~~~~Login service~~~~~~~~~~~~~~~~~~~~~~~
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
            res.json({success: false, message: 'Login failed. User not found.'});
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({success: false, message: 'Login failed. Wrong password.'});
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
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

//~~~~~~~~~~~~sets to use /api before all routes~~~~~~~~
app.use('/api', router);

app.listen(port);
var logMessage = 'API is running on: http://localhost:' + port + '/api';
console.log(logMessage);