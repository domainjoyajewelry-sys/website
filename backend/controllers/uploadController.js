const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables or active keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'hqh00rk0',
  api_key: process.env.CLOUDINARY_API_KEY || '452875985878436',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'zK8MboIz9gktnwuX8S1XPVzjLk8',
  secure: true,
});

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

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
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
};
