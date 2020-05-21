const { db } = require("../../util/admin");
const { showMultipleProfiles } = require("../users/profile");
const { selection, rejection, finalTeam } = require("./emails");

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
        interested.push(project.data().user);

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
        req.body.project = project.data().name;
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
  const project = req.params.projectId;
  const member = req.params.userId;
  const owner = req.user.docId;

  return db
    .doc(`/open/${project}`)
    .get()
    .then((proj) => {
      if (!proj.exists) {
        return res.status(404).json({ error: `Project does not exist` });
      } else if (proj.data().team.includes(member)) {
        return res.status(409).json({ error: `User is already in your team` });
      } else if (!proj.data().interested.includes(member)) {
        return res.status(404).json({ error: `Selected user not found` });
      } else if (proj.data().user !== owner) {
        return res.status(403).json({ error: `You're not the project owner` });
      } else if (member === owner) {
        return res.status(400).json({ error: `Come on man, you can't select yourself.` })
      } else {
        return db
          .doc(`/users/${member}`)
          .get()
          .then((user) => {
            let interested = proj.data().interested;
            interested.splice(interested.indexOf(member), 1);
            let team = proj.data().team;
            team.push(member);
            let projects_selected = user.data().projects_selected + 1;
            const batch = db.batch();
            batch.update(db.doc(`/open/${project}`), {
              interested: interested,
            });
            batch.update(db.doc(`/open/${project}`), {
              team: team,
            });
            batch.update(db.doc(`/users/${member}`), {
              projects_selected: projects_selected,
            });
            batch
              .commit()
              .then(() => {
                selection(
                  user.data().socials.email,
                  user.data().name,
                  proj.data().name
                );
                return res.status(200).json({
                  general: `${user.data().name} successfully selected`,
                });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ error: `Error in updating values` });
              });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: `Error in getting user: ${err.code}` });
          });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Error in getting project: ${err.code}` });
    });
};

exports.showProjectTeam = (req, res) => {
  return db
    .doc(`/${req.params.state}/${req.params.projectId}`)
    .get()
    .then((project) => {
      if (!project.exists) {
        return res.status(404).json({ error: `Project not found` });
      } else if (!project.data().team.includes(req.user.docId) && project.data().user !== req.user.docId) {
          return res.status(403).json({ error: `You're not in this team` });
      } else if (
        project.data().team == undefined ||
        project.data().team.length === 0
      ) {
        return res
          .status(200)
          .json({ general: `You're the only one here. Yet!` });
      } else {
        req.body.project = project.data().name;
        req.body.users = project.data().team;
        req.body.users.push(project.data().user);
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

/**
 * - Send an email to everyone not selected (in the interested) about rejection.
 * - move project from open collection to closed collection
 * - (Optional) Delete the interested array
 */
exports.finalizeTeam = (req, res) => {
  let project = req.params.projectId;
  let owner = req.user.docId;

  return db
    .doc(`/open/${project}`)
    .get()
    .then((proj) => {
      if (!proj.exists) {
        return res
          .status(404)
          .json({
            error: `Project not found. Is it perhaps a closed project?`,
          });
      } else if (proj.data().user !== owner) {
        return res.status(403).json({ error: `You're not the project owner` });
      } else if (proj.data().team.length === 0) {
        return res.status(400).json({ error: `No team members yet` });
      } else {
        const batch = db.batch();
        batch.set(db.collection("closed").doc(), proj.data());
        batch.delete(db.doc(`/open/${project}`));

        batch
          .commit()
          .then(() => {
            let rejected = proj.data().interested;
            let team = proj.data().team;
            if(rejected.length === 0) rejected.push('Z5kdGE2CRRJVmSt3TQFy');
            if(team.length === 0) team.push('Z5kdGE2CRRJVmSt3TQFy');

            rejected.forEach(function (part, index) {
              this[index] = db.doc(`/users/${this[index]}`);
            }, rejected);

            team.forEach(function (part, index) {
              this[index] = db.doc(`/users/${this[index]}`);
            }, team);

            return db.getAll(...rejected).then((docs) => {
              let rejectedEmails = [];
              docs.forEach(rejectedData => {
                rejectedEmails.push(rejectedData.data().socials.email);
              });

              return db.getAll(...team).then(teamDoc => {
                let teamEmails = [];
                teamDoc.forEach(teamData => {
                  teamEmails.push(teamData.data().socials.email);
                })

                rejection(rejectedEmails, proj.data().name);
                finalTeam(teamEmails, proj.data().name, req.user.name);
                return res
                  .status(200)
                  .json({
                    general: `Project ${
                      proj.data().name
                    } closed for hiring. Team and rejected informed.`,
                  });
              })
            })
          })
          // .catch((err) => {
          //   return res
          //     .status(500)
          //     .json({ error: `Error while updating values: ${err}` });
          // });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: `Internal Server Error: ${err.code}` });
    });
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
