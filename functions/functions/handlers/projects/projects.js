const { db } = require('../../util/admin')
const { create, getAllOpen } = require('./open');

//get all projects
exports.getAllOpenProjects = (req, res) => {
  return getAllOpen(req, res);
};

//get a single open project
exports.getOneOpenProject = (req, res) => {};

//create a single project and move it to the 'open' collection
exports.createProject = (req, res) => {
  return create(req, res);
};
