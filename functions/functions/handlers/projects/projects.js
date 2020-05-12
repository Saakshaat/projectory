const { db, admin } = require("../../util/admin");

//get all projects
exports.getAllOpenProjects = (req, res) => {
  db.collection('open').get().then(data => {
    let projects = [];

    data.forEach(doc => {
      projects.push({
        creator: doc.data().creator,
        createdAt: doc.data().createdAt,
        description: doc.data().description,
        github: doc.data().github,
        name: doc.data().name,
        interested: doc.data().interested,
        needed: doc.data().needed,
        team: doc.data().team,
        user: doc.data().user
      })
    })

    return res.status(200).json(projects);
  })
};

//get a single open project
exports.getOneOpenProject = (req, res) => {};

//create a single project and move it to the 'open' collection
exports.createProject = (req, res) => {
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

  db.collection("open")
    .where("name", "==", project.name)
    .where("user", "==", project.user)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(409)
          .json({ error: `You already have a project with that name` });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: `Internal Server Error` });
    });

  let projects = 0;

  db.doc(`/users/${req.user.docId}`)
    .get()
    .then((user) => {
      projects = user.data().projects_created;
    })
    .catch((err) => {
      return res.status(500).json({ error: `Error in accessing user` });
    });
  projects += 1;
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
};
