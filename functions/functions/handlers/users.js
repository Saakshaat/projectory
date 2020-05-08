const { admin, db } = require("../util/admin");
const config = require("../util/config");

const firebase = require('firebase');
firebase.initializeApp(config);

const googleProvider = new firebase.auth.GoogleAuthProvider();

//Email Login 
exports.emailLogin = (req, res) => {

}

//Email Signup
exports.emailSignup = (req, res) => {

}

//Google Signin
exports.googleSignin = (req, res) => {

}
