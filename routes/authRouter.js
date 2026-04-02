const { Router } = require("express");
const authRouter = Router();
const authController = require('../controllers/authController');

authRouter.get("/", authController.indexGet)
authRouter.get("/sign-up", authController.signUpGet);
authRouter.get("/login", authController.logInGet);
authRouter.get("/logout", authController.logOutGet);
authRouter.post("/sign-up", authController.validateUserSignUp, authController.signUpPost);
authRouter.post('/login', authController.validateUserLogin, authController.logInPost);

module.exports = authRouter;