const db = require("../db/queries.js");

async function uploadGet(req, res) {
  const folders = await db.getUserFolders(req.user.id);
  res.render("upload-form", { title: "Upload File", folders });
}

async function uploadPost(req, res) {
  try {
    // req.file contains information about the uploaded file
    // req.body contains the folderId from the select menu
    console.log("File metadata:", req.file);
    console.log("Target folder:", req.body.folderId);

    // TODO: Send req.file.path to Cloudinary/Supabase
    // TODO: Save file URL and metadata to Prisma database

    res.redirect("/");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadGet,
  uploadPost
}