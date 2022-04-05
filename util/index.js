const jwt = require("jsonwebtoken");
const fs = require("fs");
const crypto = require("crypto");

const verifyToken = async (signature, certificate) => {
  jwt.verify(signature, certificate, function (err, decoded) {
    if (typeof decoded !== "undefined") {
      return {
        valid: true,
        value: decoded,
      };
    } else {
      return {
        valid: false,
        message: err.message,
      };
    }
  });
};

const hashFile = (path) => {
  const fileBuffer = fs.readFileSync(path);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  const hex = hashSum.digest("hex");
  return hex;
};

const delFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return false;
    }
    // console.log("del files successfully");
    return true;
    //file removed
  });
};

const validateSignRequest = (req) => {
  if (
    typeof req.files === "undefined" ||
    !Array.isArray(req.files) ||
    req.files.length === 0
  ) {
    return {
      valid: false,
      message: "Invalid File(s)",
    };
  } else if (typeof req.body.teacherId !== "string") {
    return {
      valid: false,
      message: "Invalid Teacher Id",
    };
  }
  // else if (typeof req.body.teacherCert !== "object") {
  //   return {
  //     valid: false,
  //     message: "Invalid Teacher Certificate",
  //   };
  // }
  // else if (typeof req.body.params !== "object") {
  //   return {
  //     valid: false,
  //     message: "Invalid Parameter",
  //   };
  // }
  else {
    return {
      valid: true,
    };
  }
};

const uniqueFileNameGen = (originalName) => {
  const uniqueFileName = encodeURI(originalName) + Date.now().toString();
  const uniqueFileNameHash = crypto
    .createHash("sha256")
    .update(uniqueFileName)
    .digest("hex");
  const ext = originalName.split(".").pop();
  return uniqueFileNameHash + "." + ext;
};

const saltGen = (byte = 64) => {
  return crypto.randomBytes(byte).toString("hex");
};

module.exports = {
  verifyToken,
  delFile,
  hashFile,
  validateSignRequest,
  uniqueFileNameGen,
  saltGen,
};