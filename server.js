var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var Build = require('./models/builds');


mongoose.connect(config.database);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 9001;
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        message: 'howdy! api is running!',
        users: {
            getAllUsers: 'GET:          /api/users - Get all the users.',
            createUser: 'POST:          /api/users - Create a user.',
            getUserById: 'GET:          /api/users/:userId  Get a single user.',
            updateUserById: 'PUT:       /api/users/:userId  Update a user with new info.',
            deleteUserById: 'DELETE:    /api/users/:userId  Delete a user.'
        },
        comments: {
            getAllComments: 'GET:       /api/comments - Get all comments.',
            createComment: 'POST:       /api/comments - Create a comment.',
            getCommentsByTopic: 'GET:   /api/comments/:topic - get comments by topic.'
        },
        authenticate: {
            authenticate: 'POST:      /api/authenticate - send username and password to get token'
        }
    });
});

require('./rest/builds.rest.js')(router, Build);

app.use('/api', router);
app.listen(port);
var logMessage = 'API is running on: http://localhost:' + port + '/api';
console.log(logMessage);