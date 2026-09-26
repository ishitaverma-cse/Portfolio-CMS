const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio-cms",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error.message);

          return res.status(500).json({
            message: "File upload failed",
          });
        }

        return res.status(200).json({
          message: "File uploaded successfully",
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Upload controller error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  uploadFile,
};