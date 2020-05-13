const { db } = require("../../util/admin");

/**
 * Used for creating a user object when they sign up/in for the first time
 * The user is redirected to this route right after signup or sign in.
 * Client gets the complete credentials object from the first response.
 * This route distributes the request object across different collections for sharding.
 */
exports.createProfile = (req, res) => {
  /**TODO: Validate request fields for if the data exists.
   *  Iterate through each field in the JSON obejct and pass to validateExists
   */

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

  db.collection('users')
    .where('uid', '==', `"${user.uid}"`)
    .limit(1)
    .get()
    .then((doc) => {
      if (doc.exists) return res.status(409).json(doc);
      else {
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
          .then(() => {
            return res.status(200).json({ user, experience, credentials });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ error: `Error in committing batch. ${err}` });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: `Error: ${err}. Contact support.` });
    });
};

exports.showProfile = (req, res) => {
  let profile = {
    information: {},
    projects: {
      projects_created: 0,
      projects_selected: 0,
    },
    credentials: [],
    experience: {
      skills: [],
    },
  };

  let open = 0;
  let closed = 0;
  let userObj = {};
  let credentialsObj = [];

  const userRef = req.body.userRef;

  db.doc(`/users/${userRef}`)
    .get()
    .then((user) => {
      if (!user.exists) {
        return res.status(404).json({ error: `User does not exist` });
      } else {
        userObj = user.data();
        return db.collection("credentials").where("user", "==", userRef).get();
      }
    })
    .then((credentials) => {
      credentialsObj = [];
      credentials.forEach((credential) => {
        credentialsObj.push({
          email: credential.data().email,
          provider: credential.data().provider,
          user: credential.data().user,
          createdAt: credential.data().createdAt,
        });
      });

      return db.collection("open").where("user", "==", userRef).get();
    })
    .then((openCreated) => {
      open = openCreated.size;

      return db
        .collection("open")
        .where("team", "array-contains", userRef)
        .get();
    })
    .then((openTeam) => {
      open += openTeam.size;

      return db.collection("closed").where("user", "==", userRef).get();
    })
    .then((closedCreated) => {
      closed = closedCreated.size;

      return db
        .collection("closed")
        .where("team", "array-contains", userRef)
        .get();
    })
    .then((closedTeam) => {
      closed += closedTeam.size;

      return db.collection("experience").where("user", "==", userRef).get();
    })
    .then((experience) => {
      let skills = [];

      experience.docs[0].data().skills.forEach((skill) => {
        skills.push(skill);
      });

      profile.information = {
        name: userObj.name,
        bio: userObj.bio,
        socials: userObj.socials,
        institution: userObj.institution,
      };

      profile.projects = {
        projects_created: userObj.projects_created,
        projects_selected: userObj.projects_selected,
        open: open,
        closed: closed,
      };

      profile.experience.skills = skills;
      profile.credentials = credentialsObj;

      return res.status(200).json(profile);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Internal Error. Try again. Error: ${err.code}` });
    });
};
