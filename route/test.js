const express = require("express");
const router = express.Router();
const path = require("path");
const { PDFNet } = require("@pdftron/pdfnet-node");
const fs = require("fs");

router.get("/", (req, res) => {
  res.send("Hello tets");
});

router.get("/ms-office-converter", (req, res) => {
  const fileName =
    "document\\360eb0a14932d296833565dd3fe9cb8ee769bb8024eae6f4afa5266290b2f0b5.docx";
  const filePath = path.join(__dirname, `..\\` + fileName);
  const outputPath = path.resolve(__dirname, `../${fileName}.pdf`);

  const convertToPdf = async () => {
    const pdfdoc = await PDFNet.PDFDoc.create();
    await pdfdoc.initSecurityHandler();
    await PDFNet.Convert.toPdf(pdfdoc, filePath);
    pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  };
  PDFNet.runWithCleanup(convertToPdf, process.env.PDFTRON_DEMO_KEY)
    .then(() => {
      PDFNet.shutdown();
      fs.readFile(outputPath, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).end();
        } else {
          res.setHeader("ContentType", "application/pdf");
          res.end(data);
        }
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).end();
    });

  //   console.log(outputPath);
  //   res.send(filePath);
});
module.exports = router;
