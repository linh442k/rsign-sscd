const jwt = require("jsonwebtoken");
const fs = require("fs");
const crypto = require("crypto");

const verifyToken = (signature, certificate) => {
  try {
    var decoded = jwt.verify(signature, certificate);
    // console.log(typeof decoded.data.id);
    if (
      typeof decoded.data.id === "undefined" ||
      typeof decoded.data.teacherId === "undefined" ||
      typeof decoded.data.teacherCertificate === "undefined" ||
      typeof decoded.data.fileHash === "undefined" ||
      typeof decoded.data.fileOriginalName === "undefined" ||
      typeof decoded.data.docCount === "undefined" ||
      typeof decoded.data.expiredAt === "undefined" ||
      typeof decoded.data.createdAt === "undefined" ||
      typeof decoded.data.salt === "undefined" ||
      typeof decoded.data.params === "undefined"
    ) {
      return {
        valid: false,
        message: "Invalid Token Parameter",
      };
    } else
      return {
        valid: true,
        value: decoded,
      };
  } catch (err) {
    return {
      valid: false,
      message: err.message,
    };
  }

  // jwt.verify(signature, certificate, function (err, decoded) {
  //   if (typeof decoded !== "undefined") {
  //     if (
  //       typeof decoded.id === "undefined" ||
  //       typeof decoded.teacherId === "undefined" ||
  //       typeof decoded.teacherCertificate === "undefined" ||
  //       typeof decoded.fileHash === "undefined" ||
  //       typeof decoded.fileOriginalName === "undefined" ||
  //       typeof decoded.docCount === "undefined" ||
  //       typeof decoded.expiredAt === "undefined" ||
  //       typeof decoded.createdAt === "undefined" ||
  //       typeof decoded.salt === "undefined" ||
  //       typeof decoded.params === "undefined"
  //     ) {
  //       return {
  //         valid: false,
  //         message: "Invalid Token Parameter",
  //       };
  //     } else
  //       return {
  //         valid: true,
  //         value: decoded,
  //       };
  //   } else {
  //     return {
  //       valid: false,
  //       message: err.message,
  //     };
  //   }
  // });
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
      console.log(err.message);
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
