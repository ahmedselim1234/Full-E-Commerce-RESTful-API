const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "emailmust be unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "too short"],
    },
    role: {
      type: String,
      enum: ["admin", "client","manager"],
      default: "client",
    },
    phone: String,
    profileImage: String,
    active: {
      type: Boolean,
      default: true,
    },
    dateOfChangePassword: {
  type: Date
},

    passwordResetCode: String,
    expireResetCode: Date,
    verifyResetCode: Boolean,
  },
  { timestamps: true }
);
const setImageUrl=(doc)=>{
       if(doc.profileImage){
        const imageUrl=`${process.env.BASE_URL}/user/${doc.profileImage}`;
        doc.profileImage=imageUrl;
    }
}
userSchema.post("init", (doc) =>{
   setImageUrl(doc)
});
userSchema.post("save", (doc) =>{
    setImageUrl(doc)
});

//hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});


module.exports = mongoose.model("User", userSchema);
