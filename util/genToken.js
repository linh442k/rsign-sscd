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
  id: "625e76cd43d3acdd7a9fcdee",
  teacherId: "UngTest1",
  teacherCertificate: {
    pk: "123",
    params: {
      roles: ["Signer"],
    },
  },
  fileHash: [
    "756145ae4fb5c408efd56fb1969d0b9cb7b63086efe01e7197b828d60a956543",
    "060859c01ae6ba3cb2e1ae0f09605ec2f63a836086eb186a7f7e51b532cbd9f2",
    "f85f0fcb3762061125eb740f76f3e2f62176e33e72c0570196a207785bc7c62b",
  ],
  fileOriginalName: [
    "Test-signed.pdf",
    "digitalsignatures4PDF20130304.pdf",
    "%10%EF%BF%BD-THI-TN-M%EF%BF%BDN-%10LCMVN-20202.pdf",
  ],
  docCount: 3,
  createdAt: "2022-04-19T08:26:20.593Z",
  expiredAt: "2022-04-19T13:26:20.593Z",
  params: {
    a: 12,
    b: "36",
  },
  salt: "e82efd9016b740515d1da80375c6b137e46d0631248fb70c3b6c4b95b7e5a963",
};
const token = jwt.sign(
  { exp: Math.floor(Date.now() / 1000) + 60 * 2, data },
  privateKey,
  { algorithm: "RS256" }
);

console.log(token);
