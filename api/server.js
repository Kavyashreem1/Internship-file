require("dotenv").config();
console.log("ENV CHECK:", {
  AWS_REGION: process.env.AWS_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? "LOADED" : "MISSING",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? "LOADED" : "MISSING",
});

const express = require("express");
const bodyParser = require("body-parser");

const generatePresignedUrl = require("./generate-presigned-url");

const app = express();

app.use(bodyParser.json()); // to parse JSON body

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.post("/generate-presigned-url", generatePresignedUrl);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
