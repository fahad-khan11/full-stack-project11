const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowecase:true,
    },
    subscribedAt : {
        type:Date,
        default:Date.now,
    }
})

module.exports = mongoose.model("Subscribe",subscriberSchema)