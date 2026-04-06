const db = require("../db/queries.js");

async function uploadGet(req, res) {
  const folders = await db.getUserFolders(req.user.id);
  const selectedFolderId = req.query.folderId; 
  res.render("upload-form", { title: "Upload File", folders, selectedFolderId });
}

async function uploadPost(req, res, next) {
  try {
    // Multer provides req.file
    const { originalname, size, path } = req.file;
    const { folderId } = req.body;
    const userId = req.user.id;

    // Call your dedicated query
    await db.createFile({
      name: originalname,
      size: size,
      url: path, // The local path like 'uploads/abc123'
      userId,
      folderId,
    });

    // Redirect back to the folder or the dashboard
    const redirectUrl = folderId ? `/folders/${folderId}` : "/";
    res.redirect(redirectUrl);
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

async function fileDownloadGet(req, res, next) {
  try {
    const file = await db.getFileById(req.params.id, req.user.id);
    if (!file) return res.status(404).send("File not found");

    // Construct the path to your local uploads folder
    const filePath = path.join(__dirname, '../', file.url); 
    
    // res.download sets the headers to prompt a 'Save As' dialog
    res.download(filePath, file.name, (err) => {
      if (err) next(err);
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadGet,
  uploadPost,
  fileDetailGet,
  fileDownloadGet
}