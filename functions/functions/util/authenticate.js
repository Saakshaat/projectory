const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
    let idToken;

    if(!req.headers.authorization){
      return res.status(403).json({ error: `Unauthorized`});
    } else {
      idToken = req.headers.authorization;
    }

    admin.auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('users')
                .where('uid', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.docId = data.docs[0].data().id;
            req.user.name = data.docs[0].data().name;
            console.log("Doc Id:", req.user.docId);
            console.log("Name: ", req.user.name);
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token', err);
            return res.status(403).json({ error: err.code });
        })
}