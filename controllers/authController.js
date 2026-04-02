const db = require("../db/queries.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const { body, validationResult } = require("express-validator");

const validateUserSignUp = [
  body("name").trim().notEmpty().withMessage("Name is required.")
    .isLength({ max: 255 }).withMessage("Name must be under 255 characters."),
  body("email").notEmpty().withMessage("Email is required.").isEmail().withMessage("Invalid email format."),
  body('password')
    .isLength({ min: 8 }).withMessage('At least 8 characters')
    .matches(/[A-Z]/).withMessage('At least one uppercase letter')
    .matches(/[a-z]/).withMessage('At least one lowercase letter')
    .matches(/[0-9]/).withMessage('At least one number')
    .matches(/[\W_]/).withMessage('At least one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

const validateUserLogin = [
  body('email').trim().isEmail().withMessage('Enter a valid email address'),
  body('password').notEmpty().withMessage('Password cannot be blank')
];

async function indexGet(req, res) {
  res.render("index", { 
    title: "File Uploader - Dashboard",
    folders: [], 
    files: [] 
  });
}

async function signUpGet(req, res) {
  res.render("sign-up-form", { title: "Sign Up" });
}

async function signUpPost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("sign-up-form", { 
      title: "Sign Up", 
      errors: errors.array(), 
      formData: req.body 
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser(req.body.email, req.body.name, hashedPassword);
    res.redirect("/");
  } catch (err) {
    if (err.code === 'P2002') {
        return res.render("sign-up-form", {
            title: "Sign Up",
            errors: [{ msg: "Email already in use" }],
            formData: req.body
        });
    }
    next(err);
  }
}

async function logInGet(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("login-form", { title: "Log In", user: req.user });
}

async function logInPost(req, res, next) {
  const errors = validationResult(req);
  
  // If form fields are invalid, stop here and show errors
  if (!errors.isEmpty()) {
    return res.render("login-form", { 
      title: "Log In",
      errors: errors.array(),
      email: req.body.email // Send email back so they don't have to re-type it
    });
  }

  // 2. Passport Logic (Runs only if form is valid)
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("login-form", { 
        title: "Log In",
        error: info.message || "Invalid email or password" 
      });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
}

async function logOutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}


module.exports = {
  validateUserSignUp,
  validateUserLogin,
  indexGet,
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
  logOutGet
}