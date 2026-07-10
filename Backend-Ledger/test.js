require("dotenv").config();
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

(async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    console.log("Access Token:", accessToken.token);
  } catch (err) {
    console.error("ERROR:", err);
  }
})();