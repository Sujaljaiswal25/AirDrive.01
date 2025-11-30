const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  googleAuth,
  googleCallback,
} = require("../controllers/auth.controller");
const passport = require("../config/passport");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      process.env.FRONTEND_URL + "/login?error=Authentication failed",
  }),
  googleCallback
);

module.exports = router;
