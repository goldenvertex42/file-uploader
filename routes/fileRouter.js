const { Router } = require("express");
const fileRouter = Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary local storage before cloud upload
const fileController = require("../controllers/fileController");
const { isAuth } = require("../middleware/authMiddleware");

// GET the form
fileRouter.get("/upload", isAuth, fileController.uploadGet);

// POST the file
fileRouter.post("/upload", isAuth, upload.single('file'), fileController.uploadPost);

module.exports = fileRouter;