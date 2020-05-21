const env = require('firebase-functions').config()

module.exports = {
    apiKey: env.config.apikey,
    authDomain: env.config.authDomain,
    databaseURL: env.config.databaseurl,
    projectId: env.config.projectid,
    storageBucket: env.config.storagebucket,
    messagingSenderId: env.config.messagingsenderid,
    appId: env.config.appid,
    measurementId: env.config.measurementid
}