const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const { getFolderZipUrl } = require('../lib/cloudinary');
const { buildShareUrl } = require('../utils');

const validateFolder = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Folder name must be between 1 and 255 characters.")
    .escape(),
];

async function createFolderPost(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // If it's empty, just send them back to the dashboard. 
    // You could also pass an error message via session/flash here.
    return res.redirect("/");
  }
  
  try {
    const { name } = req.body;
    const userId = req.user.id;
    console.log("Folder name:", name, "UserID:", userId);
    await db.createFolder(name, userId);

    // Redirect back to the dashboard so the new folder "appears" in the list
    res.redirect("/");
  } catch (err) {
    next(err);
  }
}

async function folderDetailGet(req, res, next) {
  try {
    const folder = await db.getFolderById(req.params.id, req.user.id);

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    const zipDownloadUrl = getFolderZipUrl(folder.files, folder.name);
    console.log(zipDownloadUrl)
    const shareUrl = buildShareUrl(req, folder.id);

    res.render("folder-detail", { 
      title: folder.name, 
      folder: folder,
      files: folder.files,
      zipDownloadUrl,
      shareUrl 
    });
  } catch (err) {
    next(err);
  }
}

async function sharedFolderGet(req, res, next) {
  try {
    const folder = await db.getSharedFolder(req.params.id);

    // 1. Check if folder exists and sharing is actually enabled
    if (!folder || !folder.isShared) {
      return res.status(404).send("This folder is no longer being shared.");
    }

    // 2. Check if the link has expired (if an expiration was set)
    if (folder.shareExpires && new Date() > folder.shareExpires) {
      return res.status(410).send("This share link has expired.");
    }

    const zipDownloadUrl = getFolderZipUrl(folder.files, folder.name);

    // 3. Render the public view
    res.render("shared-folder", { 
      title: folder.name, 
      folder: folder, 
      files: folder.files,
      zipDownloadUrl 
    });
  } catch (err) { 
    next(err); 
  }
}


async function shareFolderPost(req, res, next) {
  try {
    const { expiresIn } = req.body;

    let expiresAt = null;

    if (expiresIn && expiresIn !== "0") {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    }

    await db.toggleFolderShare(req.params.id, req.user.id, expiresAt);
    res.redirect(`/folders/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function revokeShareFolderPost(req, res, next) {
  try {
    await db.revokeFolderShare(req.params.id, req.user.id);
    res.redirect(`/folders/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function updateFolderPost(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") return res.redirect(`/folders/${req.params.id}`);
    
    await db.updateFolder(req.params.id, req.user.id, name);
    res.redirect(`/folders/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function folderDeletePost(req, res, next) {
  try {
    await db.deleteFolder(req.params.id, req.user.id);
    res.redirect("/"); // Send them back to the dashboard after deletion
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  validateFolder, 
  createFolderPost,
  folderDetailGet,
  sharedFolderGet,
  shareFolderPost,
  revokeShareFolderPost,
  updateFolderPost,
  folderDeletePost
 };
