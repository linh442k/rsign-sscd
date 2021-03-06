const express = require("express");
const router = express.Router();
const SignRequest = require("../model/SignRequest");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectID;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticateRequest } = require("../middleware/index");
const User = require("../model/User");
const {
  uniqueFileNameGen,
  validateSignRequest,
  hashFile,
  saltGen,
  verifyToken,
  convertMSOfficeToPDF,
} = require("../util/index");
const base64encode = (file) => {
  var body = fs.readFileSync(file);
  return body.toString("base64");
};
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./document");
  },
  filename: function (req, file, callback) {
    callback(null, uniqueFileNameGen(file.originalname));
  },
  // originalname: function (req, file, callback) {
  //   callback(null, encodeURI(file.originalname));
  // },
});
const handleFileUpload = multer({ storage: storage });

// router.use(authenticateRequest);
router.post("/create", handleFileUpload.array("files"), async (req, res) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });

  var teacherId = "";
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    teacherId = decoded.teacherId;
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, message: "Invalid token" });
  }

  const validateRequest = validateSignRequest(req);
  if (!validateRequest.valid)
    return res
      .status(400)
      .json({ success: false, message: validateRequest.message });

  // const teacherId = req.teacherId;
  const fileHash = req.files.map((file) => hashFile(file.path));
  const docCount = req.files.length;
  const params =
    typeof req.body.params !== "undefined" ? JSON.parse(req.body.params) : null;
  const fileLocation = req.files.map((file) => file.path);
  const teacherCertificate =
    typeof req.body.teacherCertificate !== "undefined"
      ? JSON.parse(req.body.teacherCertificate)
      : {};
  const salt = saltGen(32);
  // const fileOriginalName = req.files.map((file) => {
  //   encodeURI(file.originalname);
  // });
  const fileOriginalName = [];
  for (var i = 0; i < docCount; i++) {
    fileOriginalName.push(encodeURI(req.files[i].originalname));
  }
  // console.log(fileOriginalName);
  try {
    const newSignRequest = new SignRequest({
      teacherId,
      fileHash,
      fileLocation,
      teacherCertificate,
      docCount,
      salt,
      fileOriginalName,
      params,
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
});

router.post("/fetch-data", async (req, res) => {
  // must have teacherId from header

  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });

  var teacherId = "";
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    teacherId = decoded.teacherId;
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, message: "Invalid token" });
  }

  // const teacherId =
  // typeof req.teacherId !== "undefined" ? req.teacherId : "123";
  const status = typeof req.body.status !== "undefined" ? req.body.status : "";
  const signRequestId =
    typeof req.body.signRequestId !== "undefined" ? req.body.signRequestId : "";
  const fileIndex =
    typeof req.body.fileIndex !== "undefined" ? req.body.fileIndex : -1;
  const skipIndex =
    typeof req.body.skipIndex !== "undefined" ? req.body.skipIndex : 0;
  const limitIndex =
    typeof req.body.limitIndex !== "undefined" ? req.body.limitIndex : 5;
  const sortByCreated =
    typeof req.body.sortByCreated !== "undefined"
      ? req.body.sortByCreated === -1
        ? -1
        : 1
      : 1;
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
      )
        .sort({ createdAt: sortByCreated })
        .skip(skipIndex)
        .limit(limitIndex);
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
      )
        .sort({ createdAt: sortByCreated })
        .skip(skipIndex)
        .limit(limitIndex);
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
      )
        .sort({ createdAt: sortByCreated })
        .skip(skipIndex)
        .limit(limitIndex);
      res.json({ success: true, requests: signedRequests });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    if (signRequestId !== "" && fileIndex !== -1) {
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
        // console.log(request);
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
          // <<<<<<< feature/convert-ms-office
          const filePath = request[0].fileLocation[fileIndex];
          console.log(filePath);
          const ext = filePath.split(".").pop();
          if (ext === "pdf") {
            console.log("Send pdf");
            //             return res.sendFile(path.join(__dirname, `..\\` + filePath));
            return res.json({
              success: true,
              file: base64encode(path.join(__dirname, `..\\` + filePath)),
            });
          } else {
            const convertedFilePath = filePath + ".pdf";
            try {
              if (fs.existsSync(convertedFilePath)) {
                console.log("File Converted Before");
                //                 return res.sendFile(
                //                   path.join(__dirname, `..\\` + convertedFilePath)
                //                 );
                return res.json({
                  success: true,
                  file: base64encode(
                    path.join(__dirname, `..\\` + convertedFilePath)
                  ),
                });
              } else {
                console.log("Convert File Now!");
                const convertRes = await convertMSOfficeToPDF(filePath);
                // console.log(convertRes);
                if (convertRes.success) {
                  //                   return res.sendFile(
                  //                     path.join(__dirname, `..\\` + convertedFilePath)
                  //                   );
                  return res.json({
                    success: true,
                    file: base64encode(
                      path.join(__dirname, `..\\` + convertedFilePath)
                    ),
                  });
                } else {
                  res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                }
              }
            } catch (e) {
              console.log(e);
              res
                .status(500)
                .json({ success: false, message: "Internal server error" });
            }
          }
          // =======
          //           // res.sendFile(
          //           //   path.join(__dirname, `..\\` + request[0].fileLocation[fileIndex])
          //           // );
          //           // return;
          //           const file = path.join(__dirname, `..\\` + request[0].fileLocation[fileIndex])
          //           res.json({
          //             success: true,
          //             file: base64encode(file)
          //           })

          //           // fs.readFile(file, (err, data)=>{
          //           //   if(err){
          //           //     console.log(err)
          //           //     res.status(500)
          //           //   }else{
          //           //     res.setHeader("ContentType", "application/pdf")
          //           //     res.end(data)
          //           //   }
          //           // })
          // >>>>>>> main
        }
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid Request Parameter(s)" });
    }
  }
  // user id
  // status ==> all
  // specific request id + index ==> download file
});

router.post("/sign", async (req, res) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });

  var teacherIdTmp = "";
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    teacherIdTmp = decoded.teacherId;
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, message: "Invalid token" });
  }

  var certificate = "";
  try {
    const user = await User.findOne({ username: teacherIdTmp });
    certificate = user.devicePub;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  // return res.end();
  // const certificate = Buffer.from(process.env.TEMP_PUBLIC_KEY);

  const signature = req.body.signToken;
  const verifyResult = verifyToken(signature, certificate);
  // console.log(verifyResult);
  if (verifyResult.valid) {
    const {
      id,
      teacherId,
      teacherCertificate,
      fileHash,
      fileOriginalName,
      docCount,
      expiredAt,
      createdAt,
      salt,
      params,
    } = verifyResult.value.data;
    if (teacherId !== teacherIdTmp) {
      return res.status(400).json({
        success: false,
        message: "Not Authenticate",
      });
    }
    // console.log(verifyResult.value.data);
    // return res.send("test");
    const currentTime = Date.now();
    const expireTime = new Date(expiredAt);
    if (expireTime.getTime() <= currentTime) {
      return res.sendStatus(400).json({
        success: false,
        message: "Expired request!",
      });
    }
    try {
      const signRequest = await SignRequest.find(
        {
          _id: ObjectId(id),
          teacherId: teacherId,
          teacherCertificate: teacherCertificate,
          fileHash: fileHash,
          fileOriginalName: fileOriginalName,
          docCount: docCount,
          expiredAt: expiredAt,
          createdAt: createdAt,
          salt: salt,
          params: params,
          signedAt: null,
        },
        {}
      );
      // return res.send(signRequest);
      if (signRequest.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Request has been accepted before!",
        });
      }
      // send sign request/file to hsm
      // then del file?
      try {
        const updateSignRequest = await SignRequest.findByIdAndUpdate(id, {
          signedAt: currentTime,
        });
        return res.json({
          success: true,
          message: "Sign Request Accepted",
        });
      } catch (e) {
        console.error(e);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    } catch (e) {
      console.error(e);
      return res
        .status(400)
        .json({ success: false, message: "Invalid Request Parameter(s)" });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: verifyResult.message });
  }
});

module.exports = router;
