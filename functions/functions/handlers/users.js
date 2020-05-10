const { admin, db } = require("../util/admin");
const config = require("../util/config");
const { validateEmail, validatePassword } = require("../util/validators");

const firebase = require("firebase");
firebase.initializeApp(config);

const auth = firebase.auth();
var currentUser = auth.currentUser;
const googleProvider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged((user) => {
  if (user && user.uid !== currentUser) {
    currentUser = user.uid;
    console.log(currentUser.email);
  } else {
    console.log("User does not exist");
  }
});

//Email Login
exports.emailLogin = (req, res) => {
  const credentials = {
    email: req.body.email,
    password: req.body.password,
  };
  auth
    .signInWithEmailAndPassword(credentials.email, credentials.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      return res
        .status(403)
        .json({ general: `Wrong credentials, please try again` });
    });
};

//Email Signup
exports.emailSignup = (req, res) => {
  //TODO: Validating signup credentials

  //Signing up the user
  return auth
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((idToken) => {
      /**This response is processed as the first_response in the client
         *The 'credentials' subfield is used for the collections subfield in the credentials collection 
         The client 
         */
      const responseBody = {
        token: idToken,
        credentials: {
          email: req.body.email,
          provider: "email",
          createdAt: new Date().toUTCString(),
        },
      };
      return res.status(200).json(responseBody);
    })
    .catch((err) => {
      res.status(500).json({ error: `Error with creating account. ${err}` });
    });
};

/**
 * Used for creating a user object when they sign up/in for the first time
 * The user is redirected to this route right after signup or sign in.
 * Client gets the complete credentials object from the first response
 */
exports.createUser = (req, res) => {
  //creating objects for distributing across collections
  const user = {
    name: req.body.information.name,
    institution: req.body.information.institution,
    socials: {
      github: req.body.information.socials.github,
      linkedin: req.body.information.socials.linkedin,
    },
    bio: req.body.information.bio,
  };

  const skills = [];
  req.body.experience.skills.forEach((skill) => {
    skills.push(skill);
  });

  const experience = {
    skills,
  };

  const credentials = req.body.credentials;

  const batch = db.batch();
  let userId = db.collection("users").doc();

  //Creating new user object
  batch.set(userId, user);

  userId = userId.path.split("/").pop();
  //Linking user's ID to credentials and experience

  credentials.user = userId;
  experience.user = userId;

  //Creating new credentials
  batch.set(db.collection("credentials").doc(), credentials);

  //Creating new experience
  batch.set(db.collection("experience").doc(), experience);

  return batch
    .commit()
    .then(function () {
      return res.status(200).json({ user, experience, credentials });
    })
    .catch((err) => {
      res.status(500).json({ error: `Error in committing batch. ${err}` });
    });
};

//Google Signin
exports.googleSignin = (req, res) => {};

//Signout method
exports.signout = (req, res) => {
  if (!currentUser) {
    return res.status(400).json({ general: "You're not signed in" });
  } else auth.signOut();
};

exports.passwordReset = (req, res) => {
  auth.sendPasswordResetEmail(req.body.email)
    .then(data => {
      console.log("Password reset link sent");
    })
    .catch(err => {
      return res
        .status(400)
        .json({
          general: `Couldn't send reset link. Try to remember password`
        });
    });
};

exports.authenticated = currentUser;
