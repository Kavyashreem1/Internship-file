// api/generate-presigned-url.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: process.env.AWS_REGION });

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).send('Method Not Allowed');
    }

    const { filename, fileType } = req.body;
    if (!filename || !fileType) return res.status(400).json({ error: 'Missing filename or fileType' });

    const Key = `${Date.now()}_${filename}`; // unique key
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key,
      ContentType: fileType
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;

    // optional: log metadata (key, fileType, timestamp)
    console.log('Generated presigned URL for:', Key, fileType, new Date().toISOString());

    res.status(200).json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating presigned URL' });
  }
};
