// Example: Add a console.log statement https://your-server.com/uninstall-handler
console.log("Server is starting...");

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3001;

// API endpoint to handle uninstallation events
app.get('/uninstall-handler', (req, res) => {
 const encodedEmail = req.query.email;
 const email1 = decodeURIComponent(encodedEmail);
 const email = email1.replace('%40', '@');

 if (email) {
   // Email found in the query parameter, send the uninstallation email
   const payload = {
     recipientEmail: email,
     subject: 'Extension Uninstalled',
     message: `Your extension has been uninstalled.\nTimestamp: ${new Date().toLocaleString()}`,   };
   sendUninstallEmail(payload);

   // Respond with a success status
   res.send(`
   <html>
   <head>
       <title>Extension Uninstalled</title>
       <style>
           body {
               font-family: Arial, sans-serif;
               text-align: center;
               padding: 50px;
           }
   
           h1 {
               color: #333;
           }
   
           p {
               color: #666;
           }
       </style>
   </head>
   <body>
       <h1>Extension Uninstalled</h1>
       <p>Your extension has been successfully uninstalled.</p>
   </body>
   </html>/*  */
`);
 } else {
   // Email not provided in the query parameter
   res.status(400).json({ error: 'Email not provided in the URL.' });
 }
});

app.post('/uninstall-handler', (req, res) => {
 console.log('Received uninstallation event from extension:', req.body);
 // Call the function to send the email
 sendUninstallEmail(req.body);

 // Respond with a success status
 res.send(`
 <html>
 <head>
     <title>Extension Uninstalled</title>
     <style>
         body {
             font-family: Arial, sans-serif;
             text-align: center;
             padding: 50px;
         }
 
         h1 {
             color: #333;
         }
 
         p {
             color: #666;
         }
     </style>
 </head>
 <body>
     <h1>Extension Uninstalled</h1>
     <p>Your extension has been successfully uninstalled.</p>
 </body>
 </html>
`);
// res.json({ status: 'success' });
});
//////////////////////////////////////////////
app.get('/send-email', (req, res) => {
 const encodedEmail = req.query.email;
 const email1 = decodeURIComponent(encodedEmail);
 const email = email1.replace('%40', '@');
 const accessedWebsite = req.query.website;

 if (email&& accessedWebsite) {
   // Email found in the query parameter, send the uninstallation email
   const payload = {
     recipientEmail: email,
     subject: 'Blocked Website Accessed',
     message: `User has accessed the blocked website: ${accessedWebsite}.\nTimestamp: ${new Date().toLocaleString()}`,
   };
   sendUninstallEmail(payload);

   // Respond with a success status
   
res.json({ status: 'success.' });
 } else {
   // Email not provided in the query parameter
   res.status(400).json({ error: 'Email not provided in the URL.' });
 }
});
//////////////////////////////////////////////
app.post('/send-email', (req, res) => {
 console.log('Received blocked website access event from extension:', req.body);
  
 sendUninstallEmail(req.body);

 res.json({ status: 'success.' });
});



// // Function to send the uninstallation email
function sendUninstallEmail(data) {
  // Extract data from the request body
  const { recipientEmail, subject, message } = data;

  // Create a transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    // Replace with your SMTP server configuration
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'kavachobscenityblocker@gmail.com',
      pass: 'uubuyhawgfftbxfr',
    },
 });

//   // Email data
  const mailOptions = {
    from: 'kavachobscenityblocker@gmail.com',
    to: recipientEmail,
    subject: subject,
    text: message,
};

 // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.messageId);
    }
  });
}

//  Start the serverC:\Users\Admin\kavach_extension\extension\server.js
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});