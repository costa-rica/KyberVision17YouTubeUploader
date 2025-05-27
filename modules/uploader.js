const fs = require("fs");
const { google } = require("googleapis");
const { Video } = require("kybervision15db");
async function uploadVideo(filePath, videoId) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
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

  await Video.update(
    { youTubeVideoId: res.data.id },
    { where: { id: videoId } }
  );
}

module.exports = uploadVideo;
