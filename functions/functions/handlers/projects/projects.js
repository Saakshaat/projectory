const { db } = require("../../util/admin");
const { create, getAllOpen, getOne } = require("./open");
const { getOneC, getMyClosed, reopenProject } = require("./closed");
const {
  apply,
  select,
  showIntersted,
  showTeam,
  removeMember,
  finalizeTeam,
} = require("./applications");

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
