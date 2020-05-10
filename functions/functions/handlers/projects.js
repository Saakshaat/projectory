const { db } = require('../util/admin');
const users = require("../handlers/users");   

//get all projects
exports.getAllOpenProjects = (req, res) => {

}

//get a single open project
exports.getOneOpenProject = (req, res) => {

}

//create a single project
exports.createProject = (req, res) => {
    return res.status(200).json( req.user.name );
}