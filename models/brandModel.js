const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        unique:[true,'this category is already exist'],
        minlength:[3,'name to short'],
        maxlength:[32,'too long '],
        trim:true
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:{
        type:String
    }

},{timestamps:true})

module.exports = mongoose.model("brand", brandSchema);