const { generateKeyPairSync } = require("crypto");
const fs = require("fs");
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});
const genKeyResult = { privateKey, publicKey };
// const genKeyResult = async () => {
//   var res = { a: 1 };
//   await generateKeyPair(
//     "rsa",
//     {
//       modulusLength: 2048,
//       publicKeyEncoding: {
//         type: "spki",
//         format: "pem",
//       },
//       privateKeyEncoding: {
//         type: "pkcs8",
//         format: "pem",
//       },
//     },
//     (err, publicKey, privateKey) => {
//       if (!err)
//         // Handle errors and use the generated key pair.
//         // try {
//         //   // const pk = fs.writeFileSync("key.txt", publicKey);
//         //   // const prvk = fs.appendFileSync("key.txt", privateKey);
//         //   console.log(publicKey);
//         // console.log(privateKey);
//         //   //file written successfully
//         // } catch (err) {
//         //   console.error(err);
//         // }
//         // console.log(publicKey);
//         // console.log(privateKey);
//         res = {
//           success: true,
//           publicKey: publicKey,
//           privateKey: privateKey,
//         };
//       else
//         res = {
//           success: false,
//           message: err.message,
//         };
//     }
//   );
//   return res;
// };

module.exports = {
  genKeyResult,
};
// console.log({ privateKey, publicKey });
