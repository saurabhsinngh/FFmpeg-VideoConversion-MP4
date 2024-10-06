const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: 'nyko smtk ffum avck',
  }
});

const sendUploadStatusEmail = (filename, status) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    subject: 'Video Conversion Status',
    text: `Your video ${filename} is now being ${status}. We will notify you once the process is complete.`
};

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const sendCompleteStatusEmail = (filename, status) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT,
      subject: 'Video Conversion Status',
      text: `Your video ${filename} convrsion has been successfully ${status}.`

    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
};

module.exports = { sendUploadStatusEmail, sendCompleteStatusEmail };
