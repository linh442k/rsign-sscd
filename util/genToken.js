const jwt = require("jsonwebtoken");
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIkYtemahcGyl/
yUA0ZXs6zsfGnsOmNbAxK2G08pkJZLqV+OFjbbCxYS+EusCzcet6AKLvmVaqv9tJ
c6CA9v+gbCaR+NmC3QxY5Imh0rhZuiBPC3XS1Iv6ZIc935U09TzccZLCyCESPlH2
CIByMrpo7UCtQfZ0VzY92jZx34ywFyIFkKPi5ua2Jml3YVpPt42wWkVpQH8/Qhlg
xOsBRtvcP0pkW/RIKGQn7+d5Snmix+WQn9y1RiNXG0xT8dUOaikluDpFYqLjYmWQ
W9RYcJkavaa32RfKlASEKH3qK90Gz/reCuGihuDVVgaWUXGnz6VYNlHfrSDDtEiW
9Wu57uEdAgMBAAECggEBAKQmYj9BWQZRAKziBBcd+zYNKHnJVG0CwbnsPGJArrl+
ZCr771NV4ee6l4503eO/V66ZOMEJ6WGD9i/uXy1NebdM7GBJn5M34LQcDvyPHmvp
JiorQfoUFKAQiJM+Grql/3KXzTp3WoG42ZGYMa/FDsVzb5ydQNzEx9LldevKvzUZ
tsdlLzKJRR47dRhcR5/cL/+cEV3nRTw6WfuaCddToQkLf5TwMIqbwpLIqDfyo8jq
1DFpdWznADGZEQ56iGZt1Aw9tKheCym8JLrj05yafC30H5viVd/4CTfw+ZMNPeRM
H73hSK4yp4MdCJ8dUbho20j3+jY7KXo5OjvKLfZsYU0CgYEA4/bTVqRead5UbjOQ
7yjmSbbg0kDdbATwplKP4C50m1gVuA+jzPuC/6S/xN+aXrwQS/2m9otz+oY34Slo
LT1hB8fhhHg/zqwLAdFLKS0iH1Voo+PLZy54CowYxQr2aIH2cpg4RUMTg7QPBcUZ
tPtCjnXbpgMAgSvSGfpihdOrK5sCgYEA4TwzZwdFarQz4ohyEI2exkTRYmyj4AXG
ru5JVFZsx7BhS847VkspB/IZC1IFFOxJ9nsTjlshuNLUZAEbVkhWCsk20PVVjons
kRtr3/p5rij31oqP0TxBz0peK61kFMYEjyQM0Ulv0G7Y8+HXfS/s1qcAuzrBI25i
ndoM9GV8vacCgYBUmu+2sUxFGHnXaJX63QATDaeFAQPsqiyyXeP9/N/UI63z4QIW
+qWUwY1WwPInBL87pMlJqVoC+btVequqVqRjYeCl7Icp6hovs4CkqJaIcIdkhA+i
nNF6gKJUxwvKn6lawHnp4sokUDhfGNbAn5wFCWLayzRtvFi+wXm9V2CozwKBgFct
S9/2yoFwWhy2HyAVEH1BKaHk1tDgq3QNusgv406vEBmdKw5NbQYsSFE/X8QnaMFE
Bd+1minFQHusif4tZVArbVIXgxP2gl/vsyMv+WTVaofZfazIm9g1uplBNVltA1q7
41ImEGcmYEaVBSjpIcw7O2c8aIDkOrtKKHV3yn5FAoGATfkpRBjFHidKCbhqoowf
kwZnyu+6a8YMQiOd8OwH6Wl3DZt8dV9wPcRSkM+VyKJ9sE/gUaB09i6TodZkx0Ka
eLtFHVjIyFF1L2Arjf1dFLB9PgQjQw8VaPZXlfeY/DnCYex63d1KM+/i/Md2RoSM
jpM+tWkcujE4shCHnhMVxh4=
-----END PRIVATE KEY-----`;
// console.log(privateKey);
const data = {
  id: "624c6dbb4eaf701c2e6838d5",
  teacherId: "123",
  teacherCertificate: {
    pk: "123",
  },
  fileHash: [
    "29e5dee2f10305de8834fde9466a9232e2603c942c8910258108e1ff31cd097a",
    "686b08c77ae43611e7fad7ffdd20338a739abf6ee298a8727e7866c51505cabd",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  ],
  fileOriginalName: [
    "B%EF%BF%BDn%20sao%20c%EF%BF%BDa%20KHMT-Project%202.%20Vi%20Minh%20Hi%EF%BF%BDu.%202020.docx.pdf",
    "B%EF%BF%BDn%20sao%20c%EF%BF%BDa%20KHMT-Project%203.%20Nguy%EF%BF%BDn%20Lan%20Anh.%2020202.docx.pdf",
    "t%EF%BF%BDi%20li%EF%BF%BDu%201.docx",
  ],
  docCount: 3,
  createdAt: "2022-04-05T16:26:33.317Z",
  expiredAt: "2022-04-05T17:26:33.317Z",
  params: null,
  salt: "5a6fcdaa4c45a80bc40dbb39a0e11e3e19e6e8599cd3121557486b6ca4fc6488",
};
const token = jwt.sign(
  { exp: Math.floor(Date.now() / 1000) + 60 * 2, data },
  privateKey,
  { algorithm: "RS256" }
);

console.log(token);
