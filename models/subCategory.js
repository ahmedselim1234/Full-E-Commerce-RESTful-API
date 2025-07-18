
const mongoose=require('mongoose');

const subCategorySchema= new mongoose.Schema({
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
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'catgory',
        required:[true,'category is required'],
    }
},{timestamps:true})

module.exports=mongoose.model('subCategory',subCategorySchema)