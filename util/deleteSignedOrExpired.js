const SignRequest = require("../model/SignRequest");
const { delFile } = require("./index");

const deleteFilePeriodically = async () => {
  console.log("delete file periodically");
  const currentTime = Date.now();
  try {
    const deleteFileList = await SignRequest.find(
      {
        $or: [
          { signedAt: { $ne: null }, keepFile: true },
          { signedAt: null, expiredAt: { $lte: currentTime }, keepFile: true },
        ],
      },
      {
        fileLocation: 1,
        _id: 0,
      }
    );
    // console.log(deleteFileList.map((list) => list.fileLocation));
    const fileList = [].concat(
      ...deleteFileList.map((list) => list.fileLocation)
    );
    const newFileList = [].concat(
      ...fileList.map((item) => {
        if (item.split(".").pop() !== "pdf") {
          return [item, item + ".pdf"];
        } else return item;
      })
    );
    console.log(newFileList);
    newFileList.map((file) => delFile(file));
    // return deleteFileList;
    try {
      const updateFileList = await SignRequest.updateMany(
        {
          $or: [
            { signedAt: { $ne: null }, keepFile: true },
            {
              signedAt: null,
              expiredAt: { $lte: currentTime },
              keepFile: true,
            },
          ],
        },
        {
          keepFile: false,
        }
      );
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }
};

const deleteFileByTeacherId = async (id = "") => {
  console.log("delete file by id " + id);
  const currentTime = Date.now();
  try {
    const deleteFileList = await SignRequest.find(
      {
        $or: [
          { teacherId: id, signedAt: { $ne: null }, keepFile: true },
          {
            teacherId: id,
            signedAt: null,
            expiredAt: { $lte: currentTime },
            keepFile: true,
          },
        ],
      },
      {
        fileLocation: 1,
        _id: 0,
      }
    );
    // console.log(deleteFileList.map((list) => list.fileLocation));
    const fileList = [].concat(
      ...deleteFileList.map((list) => list.fileLocation)
    );
    const newFileList = [].concat(
      ...fileList.map((item) => {
        if (item.split(".").pop() !== "pdf") {
          return [item, item + ".pdf"];
        } else return item;
      })
    );
    console.log(newFileList);
    newFileList.map((file) => delFile(file));
    // return deleteFileList;
    try {
      const updateFileList = await SignRequest.updateMany(
        {
          $or: [
            { teacherId: id, signedAt: { $ne: null }, keepFile: true },
            {
              teacherId: id,
              signedAt: null,
              expiredAt: { $lte: currentTime },
              keepFile: true,
            },
          ],
        },
        {
          keepFile: false,
        }
      );
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = { deleteFilePeriodically, deleteFileByTeacherId };
