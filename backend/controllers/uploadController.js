const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if credentials exist in .env
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Check if Cloudinary is configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'joya_boutique' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      return res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    } else {
      // Fallback: Convert buffer to data URI if Cloudinary keys aren't set yet
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      return res.json({
        success: true,
        url: dataURI,
        message: 'Cloudinary keys pending. Temporary Data URI returned.',
      });
    }
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
};
