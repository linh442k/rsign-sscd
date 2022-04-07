const { generateKeyPair } = require("crypto");
const fs = require("fs");
generateKeyPair(
  "rsa",
  {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  },
  (err, publicKey, privateKey) => {
    // Handle errors and use the generated key pair.
    try {
      // const pk = fs.writeFileSync("key.txt", publicKey);
      // const prvk = fs.appendFileSync("key.txt", privateKey);
      console.log(publicKey);
      console.log(privateKey);
      //file written successfully
    } catch (e) {
      console.error(e);
    }
    // console.log(publicKey);
    // console.log(privateKey);
  }
);
