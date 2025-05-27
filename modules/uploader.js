const fs = require("fs");
const { google } = require("googleapis");

async function uploadVideo(filePath) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  const fileSize = fs.statSync(filePath).size;
  const fileName = filePath.split("/").pop();

  const res = await youtube.videos.insert(
    {
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: fileName,
          description: "Uploaded by KyberVision15YouTubeUploader",
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    },
    {
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / fileSize) * 100;
        process.stdout.write(`Uploading: ${progress.toFixed(2)}%\r`);
      },
    }
  );

  console.log("\nVideo ID:", res.data.id);
}

module.exports = uploadVideo;
