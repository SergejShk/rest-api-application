const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendEmail = ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY);

  sgMail.send({
    from: process.env.HOME_MAIL,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
};
