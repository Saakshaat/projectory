const { db } = require("../../util/admin");

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
