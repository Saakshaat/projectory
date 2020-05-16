const functions = require("firebase-functions");
const app  = require("express")();

const cors = require("cors");
app.use(cors());

const { db } = require("./util/admin");

const {
  emailLogin,
  emailSignup,
  googleSignin,
  signout,
  createUser,
  passwordReset,
  getOwnEntireProfile,
  getUserProfile,
  setProfileImage,
  addResume,
  test,
  editProfile,
  validToken
} = require("./handlers/users/users");

const {
  getAllOpenProjects,
  createProject,
  getOneOpenProject,
  getOneClosedProject,
  getAllWithSkill,
  getMyOpenProjects,
  getMyClosedProjects
} = require("./handlers/projects/projects");

const {
    apply,
    showInterested,
    showMyApplications
} = require('./handlers/applications/applications');

const authenticate = require("./util/authenticate");

//users routes
app.post("/signup", emailSignup);
app.post("/login", emailLogin);
app.post("/google/signin", googleSignin);
app.post("/signout", authenticate, signout);
app.post("/password_reset", passwordReset);
app.get('/test', test);
app.get('/valid', authenticate, validToken);
//profile routes
app.post("/create", createUser);
app.get("/my/profile", authenticate, getOwnEntireProfile);
app.get("/user/:userId/profile", getUserProfile);
app.post("/my/profile/image", authenticate, setProfileImage);
app.post("/my/profile/resume", authenticate, addResume);
app.post("/edit/profile", authenticate, editProfile);
/**
 * More Routes for:
 * - Editing their information: experience, user details, image, credentials
 */

//projects routes
app.post("/project", authenticate, createProject);
app.get("/projects/open", getAllOpenProjects);
app.get("/project/open/:projectId", getOneOpenProject);
app.get("/project/closed/:projectId", getOneClosedProject);
app.get('/projects/open/skills/:skill', getAllWithSkill);
app.get('/my/projects/open', authenticate, getMyOpenProjects);
app.get('/my/projects/closed', authenticate, getMyClosedProjects);
/**
 * - Get all closed projects ('/my/closed')
 * - Get all open projects ('/my/open')
 * - My teams 
 */

//applications routes
app.get('/apply/:projectId', authenticate, apply);
app.get('/interested/:projectId', authenticate, showInterested);
app.get('/my/applications', authenticate, showMyApplications);
/**
 * - Get all members of a teams for a certain project (either owner or selected team member) (same logic as showInterested)
 * - Get all interested projects (/my/interested)
 * - Get all owned projects (my/created)
 */

exports.baseapi = functions.https.onRequest(app);
exports.applications = functions.https.onRequest(app);

//TODO: Also do delete the user's doc reference from the `interested` and `team` field in a project
exports.deleteUser = functions.firestore
  .document("/users/{userId}")
  .onDelete((snapshot, context) => {
    const userId = context.params.userId;
    const batch = db.batch();
    return db
      .collection("credentials")
      .where("user", "==", userId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/credentials/${doc.id}`));
        });
        return db.collection("experience").where("user", "==", userId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/experience/${doc.id}`));
        });
        return db.collection("open").where("user", "==", userId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/open/${doc.id}`));
        });

        return db.collection("closed").where("user", "==", userId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/closed/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });

/**
 * Other APIs:
 * Deletion API:
 * - If the user deletes a project, send an email to interested/selected users and owner. Remove it ƒrom the collection.
 * Notifications API:
 * - Creator gets a push notification when someone applies for project.
 * - Intersted person gets a notification (and an email), when they get selected.
 */