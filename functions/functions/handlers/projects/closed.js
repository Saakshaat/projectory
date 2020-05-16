const { db, admin } = require("../../util/admin");

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
  } else {
    return res
      .status(404)
      .json({ error: `Could not find endpoint for position` });
  }
};

exports.reopenProject = (req, res) => {
  /**
   * - Move project from closed to open collection
   */
};
