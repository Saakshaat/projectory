const { admin, db } = require("../util/admin");
const config = require("../util/config");
const { validateSignup, validateLogin } = require("../util/validators");

const firebase = require("firebase");
firebase.initializeApp(config);

const auth = firebase.auth();
let currentUser = auth.currentUser;
const googleProvider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
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

/**
 * Used for creating a user object when they sign up/in for the first time
 * The user is redirected to this route right after signup or sign in.
 * Client gets the complete credentials object from the first response.
 * This route distributes the request object across different collections for sharding.
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
    uid: req.body.uid,
    projects_created: 0,
    projects_selected: 0,
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

exports.getOwnEntireProfile = (req, res) => {
  let profile = {}

  //populating user's information
  db.doc(`/users/$req.user.docId}`)
    .get()
    .then((user) => {
      if (!user.exists) {
        return res.status(403).json({ error: `User not found` });
      } else {
        profile.information = {
          name: user.data().name,
          bio: user.data().bio,
          socials: user.data().socials,
          institution: user.data().institution,
        };

        profile.projects = {
          projects_created: user.data().projects_created,
          projects_selected: user.data().projects_selected,
        };
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: `Error in accessing user` });
    });

  // populating the user's experience
  db.collection("experience")
    .where("user", "==", req.user.docId)
    .limit(1)
    .get()
    .then((experience) => {
      experience.skills.forEach((skill) => {
        profile.experience.skills.push(skill);
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error in accessing user's experience` });
    });

  var open = 0,
    closed = 0;

  //populating the user's projects (open and closed)
  db.collection("open")
    .where("user", "==", req.user.docId)
    .get()
    .then((projects) => {
      projects.forEach((project) => {
        open += 1;
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error in accessing open projects` });
    });

  db.collection("open")
    .where("team", "array-contains", req.user.docId)
    .get()
    .then((projects) => {
      projects.forEach((project) => {
        open += 1;
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error in accessing open projects` });
    });

  db.collection("closed")
    .where("user", "==", req.user.docId)
    .get()
    .then((projects) => {
      projects.forEach((projects) => {
        closed += 1;
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error in accessing closed projects` });
    });

  db.collection("closed")
    .where("team", "array-contains", req.user.docId)
    .get()
    .then((projects) => {
      projects.forEach((project) => {
        closed += 1;
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error in accessing closed projects` });
    });

  profile.projects = {
    open: open,
    closed: closed,
  };

  //populating the user's credentials
  profile.credentials = [];
  db.collection("credentials")
    .where("user", "==", req.user.docId)
    .get()
    .then((credentials) => {
      credentials.forEach((credential) => {
        profile.credentials.push(credential);
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error in accessing user's credentials` });
    });

  return res.status(200).json(profile);
};

exports.currentUser = currentUser;
