const { db } = require("../../util/admin");
const {
  create,
  getAllOpen,
  getOne,
  getSkill,
  getMyOpen,
  edit,
  getCannotApply
} = require("./open");
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
  if(req.params.state == 'open') {
    return getMyOpen(req, res);
  } else if (req.params.state == 'closed') {
    return getMyClosed(req, res);
  } else {
    return res.status(404).json({ error: `Could not find endpoint` });
  }
}

exports.editProject = (req, res) => {
  return edit(req, res);
};

exports.getCannotApply = (req, res) => {
  return getCannotApply(req, res);
}