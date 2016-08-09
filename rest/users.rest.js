module.exports = function (router, User){

    router.route('/users')

    .post(function(req,res){

        var user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at
        });
        console.log(user, req.body);

        user.save(function(err){
            if (err){
                console.log('ERROR :' + err);
                res.status(500).json({error:err});
            } else {
                console.log('SUCCESS!' );
                res.status(200).json({message: 'User created successfully'});
            }
        });
    });

    router.route('/users/:username')

        .get(function(req,res){
            User.find({username: req.params.username}, function(err, user) {
                if (err) {
                    console.log('ERROR :' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS!');
                    res.status(200).json({message: 'User found successfully'});
                }
            });
        })

        .put(function (req,res){
            User.find({username: req.params.username}, function(err, user){
                if(err){
                    console.log('ERROR :' + err);
                    res.status(500).json({error:err});
                    return 0;
                }

                for (var key in req.body){
                    user[key] = req.body[key];
                }

                user.save(function(err){
                    if (err) {
                        console.log('ERROR :' + err);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS!');
                        res.status(200).json({success: 'User updated successfully'});
                    }
                })
            })
        })

        .delete(function(req,res){
            User.remove({username: req.params.username}, function(err, user){
                if(err){
                    console.log('ERROR :' + err);
                    res.status(500).json({error:err});
                } else {
                    console.log('SUCCESS!');
                    res.status(200).json({message: 'User deleted successfully'});
                }

            });
        })


};
