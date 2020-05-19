const env = require("firebase-functions").config();
const nodemailer = require("nodemailer");
const {
  selection_html,
  rejection_html,
  finalTeam_html,
  reopenTellInterested_html
} = require("./emailMarkup");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.nodemailer.email,
    pass: env.nodemailer.password,
  },
});

const mailOptions = {
  from: env.nodemailer.email,
};

//when the user completes their profile
exports.accountCreation = (email) => {};

exports.selection = (email, name, project) => {
  mailOptions.to = email;
  mailOptions.subject = `Congratulations on your ${project} selection!`;
  mailOptions.text = `Hi ${name},\n We're so excited to share with you that your skills have beem noticed by
    the ${project} team. All great adventures start somewhere and we're glad to have facilitated yours.\n You can view all your team members in the My Teams page.\n\n We wish you the best in your endeavors.\n Best,\nTeam, Projectory`;
  mailOptions.html = selection_html(project, name);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log("Email sent: " + info.response);
  });
};

exports.rejection = (emails, project) => {
  mailOptions.to = emails.join(", ");
  mailOptions.subject = `Updates on your ${project} application`;
  mailOptions.text = `Hey there,\nWe're afraid that we have some unfavorable news. Unfortunately, you were not selected for ${project} which has now closed hiring.\n\nWe understand that this must
   be frustrating; the founders of this project have, themselves, experienced this frustration at multiple points in their life. However, this isn't the end. There are still plenty projects out there and this is a great opportunity for you 
   grow your skills and try them out in a, perhaps, more fitting venture.\n\nIn the event that this project reopens hiring, you will be the first person to be informed.\n\n We look forward to seeing your
   enthusiasm on our platform through other projects.\n\nBest,\nTeam, Projectory`;
  mailOptions.html = rejection_html(project);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log("Email sent: " + info.response);
  });
};

exports.finalTeam = (emails, project, owner) => {
  mailOptions.to = env.nodemailer.email;
  mailOptions.bcc = emails.join(", ");
  mailOptions.subject = `Updates on your ${project} application`;
  mailOptions.html = finalTeam_html(project, owner);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log("Email sent: " + info.response);
  });
};

exports.reopenTellInterested = (emails, project) => {
  mailOptions.to = emails.join(", ");
  mailOptions.subject = `${project} is back in action`;
  mailOptions.html = reopenTellInterested_html(project);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log("Email sent: " + info.response);
  });
};

exports.deleteProject = (emails) => {};
