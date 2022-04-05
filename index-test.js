require("dotenv").config();
const { connectDB } = require("./util/db");
connectDB();
const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// var morgan = require("morgan");
var path = require("path");
// const crypto = require("crypto");
// const { hashFile, delFile } = require("./util/index");

// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./document");
//   },
//   filename: function (req, file, callback) {
//     const uniqueFileName = encodeURI(file.originalname) + Date.now().toString();
//     const uniqueFileNameHash = crypto
//       .createHash("sha256")
//       .update(uniqueFileName)
//       .digest("hex");
//     const ext = file.originalname.split(".").pop();
//     callback(null, uniqueFileNameHash + "." + ext);
//   },
// });
// const upload = multer({ storage: storage });

const app = express();

// app.use(morgan("dev"));
// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// app.post("/test_upload_files", upload.array("files"), testUploadFiles);

// app.get("/test-download", (req, res) => {
//   var options = {
//     root: path.join(__dirname, "document/"),
//   };
//   var fileName = "astah-uml.exe";
//   res.sendFile(fileName, options, function (err) {
//     if (err) {
//       next(err);
//     } else {
//       console.log("Sent:", fileName);
//     }
//   });
// });

// app.get("/test-del", function (req, res) {
//   const pathDelete = path.join(__dirname, req.body.path);
//   console.log(pathDelete);
//   // res.json({ a: 1 });
//   const del = delFile(pathDelete);
//   res.json({ a: 1 });
//   // res.sendFile(path.join(__dirname, `/document/wardrobe rebuild.docx`));
// });

// app.get("/test-2", function (req, res) {
//   res.sendFile(path.join(__dirname, `/document/wardrobe rebuild.docx`));
// });

// function testUploadFiles(req, res) {
//   console.log(req.body);
//   console.log(req.files.map((file) => file.path));
//   console.log(req.files.map((file) => hashFile(file.path)));
//   res.json({ message: "Successfully uploaded files" });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started...`);
  console.log(path.join(__dirname, "document"));
});
