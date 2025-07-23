const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "this category is already exist"],
      minlength: [3, "name to short"],
      maxlength: [32, "too long "],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageUrl=(doc)=>{
       if(doc.image){
        const imageUrl=`${process.env.BASE_URL}/category/${doc.image}`;
        doc.image=imageUrl;
    }
}
categorySchema.post("init", (doc) =>{
   setImageUrl(doc)
});
categorySchema.post("save", (doc) =>{
    setImageUrl(doc)
});

module.exports = mongoose.model("catgory", categorySchema);
