const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");

// Default avatar URL for Google OAuth users
const DEFAULT_AVATAR =
  "https://i.pinimg.com/1200x/4e/7c/53/4e7c53e7d136ab654ec3b004eeec3e72.jpg";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Check if user exists with this email (from local registration)
        user = await userModel.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google account to existing local account
          user.googleId = profile.id;
          user.authProvider = "google";
          user.avatar =
            profile.photos?.[0]?.value || user.avatar || DEFAULT_AVATAR;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = await userModel.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: "google",
          avatar: profile.photos?.[0]?.value || DEFAULT_AVATAR,
        });

        return done(null, newUser);
      } catch (error) {
        console.error("Google OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
