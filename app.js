require('dotenv').config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require("./lib/prisma.js");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db/queries');
const authRouter = require("./routes/authRouter.js");
const fileRouter = require("./routes/fileRouter.js");
const folderRouter = require("./routes/folderRouter.js");
const { formatSize } = require("./utils.js");



const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  // prune expired sessions every 2 minutes
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined
      }
    )
  })
);

app.use(passport.session());
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await db.getUserByEmail(email);

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.formatSize = formatSize; // Now available in all .ejs files!
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
// ROUTES GO HERE
app.use('/', authRouter);
app.use('/files', fileRouter);
app.use('/folders', folderRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', (error) => {
  if (error) {
    throw error;
  }
  
  console.log(`Server running on port ${PORT}`);
});
