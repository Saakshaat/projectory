const { db, admin } = require("../../util/admin");
const config = require("../../util/config");

const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

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
  const avatarList = [
    "panda",
    "brown_bear",
    "ice_bear",
    "rigby",
    "mordecai",
    "jake",
    "shaggy",
    "scooby",
  ];
  const avatar = `${
    avatarList[Math.floor(Math.random() * avatarList.length)]
  }.jpg`;

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
    imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${avatar}?alt=media`,
  };

  const top = [];
  const others = [];
  req.body.experience.skills.top.forEach((skill) => {
    top.push(skill);
  });
  req.body.experience.skills.others.forEach((skill) => {
    others.push(skill);
  });

  const experience = {
    skills: {
      top,
      others,
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

      experience.docs[0].data().skills.others.forEach((skill) => {
        other.push(skill);
      });

      profile.information = {
        name: userObj.name,
        bio: userObj.bio,
        socials: userObj.socials,
        institution: userObj.institution,
        imageUrl: userObj.imageUrl,
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
        headline: experience.docs[0].data().headline,
        resume: experience.docs[0].data().resume,
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

exports.setProfileImage = (req, res) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageName;
  let fileToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const fileExtension = filename.split(".")[filename.split(".").length - 1];
    imageName = `${req.user.docId}.${fileExtension}`;
    const filepath = path.join(os.tmpdir(), imageName);
    fileToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(fileToBeUploaded.filepath, {
        resumable: false,
        destination: `images/${imageName}`,
        metadata: {
          metadata: {
            contentType: fileToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/images%2F${imageName}?alt=media`;
        return db.doc(`/users/${req.user.docId}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ general: "image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

exports.addResume = (req, res) => {
  const busboy = new BusBoy({ headers: req.headers });

  let fileName;
  let fileToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (
      mimetype !== "application/pdf" &&
      mimetype !== "application/octet-stream"
    ) {
      return res.status(400).json({ error: "Must be PDF or Word" });
    }
    const fileExtension = filename.split(".")[filename.split(".").length - 1];

    fileName = `${req.user.docId}.${fileExtension}`;
    const filepath = path.join(os.tmpdir(), fileName);
    fileToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(fileToBeUploaded.filepath, {
        resumable: false,
        destination: `resume/${fileName}`,
        metadata: {
          metadata: {
            contentType: fileToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        return db
          .collection("experience")
          .where("user", "==", req.user.docId)
          .get();
      })
      .then((doc) => {
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/resume%2F${fileName}?alt=media`;
        return db
          .doc(`/experience/${doc.docs[0].id}`)
          .update({ resume: fileUrl });
      })
      .then(() => {
        return res.json({ general: "resume uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

exports.edit = (req, res) => {
  let newUser = {
    name: req.body.information.name,
    institution: req.body.information.institution,
    bio: req.body.information.bio,
    socials: req.body.information.socials,
  };

  let newExperience = {
    skills: req.body.experience.skills,
    headline: req.body.experience.headline,
  };

  const userRef = db.doc(`/users/${req.user.docId}`);
  return db
    .collection("experience")
    .where("user", "==", req.user.docId)
    .limit(1)
    .get()
    .then((experience) => {
      const expRef = experience.docs[0].ref;
      return db
        .collection("open")
        .where("user", "==", req.user.docId)
        .get()
        .then((open) => {
          open.forEach((docOpen) => {
            docOpen.ref.update({ creator: newUser.name }).then();
          });
          return db
            .collection("closed")
            .where("user", "==", req.user.docId)
            .get()
            .then((closed) => {
              closed.forEach((docClosed) => {
                docClosed.ref.update({ creator: newUser.name }).then();
              });
              const batch = db.batch();
              batch.update(userRef, {
                name: newUser.name,
                institution: newUser.institution,
                bio: newUser.bio,
                socials: newUser.socials,
              });
              batch.update(expRef, {
                skills: newExperience.skills,
                headline: newExperience.headline,
              });

              return batch.commit().then(() => {
                return res
                  .status(200)
                  .json({ general: `Profile updated successfully` });
              });
            });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Error in updating profile` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Internal Server Error` });
    });
};

exports.showMultipleProfiles = (req, res) => {
  const { stringify,parse } = require('flatted/cjs');
  const users = [];
  req.body.users.forEach(function (part, index) {
    this[index] = db.doc(`/users/${this[index]}`);
  }, req.body.users);

  return db.getAll(...req.body.users).then((docs) => {
    docs.forEach((data) => {
      users.push(
        stringify(parse(stringify({
          informaton: data.data(),
          experience: db
            .collection("experience")
            .where("user", "==", data.id)
            .get()
            .then((exp) => {
              return exp.docs[0].exists
            })
          }
      ))));
    });
    return res.status(200).json(users);
  });
  // .catch((err) => {
  //   return res
  //     .status(500)
  //     .json({ error: `Internal Server Error: ${err.code}` });
  // });
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
