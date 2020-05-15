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
      website: req.body.information.socials.website,
      email: req.body.credentials.email,
    },
    bio: req.body.information.bio,
    uid: req.body.uid,
    projects_created: 0,
    projects_selected: 0,
  };

  const topSkills = [];
  const otherSkills = [];
  req.body.experience.skills.top.forEach((skill) => {
    topSkills.push(skill);
  });
  req.body.experience.skills.other.forEach((skill) => {
    otherSkills.push(skill);
  });

  const experience = {
    skills: {
      topSkills,
      otherSkills,
    },
    headline: req.body.experience.headline,
  };

  const credentials = req.body.credentials;

  return db
    .collection("users")
    .where("uid", "==", req.body.uid)
    .get()
    .then((doc) => {
      if (doc.size > 0)
        return res.status(409).json({ error: `Profile already exists.` });
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
  let profile = {};

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
      let top = [];
      let other = [];

      experience.docs[0].data().skills.top.forEach((skill) => {
        top.push(skill);
      });

      experience.docs[0].data().skills.other.forEach((skill) => {
        other.push(skill);
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

      profile.experience = {
        skills: {
          top,
          other,
        },
        headline: experience.docs[0].headline,
      };
      profile.credentials = credentialsObj;

      return res.status(200).json(profile);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Internal Error. Try again. Error: ${err.code}` });
    });
};

exports.showMultipleProfiles = (req, res) => {
  const users = [];
  req.body.users.forEach(function (part, index) {
    this[index] = db.doc(`/users/${this[index]}`);
  }, req.body.users);

  return db
    .getAll(...req.body.users)
    .then((docs) => {
      docs.forEach((data) => {
        const user = {
          name: data.data().name,
          bio: data.data().bio,
          socials: data.data().socials,
          projects_created: data.data().projects_created,
          projects_selected: data.data().projects_selected,
          institution: data.data().institution,
        };

        const experience = getExperience(data.id).then(exp => {
          return {
            skills: exp.skills,
            headline: exp.headline
          }
        });

        users.push({
          user,
          experience: experience,
        });
      });

      return res.status(200).json(users);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Internal Server Error: ${err.code}` });
    });
};


function getExperience(docRef) {
  return db
    .collection("experience")
    .where("user", "==", docRef)
    .limit(1)
    .get()
    .then((exp) => {
      return exp.docs[0].data();
    });
}
