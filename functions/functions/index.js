const functions = require("firebase-functions");
const app = require("express")();

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
} = require("./handlers/users/users");

const {
  getAllOpenProjects,
  createProject,
  getOneOpenProject,
} = require("./handlers/projects/projects");

const authenticate = require("./util/authenticate");

//users routes
app.post("/signup", emailSignup);
app.post("/login", emailLogin);
app.post("/google/signin", googleSignin);
app.post("/signout", signout);
app.post("/create", createUser);
app.post("/password_reset", passwordReset);
app.get("/my/profile", authenticate, getOwnEntireProfile);
app.get("/user/:userId/profile", getUserProfile);
/**
 * More Routes for:
 * - Editing their information: experience, user details, image, credentials
 * - Get all interested projects (/my/interested)
 * - Get all owned projects (my/created)
 * - Get all closed projects (my/closed)
 * - Get all open projects (my/open)
 *
 */

//projects routes
app.post("/project", authenticate, createProject);
app.get("/projects/open", getAllOpenProjects);
app.get("/project/open/:projectId", getOneOpenProject);
/**
 * - Mark self as interested (apply). Can't apply if creator.
 * - Get profiles for all interested (only if creator)
 * - Get all projects that have a certain technology in the 'needed' field (for client filter with technologies)
 */

exports.baseapi = functions.https.onRequest(app);
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
 * - If the user deletes a project, send an email to interested/selected users. Remove it ƒrom the collection.
 * Notifications API:
 * - Creator gets a push notification when someone applies for project.
 * - Intersted person gets a notification (and an email), when they get selected.
 */
