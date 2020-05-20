const { db, admin } = require("../../util/admin");
const { reopenTellInterested } = require("../applications/emails");

exports.getOneC = (req, res) => {
  let projectData = {};
  return db
    .doc(`/closed/${req.params.projectId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: `Project not found` });
      }
      projectData = doc.data();
      projectData.projectId = doc.id;
      return res.status(200).json(projectData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getMyClosed = (req, res) => {
  let response = [];

  if (req.params.position === "created") {
    return db
      .collection("closed")
      .where("user", "==", req.user.docId)
      .get()
      .then((projects) => {
        projects.forEach((project) => {
          const id = project.id;
          const data = project.data();
          response.push({
            id: id,
            creator: data.creator,
            createdAt: data.createdAt,
            description: data.description,
            github: data.github,
            links: data.links,
            name: data.name,
            interested: data.interested,
            needed: data.needed,
            team: data.team,
            user: data.user,
          });
        });

        return res.status(200).json(response);
      });
  } else if (req.params.position === "selected") {
    return db
      .collection("closed")
      .where("team", "array-contains", req.user.docId)
      .get()
      .then((teams) => {
        teams.forEach((project) => {
          const id = project.id;
          const data = project.data();

          response.push({
            id: id,
            creator: data.creator,
            createdAt: data.createdAt,
            description: data.description,
            github: data.github,
            links: data.links,
            name: data.name,
            interested: data.interested,
            needed: data.needed,
            team: data.team,
            user: data.user,
          });
        });

        return res.status(200).json(response);
      });
  } else if (req.params.position == "all") {
    return db
      .collection("closed")
      .where("user", "==", req.user.docId)
      .get()
      .then((projects) => {
        projects.forEach((project) => {
          const id = project.id;
          const data = project.data();

          response.push({
            id: id,
            creator: data.creator,
            createdAt: data.createdAt,
            description: data.description,
            github: data.github,
            links: data.links,
            name: data.name,
            interested: data.interested,
            needed: data.needed,
            team: data.team,
            user: data.user,
          });
        });
        return db
          .collection("closed")
          .where("team", "array-contains", req.user.docId)
          .get();
      })
      .then((projects) => {
        projects.forEach((project) => {
          const id = project.id;
          const data = project.data();

          response.push({
            id: id,
            creator: data.creator,
            createdAt: data.createdAt,
            description: data.description,
            github: data.github,
            links: data.links,
            name: data.name,
            interested: data.interested,
            needed: data.needed,
            team: data.team,
            user: data.user,
          });
        });

        return res.status(200).json(response);
      });
  } else {
    return res
      .status(404)
      .json({ error: `Could not find endpoint for position` });
  }
};

exports.reopenProject = (req, res) => {
  const owner = req.user.docId;
  const projectId = req.params.projectId;

  return db
    .doc(`/closed/${projectId}`)
    .get()
    .then((projData) => {
      if (!projData.exists) {
        return res.status(404).json({ error: `Project not found` });
      } else if (owner !== projData.data().user) {
        return res
          .status(403)
          .json({ error: `Nice try. But you're not the project owner` });
      } else {
        let interested = projData.data().interested;
        if(interested.length === 0) interested.push('Z5kdGE2CRRJVmSt3TQFy');
        interested.forEach(function (part, index) {
          this[index] = db.doc(`/users/${this[index]}`);
        }, interested);

        return db
          .getAll(...interested)
          .then((docs) => {
            let interestedEmails = [];
            docs.forEach((data) => {
              interestedEmails.push(data.data().socials.email);
            });

            const batch = db.batch();
            batch.set(db.collection('open').doc(), projData.data());
            batch.delete(db.doc(`/closed/${projectId}`));

            batch
              .commit()
              .then(() => {
                reopenTellInterested(interestedEmails, projData.data().name);
                return res
                  .status(200)
                  .json({ general: `${projData.data().name} reopened` });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ error: `Error in updating values: ${err.code}` });
              });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: `Error in getting emails: ${err.code}` });
          });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error in getting project: ${err.code}` });
    });
};
