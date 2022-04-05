const express = require("express");
const router = express.Router();
const SignRequest = require("../model/SignRequest");
const ObjectId = require("mongodb").ObjectID;
const multer = require("multer");
const path = require("path");
const {
  uniqueFileNameGen,
  validateSignRequest,
  hashFile,
  saltGen,
  verifyToken,
} = require("../util/index");

console.log(path.join(__dirname, `..\\document\\wardrobe rebuild.docx`));
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./document");
  },
  filename: function (req, file, callback) {
    callback(null, uniqueFileNameGen(file.originalname));
  },
});
const handleFileUpload = multer({ storage: storage });

router.post("/create", handleFileUpload.array("files"), async (req, res) => {
  const validateRequest = validateSignRequest(req);
  if (!validateRequest.valid)
    return res
      .status(400)
      .json({ success: false, message: validateRequest.message });

  const teacherId = req.body.teacherId;
  const fileHash = req.files.map((file) => hashFile(file.path));
  const docCount = req.files.length;
  const fileLocation = req.files.map((file) => file.path);
  const teacherCertificate = { pk: "123" };
  const salt = saltGen(32);
  const fileOriginalName = req.files.map((file) =>
    encodeURI(file.originalname)
  );

  try {
    const newSignRequest = new SignRequest({
      teacherId,
      fileHash,
      fileLocation,
      teacherCertificate,
      docCount,
      salt,
      fileOriginalName,
    });
    await newSignRequest.save();
    res.json({
      success: true,
      message: "Sign Request Created Successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

  //   res.send("end");
});

router.post("/fetch-data", async (req, res) => {
  // must have teacherId from header
  const teacherId =
    typeof req.body.teacherId !== "undefined" ? req.body.teacherId : "123";
  const status = typeof req.body.status !== "undefined" ? req.body.status : "";
  const signRequestId =
    typeof req.body.signRequestId !== "undefined" ? req.body.signRequestId : "";
  const fileIndex =
    typeof req.body.fileIndex !== "undefined" ? req.body.fileIndex : "";
  // console.log(teacherId, status, signRequestId, "abc");
  // console.log(req.body);
  if (status === "PENDING") {
    const currentTime = Date.now();
    try {
      const pendingRequests = await SignRequest.find(
        {
          teacherId: teacherId,
          expiredAt: { $gt: currentTime },
          signedAt: null,
        },
        {
          teacherId: 1,
          teacherCertificate: 1,
          fileHash: 1,
          fileOriginalName: 1,
          // fileLocation: 1,
          docCount: 1,
          createdAt: 1,
          expiredAt: 1,
          params: 1,
          salt: 1,
        }
      );
      res.json({ success: true, requests: pendingRequests });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else if (status === "EXPIRED") {
    const currentTime = Date.now();
    try {
      const expiredRequests = await SignRequest.find(
        {
          teacherId: teacherId,
          expiredAt: { $lte: currentTime },
          signedAt: null,
        },
        {
          teacherId: 1,
          // teacherCertificate: 1,
          // fileHash: 1,
          fileOriginalName: 1,
          // fileLocation: 1,
          docCount: 1,
          createdAt: 1,
          expiredAt: 1,
          // params: 1,
          // salt: 1,
        }
      );
      res.json({ success: true, requests: expiredRequests });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else if (status === "SIGNED") {
    try {
      const signedRequests = await SignRequest.find(
        {
          teacherId: teacherId,
          signedAt: { $ne: null },
        },
        {
          teacherId: 1,
          // teacherCertificate: 1,
          // fileHash: 1,
          fileOriginalName: 1,
          // fileLocation: 1,
          docCount: 1,
          createdAt: 1,
          // expiredAt: 1,
          signedAt: 1,
          // params: 1,
          // salt: 1,
        }
      );
      res.json({ success: true, requests: signedRequests });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    if (signRequestId !== "" && fileIndex !== "") {
      const currentTime = Date.now();
      try {
        const request = await SignRequest.find(
          {
            _id: ObjectId(signRequestId),
            teacherId: teacherId,
          },
          {
            fileLocation: 1,
            _id: 0,
            signedAt: 1,
            expiredAt: 1,
          }
        );
        console.log(request);
        if (
          request[0].signedAt !== null ||
          request[0].expiredAt <= currentTime
        ) {
          res.json({ success: false, message: "Only Pending File" });
          return;
        }
        if (request[0].fileLocation.length === 0) {
          res.json({ success: false, message: "No File Found" });
          return;
        } else if (request[0].fileLocation.length <= fileIndex) {
          res.json({ success: false, message: "No File Found" });
          return;
        } else {
          res.sendFile(
            path.join(__dirname, `..\\` + request[0].fileLocation[fileIndex])
          );

          return;
        }
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid Parameter(s)" });
    }
  }
  // user id
  // status ==> all
  // specific id ==> download file
});

router.post("/sign", async (req, res) => {
  const certificate = Buffer.from(process.env.TEMP_PUBLIC_KEY);
  const signature = req.body.signToken;
  const verifyResult = await verifyToken(certificate, signature);
  if (verifyResult.valid) {
  } else {
    return res
      .status(400)
      .json({ success: false, message: verifyResult.message });
  }
});

router.get("/", async (req, res) => {
  res.send("Hello");
});

module.exports = router;
