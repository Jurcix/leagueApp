var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var User = require('./models/users.js');

mongoose.connect(config.database);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*var admin = new User ({
    "username": "user123",
    "password": "user",
    "email": "user123@user.com"
});
admin.save(function (err){
    if (err){
        console.log(err);
    } else {
        console.log("success");
    }
});*/

var port = process.env.PORT ||  9001;
var router = express.Router();

require('./rest/users.rest.js')(router, User);

app.use('/api', router);


app.listen(port);
var logMessage = 'API is running on: http://localhost:' + port + '/api';
console.log(logMessage);

