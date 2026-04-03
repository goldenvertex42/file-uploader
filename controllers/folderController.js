const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

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

module.exports = { validateFolder, createFolderPost };
