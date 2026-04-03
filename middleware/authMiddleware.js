async function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("Please log in to view this page.");
  }
}

module.exports = {
  isAuth
}
