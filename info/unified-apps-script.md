To use a single Google Apps Script to serve data from multiple Google Sheets, you need to create a **single web app** that can dynamically access different sheets based on a parameter in the URL. This method centralizes your code, making it easy to manage.

Here are the detailed instructions to set up the system and save it as a Markdown file.

### Step 1: Create a Single Google Apps Script

First, create a new Google Apps Script. You can do this by going to `script.google.com/home/start`. This script will contain all the logic to fetch and format data from a spreadsheet.

**Apps Script Code (`Code.gs`)**
Copy and paste the following code into your new Apps Script project.

```javascript
/**
 * Main function to handle HTTP GET requests.
 * It expects a 'sheetId' parameter to identify the Google Sheet to process.
 */
function doGet(e) {
  // Check if the 'sheetId' parameter exists in the URL
  const sheetId = e.parameter.sheetId;

  if (!sheetId) {
    // Return an error if the sheetId is missing
    return ContentService.createTextOutput(JSON.stringify({ error: "Missing 'sheetId' parameter." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Open the spreadsheet using the ID provided in the URL
    const ss = SpreadsheetApp.openById(sheetId);
    
    // Get the first sheet. You can change 'Sheet1' to the actual name of your sheet.
    const sheet = ss.getSheetByName('Sheet1'); 

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Sheet with name 'Sheet1' not found." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get all data from the sheet's active range
    const range = sheet.getDataRange();
    const values = range.getValues();

    // The first row is assumed to be the headers
    const headers = values.shift();
    const data = [];

    // Map the remaining rows to an array of objects, using the headers as keys
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = row[j];
      }
      data.push(rowObject);
    }

    // Return the data as a JSON object
    const output = ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);

    return output;

  } catch (error) {
    // Catch any errors (e.g., sheet not found, access denied) and return them
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

-----

### Step 2: Deploy the Apps Script as a Web App

1.  In the Apps Script editor, click the **"Deploy"** button in the top-right corner and select **"New deployment"**.
2.  In the "Select type" dropdown, choose **"Web app"**.
3.  Fill in the deployment details:
      * **Description:** A brief note, e.g., "Web App for Multi-Sheet Data."
      * **Execute as:** Set this to **"Me"**.
      * **Who has access:** Set this to **"Anyone"**. This is crucial for your Next.js app to be able to fetch the data.
4.  Click **"Deploy"**. You will be prompted to authorize the script. Grant the necessary permissions.
5.  After a successful deployment, a modal will show your **Web app URL**. **Copy this URL.** This is the single base URL you will use for all your projects.

-----

### Step 3: Update Your Next.js Configuration

Now, update your `projects.json` file and your `getServerSideProps` logic to use this single Apps Script URL and pass the correct Spreadsheet ID.

**Updated `projects.json`**
Instead of a unique `apiUrl` for each project, each entry will have a `sheetId` which is the unique identifier of the Google Sheet. You can find this ID in the Google Sheet URL.

```json
{
  "csr-meai.distincthorizon.net": {
    "name": "MEAI Project",
    "location": "Location A",
    "sheetId": "1g93w9r0...gW1wR9t2"  // Replace with the actual Sheet ID for this project
  },
  "csr-aai.distincthorizon.net": {
    "name": "AAI Project",
    "location": "Location B",
    "sheetId": "1m0t3x4...8bN8h7q5"  // Replace with the actual Sheet ID for this project
  },
  // Add more projects here
}
```

**Next.js `getServerSideProps` Update**
In your `pages/project.js` file, modify the data fetching logic to construct the full API URL.

```javascript
// pages/project.js

// Replace with the single Web app URL you copied in Step 2
const APPS_SCRIPT_BASE_URL = "https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec"; 

import projectsConfig from '../projects.json';

export async function getServerSideProps(context) {
  const { projectHostname } = context.query;
  const project = projectsConfig[projectHostname];

  if (!project) {
    return { notFound: true };
  }

  try {
    // Construct the full API URL with the specific sheetId
    const fullApiUrl = `${APPS_SCRIPT_BASE_URL}?sheetId=${project.sheetId}`;
    
    // Fetch data from the single Apps Script web app
    const res = await fetch(fullApiUrl);
    const data = await res.json();

    return {
      props: {
        project: {
          name: project.name,
          location: project.location,
          data: data,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching data for ${projectHostname}:`, error);
    return {
      props: {
        project: {
          name: project.name,
          location: project.location,
          data: null,
          error: 'Failed to fetch project data.',
        },
      },
    };
  }
}
```

By following these steps, you will have a single, maintainable Apps Script that serves as a universal data endpoint for all your projects, eliminating the need to duplicate your code for every new Google Sheet.