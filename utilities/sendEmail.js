const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cogops93@gmail.com',
    pass: 'tijqajkwvbpg' 
  },
});

  const mailOptions = {
    from: `"CogOps Protocol" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;