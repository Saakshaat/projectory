const functions = require('firebase-functions')

exports.test = (req, res) => {
    return res.status(200).json({
        email: functions.config().nodemailer.email,
        pass: functions.config().nodemailer.pass
    })
}