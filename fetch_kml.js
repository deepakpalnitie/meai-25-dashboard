const https = require('https');
const fs = require('fs');
const { URL } = require('url');

let urlStr = process.argv[2];
let outputFile = process.argv[3];

if (!urlStr || !outputFile) {
  console.error('Usage: node fetch_kml.js <URL> <outputFile>');
  process.exit(1);
}

// Clean up arguments that might have extra quotes from shell
if (urlStr.startsWith('"') && urlStr.endsWith('"')) {
  urlStr = urlStr.substring(1, urlStr.length - 1);
}
if (outputFile.startsWith('"') && outputFile.endsWith('"')) {
  outputFile = outputFile.substring(1, outputFile.length - 1);
}


const options = new URL(urlStr);

const request = https.get(options, (res) => {
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    // Handle redirect
    const redirectUrl = new URL(res.headers.location, urlStr).href;
    console.log(`Redirecting to ${redirectUrl}`);
    // Make a new request to the redirected URL
    const newRequest = https.get(redirectUrl, (newRes) => {
      const fileStream = fs.createWriteStream(outputFile);
      newRes.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded and saved to ${outputFile}`);
      });
    });
    newRequest.on('error', (err) => {
      console.error('Error in redirected request:', err.message);
    });
    return;
  }

  const fileStream = fs.createWriteStream(outputFile);
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    fileStream.close();
    console.log(`Downloaded and saved to ${outputFile}`);
  });
});

request.on('error', (err) => {
  console.error('Error:', err.message);
});