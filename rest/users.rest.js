var jwt = require ('jsonwebtoken');
module.exports = function (router, User) {

    router.route('/users')

        .post(function (req, res) {


            var user = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                created_at: req.body.created_at,
                updated_at: req.body.updated_at
            });
            console.log(user, req.body);

            user.save(function (err) {
                if (err) {
                    console.log('ERROR :' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS!');
                    res.status(200).json({message: 'User created successfully'});
                }
            });

        });

    router.route('/users/:username')

        .get(function (req, res) {
            User.find({username: req.params.username}, function (err, user) {
                if (err) {
                    console.log('ERROR :' + err);
                    res.status(500).json({error: err});
                } else if (user.username === null){
                    console.log ('ERROR');
                    res.status(404).json({message: 'User not found'});
                } else {
                    console.log('SUCCESS!');
                    res.status(200).json({message: 'User found successfully', user: user});
                }
            });
        })


        .put(function (req, res) {
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            var decoded = jwt.decode(token, {complete: true});
            console.log(decoded.payload._doc._id);

            if (decoded.payload._doc.username == req.body.username) {
                User.find({username: req.params.username}, function (err, user) {
                    if (err) {
                        console.log('ERROR :' + err);
                        res.status(500).json({error: err});
                        return 0;
                    }

                    for (var key in req.body) {
                        user[key] = req.body[key];
                    }

                    user.save(function (err) {
                        if (err) {
                            console.log('ERROR :' + err);
                            res.status(500).json({error: err});
                        } else {
                            console.log('SUCCESS!');
                            res.status(200).json({success: 'User updated successfully'});
                        }
                    })
                })
            } else {
                res.status(500).json({message: "Niu niu niu, go back to your own profile (ノಠ益ಠ)ノ"});
            }
        })

        .delete(function (req, res) {
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            var decoded = jwt.decode(token, {complete: true});
            console.log(decoded.payload._doc._id);

            if (decoded.payload._doc.username == req.body.username) {
                User.remove({username: req.params.username}, function (err, user) {
                    if (err) {
                        console.log('ERROR :' + err);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS!');
                        res.status(200).json({message: 'User deleted successfully'});
                    }

                });
            } else {
                res.status(500).json({message: "Niu niu niu, go back to your own profile (ノಠ益ಠ)ノ"});
            }
        })


};
