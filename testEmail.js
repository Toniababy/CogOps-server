require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const test = async () => {
  try {
    await sendEmail({
      email: 'cogops93@gmail.com', 
      subject: 'SYSTEM CHECK // ONLINE',
      html: '<h1>Protocol Verified</h1><p>The CogOps Mail Server is now <b>LIVE</b>.</p>'
    });
    console.log("SUCCESS: Check your inbox.");
  } catch (err) {
    console.log("FAILED:", err);
  }
};

test();