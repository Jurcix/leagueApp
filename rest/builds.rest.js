/**
 * Created by Richard on 8/8/2016.
 */
module.exports = function (router, Build) {
    router.route('/builds')
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Create a build~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        .post(function (req, res) {
            var build = new Build({
                name: req.body.name,
                username: req.body.username,
                items: req.body.items
            });
            build.save(function (err) {
                if (err) {
                    console.log('ERROR SAVING BUILD: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS SAVING BUILD: ' + build.name);
                    res.status(200).json({message: 'Build created!', build: build});
                }
            });

        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Get all builds~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        .get(function (req, res) {
            Build.find(function (err, build) {
                if (err) {
                    console.log('ERROR GETTING build: ' + err.errmsg);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING build');
                    res.status(200).json(build);
                }
            })
        });
    router.route('/builds/:build_id')
         //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Update build~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        .put(function (req, res) {
            Build.findById(req.params.build_id, function (err, build) {
                if (err) {
                    console.log('ERROR UPDATING USER: ' + err.errmsg);
                    res.status(500).json({error: err});
                    return 0;
                }

                for (var key in req.body) {
                    build[key] = req.body[key];
                }
                build.save(function (err) {
                    if (err) {
                        console.log('ERROR UPDATING BUILD: ' + err.errmsg);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS UPDATING BUILD');
                        res.status(200).json({success: 'Build is updated'});
                    }
                });

            });
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Delete a build~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        .delete(function (req, res) {
            Build.remove({
                _id: req.params._id
            }, function (err, build) {
                if (err) {
                    console.log('ERROR DELETING BUILD: ' + err.errmsg);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS DELETING BUILD' + (' id:' + req.params.build_id));
                    res.status(200).json({message: 'Successfully deleted build'});
                }
            });
        });


};