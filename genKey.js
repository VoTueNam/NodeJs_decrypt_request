const fs = require("fs");
const crypto = require("crypto");

const generateRSAKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
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

  fs.writeFileSync("private.key", privateKey);
  fs.writeFileSync("public.key", publicKey);
};

generateRSAKeys();
