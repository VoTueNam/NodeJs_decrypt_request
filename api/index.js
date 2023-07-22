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
const publicKey = fs.readFileSync("public.key", "utf8");
const privateKey = fs.readFileSync("private.key", "utf8");

// Middleware to encrypt request data
app.use(express.json());
function encrypt(req, res, next) {
  if (req.body) {
    const requestData = JSON.stringify(req.body);
    const encryptedData = crypto.publicEncrypt(
      publicKey,
      Buffer.from(requestData)
    );
    req.encryptedData = encryptedData.toString("base64");
  }
  return next();
}

// Middleware to decrypt request data
function decrypt(req, res, next) {
  if (req.body.encryptedData) {
    const encryptedData = Buffer.from(req.body.encryptedData, "base64");
    const decryptedData = crypto.privateDecrypt(privateKey, encryptedData);
    req.decryptedData = JSON.parse(decryptedData.toString());
  }
  return next();
}

// Route to handle the encrypted request
app.post("/encrypt", encrypt, (req, res) => {
  const requestData = req.encryptedData || req.body;
  // Process the decrypted request data here...
  res.json({ "Your encrypt data": requestData });
});

app.post("/decrypt", decrypt, (req, res) => {
  const requestData = req.decryptedData || req.body;
  // Process the decrypted request data here...
  res.json({ "Your plaintext data": requestData });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
