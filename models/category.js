const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        unique:[true,'this category is already exist'],
        minlength:[3,'name to short'],
        maxlength:[32,'too long '],
    },
    slug:{
        type:String,
        lowercase:true
    },

},{timestamps:true})

module.exports = mongoose.model("catgory", categorySchema);