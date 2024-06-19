import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const sendMail = async (userMail, code) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verification Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: red;
          padding: 20px;
          text-align: center;
          color: white;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #333333;
        }
        .code {
          display: block;
          width: fit-content;
          margin: 20px auto;
          padding: 10px 20px;
          font-size: 24px;
          color: #ffffff;
          background-color: red;
          border: 1px solid #ffffff;
          border-radius: 4px;
          text-align: center;
          letter-spacing: 5px
        }
        .footer {
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #777777;
          background-color: #f4f4f4;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          Verification Code
        </div>
        <div class="content">
          <p>Dear User,</p>
          <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
          <span class="code">${code}</span>
          <p>This code will expire in 15 minutes. If you did not request this code, please ignore this email.</p>
          <p>Best regards,</p>
          <p>Task Ninja</p>
        </div>
        <div class="footer">
          &copy; 2024 Task Ninja. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  await transport.sendMail({
    from: process.env.EMAIL,
    to: userMail,
    subject: "Verification Code",
    text: `Your account verification code is ${code}. \n\n\n\n If you have not request this code, igonre it`,
    html: htmlContent
  });

  return;
};

export { sendMail };
