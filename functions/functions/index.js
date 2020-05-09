const functions = require('firebase-functions');
const app = require("express")();

const cors = require('cors');
app.use(cors());

const {
    emailLogin,
    emailSignup,
    googleSignin,
    signout,
    passwordReset,
} = require('./handlers/users')

const {
    getAllOpenProjects,
    createProject,
    getOneOpenProject
} = require('./handlers/projects')

const { isAuthenticated } = require('./util/authenticate');

//users routes
app.post("/signup", emailSignup);
app.post("/login", emailLogin);
app.post("/google/signin", googleSignin);
app.post("/signout", signout);
app.post("/password_reset", passwordReset)
/**
 * More Routes for:
 * - Editing their information: experience, user details, image, credentials
 * - Get all interested projects
 * - Get all closed projects
 */


//projects routes
app.post("/project", isAuthenticated ,createProject);
app.get("/projects", getAllOpenProjects);
app.get("/project/:projectId", getOneOpenProject);
/**
 * - Mark self as interested (apply). Can't apply if creator.
 * - Get profiles for all interested (only if creator)
 * - Get all projects that have a certain technology in the 'needed' field (for client filter with technologies)
 */

exports.baseapi = functions.https.onRequest(app);

/**
 * Other APIs:
 * Deletion API:
 * - If the user deletes a project, send an email to interested/selected users. Remove it ƒrom the collection.
 * - If the user deletes their profile, delete all associated credentials, experience and projects objects. Should trigger project deletion mentioned above
 * Notifications API:
 * - Creator gets a push notification when someone applies for project.
 * - Intersted person gets a notification (and an email), when they get selected.
 */