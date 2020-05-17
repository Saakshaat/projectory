const { db, admin } = require("../../util/admin");

exports.create = (req, res) => {
  let needed = [];
  req.body.needed.forEach((skill) => {
    needed.push(skill);
  });
  const project = {
    name: req.body.name,
    createdAt: new Date().toUTCString(),
    creator: req.user.name,
    user: req.user.docId,
    description: req.body.description,
    github: req.body.github,
    links: req.body.links,
    needed,
    interested: [],
    team: [],
  };

  return db
    .collection("open")
    .where("name", "==", project.name)
    .where("user", "==", project.user)
    .get()
    .then((doc) => {
      if (doc.size > 0) {
        return res
          .status(409)
          .json({ error: `You already have a project with that name` });
      } else {
        return db.doc(`/users/${project.user}`).get();
      }
    })
    .then((user) => {
      let projects = 0;

      projects = user.data().projects_created;
      projects++;
      const batch = db.batch();

      const projectRef = db.collection("open").doc();

      batch.set(projectRef, project);
      batch.update(db.collection("users").doc(`/${req.user.docId}`), {
        projects_created: projects,
      });

      return batch
        .commit()
        .then(() => {
          return res.status(200).json({ general: `Project created` });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: `Error in creating project: ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Error in accessing user` });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Internal Server Error` });
    });
};

exports.getAllOpen = (req, res) => {
  db.collection("open")
    .get()
    .then((data) => {
      let projects = [];

      data.forEach((doc) => {
        projects.push({
          id: doc.id,
          creator: doc.data().creator,
          createdAt: doc.data().createdAt,
          description: doc.data().description,
          github: doc.data().github,
          links: doc.data().links,
          name: doc.data().name,
          interested: doc.data().interested,
          needed: doc.data().needed,
          team: doc.data().team,
          user: doc.data().user,
        });
      });

      return res.status(200).json(projects);
    });
};

exports.getOne = (req, res) => {
  let projectData = {};
  return db
    .doc(`/open/${req.params.projectId}`)
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

exports.getSkill = (req, res) => {
  var resProjects = [];
  db.collection("open")
    .where("needed", "array-contains", req.params.skill)
    .get()
    .then((projects) => {
      projects.forEach((doc) => {
        resProjects.push({
          id: doc.id,
          creator: doc.data().creator,
          createdAt: doc.data().createdAt,
          description: doc.data().description,
          github: doc.data().github,
          links: doc.data().links,
          name: doc.data().name,
          interested: doc.data().interested,
          needed: doc.data().needed,
          team: doc.data().team,
          user: doc.data().user,
        });
      });

      return res.status(200).json(resProjects);
    })
    .catch((err) => {
      return res.status(500).json({ error: `Error accessing projects` });
    });
};

exports.getMyOpen = (req, res) => {
  let response = [];

  if (req.params.position == "created") {
    return db
      .collection("open")
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
  } else if (req.params.position == "selected") {
    return db
      .collection("open")
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
  } else if (req.params.position == 'all') {
    return db
      .collection("open")
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
          .collection("open")
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

exports.getCannotApply = (req, res) => {
  let proj = [];

  return db.collection('open').where('user', '==', req.user.docId).get().then(created => {
    created.forEach(e => {
      proj.push(e.id);
    })

    return db.collection('open').where('teams', 'array-contains', req.user.docId).get();
  })
  .then(selected => {
    selected.forEach(e => {
      proj.push(e.id);
    })

    return db.collection('open').where('interested', 'array-contains', req.user.docId).get();
  })
  .then(interested => {
    interested.forEach(e => {
      proj.push(e.id);
    })

    return res.status(200).json(proj);
  })
  .catch(err => {
    return res.status(500).json({ error: `Internal Server Error` });
  })
}

exports.edit = (req, res) => {
  const newProject = {
    name: req.body.name,
    needed: req.body.needed,
    description: req.body.description,
    github: req.body.github,
    links: req.body.links,
  };

  const batch = db.batch();
  batch.update(db.doc(`/open/${req.params.projectId}`), {
    name: newProject.name,
    needed: newProject.needed,
    description: newProject.description,
    github: newProject.github,
    links: newProject.links,
  });
  batch
    .commit()
    .then(() => {
      return res.status(200).json({ general: `Project updated successfully` });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Internal Server Error` });
    });
};

exports.delete = (req, res) => {
  /**
   * TODO:
   * - delete project object
   * - email all people in team about deletion
   * - decrement all selected members' 'projects_selected'
   * - decrement the creator's 'projects_created'
   */
};
