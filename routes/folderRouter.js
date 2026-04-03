const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../controllers/folderController");
const { isAuth } = require("../middleware/authMiddleware");

folderRouter.post("/new", isAuth, folderController.validateFolder, folderController.createFolderPost);

module.exports = folderRouter;
