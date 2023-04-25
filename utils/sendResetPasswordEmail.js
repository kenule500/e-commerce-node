const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const resetPasswordURL = `${origin}/user/reset-password?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm you email by clicking the following link: <a href="${resetPasswordURL}">Reset Password</a></p>`;
  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name} </h4>
    ${message}
    `,
  });
};

module.exports = sendResetPasswordEmail;
