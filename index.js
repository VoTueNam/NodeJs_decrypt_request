// app.js
const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const app = express();
const port = 3000;

// GET endpoint to fetch all users
app.get("/api", (req, res) => {
  res.json({
    result: "API còn sống nhé anh em!",
  });
});
// Load the RSA keys
const publicKey = fs.readFileSync("./public.key", "utf8");
const privateKey = fs.readFileSync("./private.key", "utf8");

// Middleware to encrypt request data
app.use(express.json());
function encrypt(req, res, next) {
  plaintext = req.body.plaintext;
  const buffer = Buffer.from(plaintext, "utf8");
  const encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    buffer
  );
  req.body.plaintext = encrypted.toString("base64");

  return next();
}

// Route to handle the encrypted request
app.post("/encrypt", encrypt, (req, res) => {
  const requestData = req.body.plaintext;
  // Process the decrypted request data here...
  res.json({ "Your encrypt data": requestData });
});

// Middleware to decrypt request data
function decrypt(req, res, next) {
  ciphertext = req.body.ciphertext;
  const buffer = Buffer.from(ciphertext, "base64");
  const decrypted = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    buffer
  );
  req.body.ciphertext = decrypted.toString("utf8");
  return next();
}

app.post("/decrypt", decrypt, (req, res) => {
  const requestData = req.body.ciphertext;
  // Process the decrypted request data here...
  res.json({ "Your plaintext data": requestData });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
