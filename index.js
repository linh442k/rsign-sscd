require("dotenv").config();
const { connectDB } = require("./util/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { authenticateRequest } = require("./middleware/index");
const signRequestRouter = require("./route/signRequest");
const authenticateUserRouter = require("./route/authenticateUser");
const testRouter = require("./route/test");
const {
  deleteFileByTeacherId,
  deleteFilePeriodically,
} = require("./util/deleteSignedOrExpired");
const CronJob = require("cron").CronJob;
const app = express();

connectDB();
// delete file at 24h everyday
// const periodicallyDeleteFile = new CronJob(
//   "* * * * *",
//   deleteFilePeriodically,
//   null,
//   true,
//   "Asia/Ho_Chi_Minh"
// );
// periodicallyDeleteFile.start();
// deleteFile();
// setTimeout(() => deleteFileByTeacherId("linh"), 2000);

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// app.all("*", authenticateRequest);
app.use("/api/sign-request", signRequestRouter);
app.use("/api/authenticate", authenticateUserRouter);
app.use("/test", testRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
