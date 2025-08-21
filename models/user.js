
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Userschema=new Schema({
    email:{
        type:String,
        require:true,
        unique: true
    }
});

Userschema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User', Userschema);