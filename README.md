# KyberVision16YouTubeUploader

## Using the app

### 1. Set up YouTube account / upload API OAuth 2.0 (one time)

- must get client_id and client_secret from Google Cloud Console
- get credentials for desktop app
- add test user to YouTube account
- you will get a file that looks like: client_secret_12345abce.apps.googleusercontent.com.json
- move this file to the authJsonFiles directory and rename it to client_secret.json

### 2. Authorize (one time)

- use authorize.js
- terminal command `node authorize.js`
- browser page will open. Select the user that
- this will create a token.json file in the authJsonFiles directory

### 3. Upload

- use index.js
- terminal command `node index.js --filename <filename>`

## Install

```bash
yarn install
yarn add googleapis dotenv yargs
```

## env

```bash
PATH_VIDEOS_UPLOADED=/Users/yourname/VideosToUpload
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=your_redirect_uri
REFRESH_TOKEN=your_refresh_token
```
