const { Router } = require("express");
const fileRouter = Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary local storage before cloud upload
const fileController = require("../controllers/fileController");
const { isAuth } = require("../middleware/authMiddleware");

fileRouter.get("/upload", isAuth, fileController.uploadGet);
fileRouter.post("/upload", isAuth, upload.single('file'), fileController.uploadPost);
fileRouter.get("/:id", isAuth, fileController.fileDetailGet);
fileRouter.get("/:id/download", isAuth, fileController.fileDownloadGet);

module.exports = fileRouter;