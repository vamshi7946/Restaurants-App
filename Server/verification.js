const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
    auth: {
      user: 'xxx@gmail.com', // Your email address
      pass: 'xxxx xxxx xxxx xxxx', // Your email password
    },
  });
  
  // Function to send a welcome email
  function sendVerificationEmail(email,username,verificationCode) {
    const mailOptions = {
      from: 'somavamshi4813@gmail.com', // Sender email address
      to: email, // Recipient email address
      subject: 'OTP Verification!',
      text: `Dear ${username},
    OTP : ${verificationCode}
    
    Best regards,
    
    Batch-1
    Internship Project
    ECOMM Nodejs Project
    `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending welcome email:', error);
      } else {
        console.log('Welcome email sent:', info.response);
      }
    });
  }

  module.exports = {sendVerificationEmail};
