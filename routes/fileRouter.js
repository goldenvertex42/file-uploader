const { Router } = require("express");
const fileRouter = Router();
const multer = require('multer');
const { storage } = require('../lib/cloudinary');
const fileController = require("../controllers/fileController");
const { isAuth } = require("../middleware/authMiddleware");

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed extensions
    const allowedTypes = /jpeg|jpg|png|pdf|zip|docx/;
    const isMimeTypeValid = allowedTypes.test(file.mimetype);
    
    if (isMimeTypeValid) {
      return cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, .pdf, .zip, and .docx files are allowed!"));
    }
  }
 });

fileRouter.get("/upload", isAuth, fileController.uploadGet);

fileRouter.post("/upload", isAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file too large)
      return res.render('upload-form', { 
        title: 'Upload File', 
        errors: [{ msg: err.message }], 
        folders: [] // Pass folders so the template doesn't crash
      });
    } else if (err) {
      // An unknown error occurred (e.g., wrong file type)
      return res.render('upload-form', { 
        title: 'Upload File', 
        errors: [{ msg: err.message }], 
        folders: [] 
      });
    }
    // Everything went fine, proceed to controller
    next();
  });
}, fileController.uploadPost);

fileRouter.get("/:id", isAuth, fileController.fileDetailGet);
fileRouter.post("/:id/delete", isAuth, fileController.fileDeletePost);

module.exports = fileRouter;