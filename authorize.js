const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
// const minimist = require("minimist");

// Load environment variables from .env file
dotenv.config();

// Define the YouTube API scopes required for uploading videos
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly", // Useful for checking existing videos
];

// Path to the directory containing video files
const VIDEOS_DIR = process.env.PATH_VIDEOS_UPLOADED;

// Path to store the user's credentials (token.json)
const TOKEN_PATH = path.join(process.cwd(), "authJsonFiles", "token.json");
// Path to your client secret file (downloaded from Google Cloud)
const CLIENT_SECRET_PATH = path.join(
  process.cwd(),
  "authJsonFiles",
  "client_secret.json"
);

/**
 * Authorizes the client and loads credentials.
 * If no valid token exists, it prompts the user for authorization.
 * @returns {Promise<OAuth2Client>} A Promise that resolves with the authorized OAuth2 client.
 */
async function authorize() {
  let client;
  try {
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CLIENT_SECRET_PATH,
      tokenPath: TOKEN_PATH,
    });
    console.log("Authorization successful!");

    // Save credentials manually if token.json doesn't exist
    const credentials = client.credentials;
    if (!fs.existsSync(TOKEN_PATH) && credentials.refresh_token) {
      const payload = {
        type: "authorized_user",
        client_id: client._clientId,
        client_secret: client._clientSecret,
        refresh_token: credentials.refresh_token,
      };

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(payload, null, 2));
      console.log("Saved credentials to token.json");
    } else {
      console.log("Token already exists or no refresh token found.");
    }
    return client;
  } catch (error) {
    console.error("Error during authorization:", error.message);
    // If authentication fails, delete token.json to force re-authentication next time
    if (fs.existsSync(TOKEN_PATH)) {
      fs.unlinkSync(TOKEN_PATH);
      console.log("Deleted existing token.json to force re-authentication.");
    }
    throw error; // Re-throw to propagate the error
  }
}

authorize();
