const nodemailer = require('nodemailer');

function sendMyMail(email,password,cb)
{
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'phpbatch34@gmail.com',
    pass: '123@@123'
  }
});

var mailOptions = {
  from: 'phpbatch34@gmail.com',
  to: email,
  subject: 'Verification Mail For FindUs',
  html: "<h1>Welcome to FindUs</h1><p>you have successfully registered on our app, your login credentials are attached below</p><h3>Username : "+email+"</h3><h3>Password : "+password+"</h3><h2>Click on the link below to verify your account</h2>http://localhost:3000/verifyuser?uid="+email
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    cb()
  }
});
}

module.exports=sendMyMail




