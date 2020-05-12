const { admin, db } = require("../../util/admin");
const config = require("../../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();


//Email Login
exports.emailLogin = (req, res) => {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };
  
    const { valid, errors } = validateLogin(credentials);
    if (!valid) return res.status(400).json(errors);
    auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((data) => {
        return data.user.getIdToken();
      })
      .then((token) => {
        return res.json({ token });
      })
      .catch((err) => {
        /**
         * TODO: What if user exists in authentication but not in firestore?
         * If err message is 'user already exists', then
         * Scan credentials database for user's email and if it is not found, return credentials (with provider)
         * and take them to '/create' route on the client
         */
        return res
          .status(403)
          .json({ general: `Wrong credentials, please try again` });
      });
  };
  
  //Email Signup
  exports.emailSignup = (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    const { valid, errors } = validateSignup(newUser);
    if (!valid) return res.status(400).json(errors);
  
    var uid = "";
    //Signing up the user
    return auth
      .createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then((data) => {
        uid = data.user.uid;
        return data.user.getIdToken();
      })
      .then((idToken) => {
        /**This response is processed as the first_response in the client
         *The 'credentials' subfield is used for the collections subfield in the credentials collection
         *The client
         */
        const responseBody = {
          token: idToken,
          uid,
          credentials: {
            email: req.body.email,
            provider: "email",
            createdAt: new Date().toUTCString(),
          },
        };
        return res.status(200).json(responseBody);
      })
      .catch((err) => {
        /**
         * TODO: What if user exists in authentication but not in firestore?
         * If err message is 'user already exists', then
         * Scan credentials database for user's email and if it is not found, return credentials (with provider)
         * and take them to '/create' route on the client
         */
        res.status(500).json({ error: `Error with creating account. ${err}` });
      });
  };
  
  //Google Signin
  exports.googleSignin = (req, res) => {};
  
  //Signout method
  exports.signout = (req, res) => {
    return auth
      .signOut()
      .then(() => {
        return res.status(200).json({ general: `Successfully Signed Out` });
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: `Error during signing out: ${err}` });
      });
  };
  
  exports.passwordReset = (req, res) => {
    auth
      .sendPasswordResetEmail(req.body.email)
      .then((data) => {
        return res.status(200).json({ general: `Reset link sent to email` });
      })
      .catch((err) => {
        return res.status(400).json({
          general: `Couldn't send reset link. Try to remember password`,
        });
      });
  };