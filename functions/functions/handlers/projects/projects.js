const { db } = require("../../util/admin");
const {
  create,
  getAllOpen,
  getOne,
  getSkill,
  getMyOpen,
  edit,
  getCannotApply,
} = require("./open");
const {
  deleteProjectInformOwner,
  deleteProjectInformInterested,
  deleteProjectInformTeam,
} = require("../applications/emails");
const { getOneC, getMyClosed, reopenProject } = require("./closed");

//get all projects
exports.getAllOpenProjects = (req, res) => {
  return getAllOpen(req, res);
};

//get a single open project
exports.getOneOpenProject = (req, res) => {
  return getOne(req, res);
};

//get a single closed project
exports.getOneClosedProject = (req, res) => {
  return getOneC(req, res);
};

//create a single project and move it to the 'open' collection
exports.createProject = (req, res) => {
  return create(req, res);
};

exports.getAllWithSkill = (req, res) => {
  return getSkill(req, res);
};

exports.getMyProjects = (req, res) => {
  if (req.params.state == "open") {
    return getMyOpen(req, res);
  } else if (req.params.state == "closed") {
    return getMyClosed(req, res);
  } else {
    return res.status(404).json({ error: `Could not find endpoint` });
  }
};

exports.editProject = (req, res) => {
  return edit(req, res);
};

exports.getCannotApply = (req, res) => {
  return getCannotApply(req, res);
};

exports.reopen = (req, res) => {
  return reopenProject(req, res);
};

/**
 * - delete project object
 * - email all people in team about deletion
 * - decrement all selected members' 'projects_selected'
 * - decrement the creator's 'projects_created'
 */
exports.deleteProject = (req, res) => {
  return db
    .doc(`/${req.params.state}/${req.params.projectId}`)
    .get()
    .then((project) => {
      if (!project.exists) {
        return res.status(404).json({ error: `Project not found` });
      } else if (req.user.docId !== project.data().user) {
        return res.status(403).json({ error: `You're not the project owner` });
      } else {
        const owner = req.user.docId;
        const interested = project.data().interested;
        if (interested.length === 0) interested.push('Z5kdGE2CRRJVmSt3TQFy');
        const team = project.data().team;
        if (team.length === 0) team.push('Z5kdGE2CRRJVmSt3TQFy');
        interested.forEach(function (part, index) {
          this[index] = db.doc(`/users/${this[index]}`);
        }, interested);

        team.forEach(function (part, index) {
          this[index] = db.doc(`/users/${this[index]}`);
        }, team);

        return db
          .doc(`/users/${owner}`)
          .get()
          .then((user) => {
            const ownerName = user.data().name;
            const ownerEmail = user.data().socials.email;
            const projects_created = (user.data().projects_created - 1);

            return db
              .doc(`/users/${owner}`)
              .update({ projects_created: projects_created })
              .then(() => {
                return db
                  .getAll(...interested)
                  .then((docs) => {
                    let interestedEmails = [];
                    docs.forEach((interested) => {
                      interestedEmails.push(interested.data().socials.email);
                    });

                    return db
                      .getAll(...team)
                      .then((teamDoc) => {
                        let teamEmails = [];
                        teamDoc.forEach((teamData) => {
                          teamEmails.push(teamData.data().socials.email);
                          const projects_selected = teamData.data()
                            .projects_selected - 1;
                          db.doc(`/users/${teamData.id}`)
                            .update({ projects_selected: projects_selected })
                            .then(() => {
                              console.log(`${teamData.data().name} updated `);
                            });
                        });

                        if (req.params.state === "open") {
                          deleteProjectInformInterested(
                            interestedEmails,
                            project.data().name
                          );
                        }
                        deleteProjectInformTeam(
                          teamEmails,
                          project.data().name,
                          ownerName
                        );
                        deleteProjectInformOwner(
                          ownerEmail,
                          project.data().name
                        );
                        return db
                          .doc(`/${req.params.state}/${req.params.projectId}`)
                          .delete()
                          .then(() => {
                            return res.status(200).json({
                              general: `${
                                project.data().name
                              } deleted successfully and all involved informed.`,
                            });
                          })
                          .catch((err) => {
                            return res.status(500).json({
                              error: `Error in deleting project: ${err.code}`,
                            });
                          });
                      })
                      .catch((err) => {
                        return res
                          .status(500)
                          .json({
                            error: `Error in getting team: ${err.code}`,
                          });
                      });
                  })
                  .catch((err) => {
                    return res
                      .status(500)
                      .json({
                        error: `Error in getting interested: ${err.code}`,
                      });
                  });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ error: `Error in updating user: ${err}` });
              });
          })
          .catch((err) => {
            return res.status(500).json({ error: `Error in getting user` });
          });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error getting project: ${err.code}` });
    });
};
