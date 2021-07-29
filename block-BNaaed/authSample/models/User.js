var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var user = new Schema(
  {
    name: String,
    username:{type:String, unique:true, required:true},
    email:{type:String, unique:true, required:true},
    imageurl: String,
  },
  { timestamps: true }
);


module.exports = mongoose.model("Users", user);