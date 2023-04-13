const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { BASE_URL, SENDGRID_API_KEY, SENDGRID_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationEmail = {
    from: SENDGRID_EMAIL,
    to: "ditoyi3561@momoshe.com",
    subject: "Verify your email",
    html: `<a target='_blank' href='${BASE_URL}/api/users/verify/${verificationToken}'>Please, click to verify email</a>`,
  };

  try {
    await sgMail.send(verificationEmail);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendVerificationEmail;
