require('dotenv').config();
const cloudinary = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'odin-uploads',             // Moved out of 'params'
  allowedFormats: ['jpg', 'png', 'pdf', 'zip', 'docx'],
});

const getFolderZipUrl = (files, folderName) => {
  if (!files || files.length === 0) return null;
  
  const fullyQualifiedIds = files.map(file => {
    const mimetype = (file.mimetype || '').toLowerCase();
    const extension = (file.name || '').split('.').pop().toLowerCase();
    
    let resourceType = 'raw'; // Default for docs like .docx, .txt, .zip

    // Cloudinary treats standard images AND PDFs as 'image' resource types
    if (
      mimetype.startsWith('image/') || 
      mimetype === 'application/pdf' || 
      ['png', 'jpg', 'jpeg', 'pdf'].includes(extension)
    ) {
      resourceType = 'image';
    } else if (mimetype.startsWith('video/')) {
      resourceType = 'video';
    }

    return `${resourceType}/upload/${file.publicId}`;
  });

  return cloudinary.utils.download_zip_url({
    fully_qualified_public_ids: fullyQualifiedIds,
    resource_type: 'auto', // Allows mixing images, pdfs, etc.
    target_filename: `${folderName.replace(/\s+/g, '_')}_archive`
  });
};

module.exports = { 
  cloudinary, 
  storage,
  getFolderZipUrl
};
