import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required'",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    math: [/.+\@.+\..+/, "Please use a valid email address"],
    required: "Eamil is required",
  },
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  educator: {
    type: Boolean,
    default: false,
  },
});

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 8) {
    this.invaldiate("passwprd", "Password must be at least 8 characters");
  }
  if (this.isNew && !this._password) {
    this.invaldiate("password", "Password is required");
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

export default mongoose.model("User", UserSchema);
