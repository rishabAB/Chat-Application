const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024,
    },
    profile: {
      type: Buffer,
      required: false,
      unique: false,
    },
    imageType: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
// Here mongoose will look for the plural version of user which is users

module.exports = userModel;
