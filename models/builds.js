
/**
 * Created by Richard on 8/8/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var buildSchema = new Schema({
    name: {type: String, required:true, unique:true},
    username:{type: String, required:true},
    items: {type: Array, required:true},
    patch: Number,
    champion: String,
    createdAt: Date,
    updatedAt: Date

});

buildSchema.pre('save', function(next) {
    var currentDate = new Date();

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var build = mongoose.model('build',buildSchema);

module.exports = build;