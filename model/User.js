const moongose = require("mongoose");
const Schema = moongose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  devicePub: {
    type: String,
    default: null,
  },
  devicePrv: {
    type: String,
    default: null,
  },
});

module.exports = moongose.model("Users", UserSchema);
