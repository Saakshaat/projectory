const { db } = require("../../util/admin");
const { showMultipleProfiles } = require("../users/profile");

exports.apply = (req, res) => {
  /**
   * TODO:
   * - Send an email to creator about the person.
   * - Send email to user about application confirmation with details.
   */

  const projRef = db.doc(`/open/${req.params.projectId}`);
  return projRef
    .get()
    .then((project) => {
      if (!project.exists) {
        return res.status(404).json({ error: `Project not found` });
      } else if (project.data().user === req.user.docId) {
        return res
          .status(400)
          .json({ error: `You cannot apply to your own project` });
      } else if (
        project.data().interested.length > 0 &&
        project.data().interested.includes(req.user.docId)
      ) {
        return res
          .status(400)
          .json({ error: `You've already applied to this project` });
      } else {
        let interested = project.data().interested;
        interested.push(req.user.docId);

        return projRef
          .update({ interested: interested })
          .then(() => {
            return res.status(200).json({ general: `Applied successfully` });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: `Internal Server Error: ${err.code}` });
          });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Internal Server Error${err.code}` });
    });
};

exports.showInterested = (req, res) => {
  return db
    .doc(`/open/${req.params.projectId}`)
    .get()
    .then((project) => {
      if (!project.exists) {
        return res.status(404).json({ error: `Project not found` });
      } else if (project.data().user !== req.user.docId) {
        return res.status(403).json({ error: `You're not the project owner` });
      } else if (
        project.data().interested == undefined ||
        project.data().interested.length === 0
      ) {
        return res
          .status(200)
          .json({ general: `No one has applied yet. Hold tight!` });
      } else {
        req.body.users = project.data().interested;
        return showMultipleProfiles(req, res);
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Internal Server Error. ${err.code}` });
    });
};

exports.select = (req, res) => {
  /**
   * - move selected user from interested to team array
   * - update selected user's `projects_selected` field in the user object
   * - send selected user an email about selection
   */
};

exports.showProjectTeam = (req, res) => {
  return db
  .doc(`/${req.params.state}/${req.params.projectId}`)
  .get()
  .then((project) => {
    if (!project.exists) {
      return res.status(404).json({ error: `Project not found` });
    } else if (!project.data().team.includes(req.user.docId)) {
      return res.status(403).json({ error: `You're not in this team` });
    } else if (
      project.data().team == undefined ||
      project.data().team.length === 1
    ) {
      return res
        .status(200)
        .json({ general: `You're the only one here. Yet!` });
    } else {
      console.log(project.data().team)
      req.body.users = project.data().team;
      return showMultipleProfiles(req, res);
    }
  })
  .catch((err) => {
    return res
      .status(500)
      .json({ error: `Internal Server Error. ${err.code}` });
  });
};

exports.removeMember = (req, res) => {
  /**
   * - move selected user from team to intersted array
   * - send selected user an email about removal
   * - update selected user's `projects_selected` field in the user object
   */
};

exports.finalizeTeam = (req, res) => {
  /**
   * - Send an email to everyone not selected (in the interested) about rejection.
   * - move project from open collection to closed collection
   * - (Optional) Delete the interested array
   */
};

exports.showMyApplications = (req, res) => {
  let projects = [];

  return db
    .collection("open")
    .where("interested", "array-contains", req.user.docId)
    .get()
    .then((docs) => {
      docs.forEach((project) => {
        const id = project.id;
        const data = project.data();
        projects.push({
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

      return res.status(200).json(projects);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Internal Server Error. ${err.code}` });
    });
};
