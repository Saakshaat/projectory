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
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
    auth()
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
  });
};

//Email Signup
exports.emailSignup = (req, res) => {
  //creating objects for distributing across collections
  const user = {
    name: req.body.information.name,
    institution: req.body.information.institution,
    socials: {
      github: req.body.information.socials.github,
      linkedin: req.body.information.socials.linkedin,
    },
  };

  const credentials = {
    email: req.body.credentials.email,
    auth: "email",
    createdAt: new Date().toUTCString(),
  };

  const skills = [];
  req.body.experience.skills.forEach((skill) => {
    skills.push(skill);
  });

  const experience = {
    skills,
  };

  //checking if the same credentials exist in credentials collection
  db.collection("credentials")
    .where("provider", "==", "email")
    .where("email", "==", req.body.credentials.email)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ errorl: `Account already exists` });
      }
    });

  //TODO: Validating signup credentials

  //Signing up the user
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
    return auth
      .createUserWithEmailAndPassword(
        credentials.email,
        req.body.credentials.password
      )
      .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then((idToken) => {
        const token = idToken;
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
            return res.status(200).json({ token });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ error: `Error in committing batch. ${err}` });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: `Error with creating account. ${err}` });
      });
  });
  // .catch((err) => {
  //   res.status(400).json({ error: `Error persisting session` });
  // });
};

//Google Signin
exports.googleSignin = (req, res) => {};

//Signout method
exports.signout = (req, res) => {
  if (!currentUser) {
    return res.status(400).json({ general: "You're not signed in" });
  } else auth.signOut();
};

exports.passwordReset = (req, res) => {};

exports.authenticated = currentUser;
