const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const moment = require("moment");
moment().format();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    contactnumber: {
      type: String,
    },

    passwordResetToken: { type: String, default: "" },
    passwordResetExpires: { type: Date, default: moment().utcOffset(0) },

    hash_password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};
module.exports = mongoose.model("User", userSchema);
