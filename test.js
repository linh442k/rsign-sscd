// require("dotenv").config();
// const util = require("util");

// // console.log(process.env.TEMP_PUBLIC_KEY, typeof process.env.TEMP_PUBLIC_KEY);

// // console.log(process.env.TEMP_PRIVATE_KEY, typeof process.env.TEMP_PRIVATE_KEY);

// console.log(
//   util.isDeepStrictEqual(
//     { a: "1", b: { a: "1", b: { a: "1", b: "2" } } },
//     { b: { a: "1", b: { a: "1", b: "2" } }, a: "1" }
//   )
// );

// const a = Buffer.from(process.env.PK, "utf8");

// console.log(a);

const test = ["a", "b.pdf", "c.pdf", "d"];
const newTest = [].concat(
  ...test.map((item) => {
    if (item.split(".").pop() !== "pdf") {
      return [item, item + ".pdf"];
    } else return item;
  })
);
console.log(newTest);
