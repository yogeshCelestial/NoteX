export const htmlBody = (origin: string) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Account Created - NoteX</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        color: #333333;
        margin-bottom: 20px;
      }
      .message {
        font-size: 16px;
        color: #555555;
        margin-bottom: 20px;
      }
      .login-button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #000000;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Account Created on NoteX</div>
      <div class="message">
        You have successfully registered on <strong>NoteX</strong>.<br />
        Please login using the button below:
      </div>
      <a class="login-button" href="${origin}/login">Login to NoteX</a>
      <div class="footer">
        If you did not register for this account, you can ignore this email.
      </div>
    </div>
  </body>
</html>`;
}
