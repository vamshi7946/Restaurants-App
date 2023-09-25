const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
    auth: {
      user: 'somavamshi4813@gmail.com', // Your email address
      pass: 'qcet qedo oomz spjs', // Your email password
    },
  });
  
  // Function to send a welcome email
  function sendWelcomeEmail(email,username) {
    const mailOptions = {
      from: 'somavamshi4813@gmail.com', // Sender email address
      to: email, // Recipient email address
      subject: 'Welcome to ECOMM Nodejs Project - Registration Successful!',
      text: `Dear ${username},

    We are delighted to welcome you to ECOMM Nodejs Project, where shopping meets satisfaction. Your registration has been successfully completed, and we are excited to have you on board.
    
    At ECOMM Nodejs Project, we take pride in offering a curated selection of top-quality products to enhance your lifestyle. From fashion to electronics, our store caters to your diverse needs.
    
    To begin your shopping experience, please visit our website and login with your credentials.We look forward to serving you and providing an exceptional shopping experience.
    
    Happy shopping!
    
    Best regards,
    
    Batch-2
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

  module.exports = {sendWelcomeEmail};