const db = require("../db/queries.js");
const { cloudinary } = require('../lib/cloudinary');

async function uploadGet(req, res) {
  const folders = await db.getUserFolders(req.user.id);
  const selectedFolderId = req.query.folderId; 
  res.render("upload-form", { title: "Upload File", folders, selectedFolderId });
}

async function uploadPost(req, res, next) {
  try {
    if (!req.file) return res.status(400).send("Cloud upload failed.");

    // DEBUG: Log this to see exactly what Cloudinary sent back
    console.log("Cloudinary Response:", req.file);

    await db.createFile({
      name: req.file.originalname,
      size: req.file.bytes || 0,
      url: req.file.secure_url || req.file.url, // Try both
      publicId: req.file.public_id,
      userId: req.user.id,
      folderId: req.body.folderId ? Number(req.body.folderId) : null
    });

    res.redirect("/");
  } catch (err) {
    next(err);
  }
}

async function fileDetailGet(req, res, next) {
  try {
    const file = await db.getFileById(req.params.id, req.user.id);
    if (!file) return res.status(404).send("File not found");

    res.render("file-detail", { title: "File Details", file });
  } catch (err) {
    next(err);
  }
}

async function updateFilePost(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") return res.redirect(`/files/${req.params.id}`);
    
    await db.updateFile(req.params.id, req.user.id, name);
    res.redirect(`/files/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function fileDeletePost(req, res, next) {
  try {
    const file = await db.getFileById(req.params.id, req.user.id);
    // Delete from Cloudinary first
    await cloudinary.uploader.destroy(file.publicId);
    // Then delete from your database
    await db.deleteFile(req.params.id, req.user.id);
    res.redirect("/");
  } catch (err) { next(err); }
}

module.exports = {
  uploadGet,
  uploadPost,
  fileDetailGet,
  updateFilePost,
  fileDeletePost
}