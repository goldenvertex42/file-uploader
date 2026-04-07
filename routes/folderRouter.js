const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../controllers/folderController");
const { isAuth } = require("../middleware/authMiddleware");

folderRouter.post("/new", isAuth, folderController.validateFolder, folderController.createFolderPost);
folderRouter.get("/share/:id", folderController.sharedFolderGet);
folderRouter.get("/:id", isAuth, folderController.folderDetailGet);
folderRouter.post("/:id/share", isAuth, folderController.shareFolderPost);
folderRouter.post("/:id/revoke", isAuth, folderController.revokeShareFolderPost);
folderRouter.post("/:id/update", isAuth, folderController.updateFolderPost);
folderRouter.post("/:id/delete", isAuth, folderController.folderDeletePost);


module.exports = folderRouter;
