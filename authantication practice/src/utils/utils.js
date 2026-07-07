export function generateOtp(){
    return Math.floor(100000 + Math.random()* 900000).toString();
}

export function getOtpHtml(otp){
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your OTP Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, sans-serif;
      color: #1f2937;
    }
    .email-container {
      width: 100%;
      background-color: #f4f7fb;
      padding: 20px 0;
    }
    .email-card {
      width: 600px;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0,0,0,0.08);
    }
    .header {
      background-color: #0b61d4;
      padding: 24px 24px 16px;
      text-align: center;
    }
    .header-logo {
      display: inline-block;
      width: 72px;
      height: 72px;
      border-radius: 16px;
      background-color: #ffffff;
      line-height: 72px;
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      color: #0b61d4;
    }
    .content {
      padding: 32px 32px 16px;
    }
    .content p {
      margin: 0 0 16px;
      font-size: 16px;
      line-height: 1.6;
      color: #334155;
    }
    .content p.greeting {
      margin-bottom: 16px;
      font-size: 18px;
      color: #0b61d4;
    }
    .otp-box {
      background-color: #eef5ff;
      border: 1px solid #cfe2ff;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 0 auto 24px;
      max-width: 280px;
    }
    .otp-title {
      margin: 0 0 8px;
      font-size: 14px;
      color: #0b61d4;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .otp-code {
      margin: 0;
      font-size: 34px;
      font-weight: 700;
      color: #0b2144;
      letter-spacing: 2px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px 32px;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 0;
      font-size: 14px;
      line-height: 1.7;
      color: #64748b;
    }
  </style>
</head>
<body>
  <table role="presentation" class="email-container" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table role="presentation" class="email-card" cellspacing="0" cellpadding="0">
          <tr>
            <td class="header">
              <div class="header-logo">LOGO</div>
            </td>
          </tr>
          <tr>
            <td class="content">
              <p class="greeting">Hello Customer,</p>
              <p>
                Use the one-time password below to complete your action. This code expires in 10 minutes.
              </p>
              <div class="otp-box">
                <p class="otp-title">Your OTP</p>
                <p class="otp-code">${otp}</p>
              </div>
              <p>
                For your security, do not share this code with anyone.
              </p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>
                If you didn't request this OTP, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

