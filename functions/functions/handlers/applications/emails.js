const env = require('firebase-functions').config()
const nodemailer = require('nodemailer');
const { selection_html } = require('./emailMarkup')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.nodemailer.email,
        pass: env.nodemailer.password
    }
});

const mailOptions = {
    from: env.nodemailer.email,
}

//when the user completes their profile
exports.accountCreation = (email) => {

}

exports.selection = (email, name, project) => {
    mailOptions.to = email;
    mailOptions.subject = `Congratulations on your ${project} selection!`
    mailOptions.text = `Hi ${name},\n We're so excited to share with you that your skills have beem noticed by
    the ${project} team. All great adventures start somewhere and we're glad to have facilitated yours.\n You can view all your team members in the My Teams page.\n\n We wish you the best in your endeavors.\n Best,\nTeam, Projectory`;
    mailOptions.html = selection_html(project, name);
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) console.error(err)
        else console.log("Email sent: " + info.response);
    })
}

exports.rejection = (emails) => {

}

exports.finalTeam = (emails) => {

} 

exports.deleteProject = (emails) => {

}