const {
  validateSignup,
  validateLogin,
  validateExists,
} = require("../../util/validators");
const { showProfile, createProfile } = require("./profile");
const {
  emailLogin,
  emailSignup,
  signout,
  googleSignin,
  passwordReset,
} = require("./access");

exports.emailLogin = (req, res) => {
  return emailLogin(req, res);
};

exports.emailSignup = (req, res) => {
  return emailSignup(req, res);
};

exports.signout = (req, res) => {
  return signout(req, res);
};

exports.googleSignin = (req, res) => {
  return googleSignin(req, res);
};

exports.passwordReset = (req, res) => {
  return passwordReset(req, res);
};

exports.createUser = (req, res) => {
  return createProfile(req, res);
};

exports.getOwnEntireProfile = (req, res) => {
  req.body.userRef = req.user.docId;
  return showProfile(req, res);
};

exports.getUserProfile = (req, res) => {
  req.body.userRef = req.params.userId;
  return showProfile(req, res);
};
