const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SignRequestSchema = new Schema({
  teacherId: {
    type: String,
    required: true,
  },
  teacherCertificate: {
    type: Object,
    required: true,
    default: {},
  },
  fileHash: {
    type: [String],
    required: true,
  },
  fileOriginalName: {
    type: [String],
    required: true,
  },
  docCount: {
    type: Number,
    required: true,
  },
  fileLocation: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  signedAt: {
    type: Date,
    default: null,
  },
  expiredAt: {
    type: Date,
    default: Date.now() + 5 *60 * 60 * 1000,
  },
  params: {
    type: Object,
    default: null,
  },
  salt: {
    type: String,
    default: "",
  },
  keepFile: {
    type: Boolean,
    default: true,
  },
  // status: {
  //   type: String,
  //   enum: ["PENDING", "SIGNED", "EXPIRED"],
  //   default: "PENDING",
  // },
});

module.exports = mongoose.model("SignRequest", SignRequestSchema);
