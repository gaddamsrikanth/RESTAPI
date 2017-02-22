/**
 * Created by lcom48 on 20/1/17.
 */
var mong = require("mongoose");
var schema = mong.Schema;

var user = new schema({
    password : String,
    name : String
});

module.exports = mong.model('user',user);