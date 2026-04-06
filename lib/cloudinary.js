require('dotenv').config();
const cloudinary = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');
console.log(cloudinary.config())
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'odin-uploads',             // Moved out of 'params'
  allowedFormats: ['jpg', 'png', 'pdf', 'zip', 'docx'],
});
module.exports = { cloudinary, storage };
