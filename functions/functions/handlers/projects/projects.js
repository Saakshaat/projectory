const { db } = require("../../util/admin");
const { create, getAllOpen, getOne, getSkill, getMyOpen } = require("./open");
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

exports.getMyOpenProjects = (req, res) => {
  return getMyOpen(req, res);
};

exports.getMyClosedProjects = (req, res) => {
  return getMyClosed(req, res);
}
