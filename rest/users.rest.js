var jwt = require('jsonwebtoken');
module.exports = function (router, User) {

    router.route('/users')

        .post(function (req, res) {


            var user = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                oldPassword: req.body.oldPassword,
                newPassword: req.body.newPassword,
                repeatPassword: req.body.repeatPassword,
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
            User.find({username: req.params.username}, {username: 1, email: 1, _id: 0}, function (err, user) {
                if (err) {
                    console.log('ERROR :' + err);
                    res.status(500).json({error: err});
                } else if (user.username === null) {     //perkelt i front enda
                    console.log('ERROR');
                    res.status(404).json({message: 'User not found'});
                } else {
                    console.log('SUCCESS!');
                    res.status(200).json({message: 'User found successfully', user: user});
                    console.log(user);
                }
            });
        })



        .put(function (req, res) {
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            var decoded = jwt.decode(token, {complete: true});
            console.log(decoded.payload._doc._id);

            if (decoded.payload._doc.username === req.body.username) {

                User.findOne({username: req.params.username}, function (err, user) {
                    if (err) {
                        console.log('ERROR :' + err);
                        res.status(500).json({error: err});
                        return 0;
                    }
                    /*  else {

                     /!* } else if(req.body.email){
                     user.email = req.body.email;
                     user.save(function(err){
                     if (err){
                     console.log('ERROR :' + err);
                     res.status(500).json({error: err});
                     } else {
                     console.log('SUCCESS!');
                     res.status(200).json({success: 'User updated successfully'});
                     }
                     })
                     }*!/
                     }*/
                    if (user.password === req.body.oldPassword) {
                        /*  if (req.body.newPassword) {*/

                        if (req.body.newPassword === req.body.repeatPassword) {
                            user.password = req.body.newPassword;
                            console.log(JSON.stringify(user, null, 4));
                            User.update(
                                {username: req.params.username},
                                {password: req.body.newPassword},
                                {multi: false},
                                function(err){
                                    if (err) {
                                        console.log('ERROR :' + err);
                                        res.status(500).json({error: err});
                                    } else {
                                        console.log('SUCCESS!');
                                        res.status(200).json({success: 'User updated successfully'});
                                    }
                                }
                            )
                            /* user.markModified('password');
                             user.save(function (err) {
                             if (err) {
                             console.log('ERROR :' + err);
                             res.status(500).json({error: err});
                             } else {
                             console.log('SUCCESS!');
                             res.status(200).json({success: 'User updated successfully'});
                             }
                             })*/
                        } else {
                            console.log('Passwords do not match')
                        }
                    } else {
                        console.log('Old password does not match')
                    }
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
