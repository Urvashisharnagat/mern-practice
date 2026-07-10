const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
);

oAuth2Client.setCredentials({
    
    refresh_token: process.env.REFRESH_TOKEN,
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent:", info.messageId);
    } catch (err) {
        console.error(err);
    }
};

async function sendregistrationEmail(userEmail, name) {
    const subject = "Welcome to Backend Ledger"
    const text = `Hello ${name},

Thank you for joining Backend Ledger.

We are excited to have you on board and look forward to helping you manage your ledger with ease.

Best regards,
The Backend Ledger Team`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Backend Ledger</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
    .header { text-align: center; padding-bottom: 20px; }
    .button { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Backend Ledger</h1>
    </div>
    <p>Hello ${name},</p>
    <p>Thank you for joining Backend Ledger.</p>
    <p>We are excited to have you on board and look forward to helping you manage your ledger with ease.</p>
    <p>Best regards,<br>The Backend Ledger Team</p>
    <a href="https://your-app-url.example.com" class="button">Go to Dashboard</a>
  </div>
</body>
</html>`

    await sendEmail(userEmail, subject, text, html)
}


async function sendtransactiocompleted(useremail, name, amount, toaccount) {
        const subject = "Transaction Completed - Backend Ledger"
        const text = `Hello ${name},\n\nYour transaction of ${amount} to account ${toaccount} has been completed successfully.\n\nThank you for using Backend Ledger.\n\nBest regards,\nThe Backend Ledger Team`

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Completed</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
        .header { text-align: center; padding-bottom: 20px; }
        .details { background: #f9f9f9; padding: 10px; border-radius: 4px; }
        .amount { font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Transaction Completed</h1>
        </div>
        <p>Hello ${name},</p>
        <p>Your transaction has been completed successfully. Details are below:</p>
        <div class="details">
            <p>Amount: <span class="amount">${amount}</span></p>
            <p>To Account: ${toaccount}</p>
        </div>
        <p>Thank you for using Backend Ledger.</p>
        <p>Best regards,<br>The Backend Ledger Team</p>
    </div>
</body>
</html>`

        await sendEmail(useremail, subject, text, html)
}



module.exports = {
    sendregistrationEmail,
    sendtransactiocompleted
}