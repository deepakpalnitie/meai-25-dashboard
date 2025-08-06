# Issue: Google Apps Script Fails to Request `script.external_request` Permission

## 1. Context

We have a two-script architecture:

1.  **Standalone Backend Script (`Unified Dashboard Backend`):**
    *   Contains all the main data processing logic.
    *   Is deployed as a Web App.
    *   Has a `doGet(e)` function that can either serve pre-generated JSON data (`?projectId=...`) or trigger a data generation process (`?generate=...`).
    *   Managed via `clasp` in the `unified-dashboard-script` directory.

2.  **Bound "Shim" Script (`Unified Dashboard Control Panel Shim Script`):**
    *   Is bound to a Google Sheet named "Unified Dashboard Control Panel".
    *   Its only purpose is to provide a reliable `onEdit` trigger.
    *   When a checkbox is clicked on the sheet, it calls the Web App URL of the standalone script using `UrlFetchApp.fetch` to trigger data generation.
    *   Managed via `clasp` in the `control-panel-script` directory.

## 2. The Problem

When the `onEdit` trigger fires in the bound script, the `UrlFetchApp.fetch()` call fails.

The execution log for the bound script shows the following error:
```
Exception: Specified permissions are not sufficient to call UrlFetchApp.fetch. Required permissions: https://www.googleapis.com/auth/script.external_request
```

This indicates that the bound script does not have the necessary OAuth scope to make external network calls.

## 3. What We Have Tried (The Core Issue)

The central problem is that **Google is not showing the user the authorization dialog to grant this new permission.**

We have taken the following steps to try and force the re-authorization prompt, none of which have worked:

1.  **Updated the Manifest File:** We have correctly added the required permission to the `appsscript.json` file of the bound script:
    ```json
    {
      "timeZone": "Asia/Kolkata",
      "dependencies": {},
      "exceptionLogging": "STACKDRIVER",
      "runtimeVersion": "V8",
      "oauthScopes": [
        "https://www.googleapis.com/auth/script.external_request",
        "https://www.googleapis.com/auth/spreadsheets"
      ]
    }
    ```

2.  **Pushed the Manifest:** We successfully pushed this updated manifest to the bound script project using `clasp push --force`.

3.  **Deleted and Re-created the Trigger:** We deleted the existing `onEdit` trigger and created a new one. The authorization prompt did not appear.

4.  **Created a Manual Auth Function:** We added a new function (`forceReAuthorization`) to the bound script that directly calls `UrlFetchApp.fetch()`. We then ran this function manually from the script editor. The authorization prompt still did not appear, and the execution completed without error (and without actually doing anything, because the auth flow was never triggered).

## 4. Relevant Code (Bound "Shim" Script)

This is the code currently in the bound script (`control-panel-script/Code.js`):
```javascript
function onEdit(e) {
  // ... (logic to detect checkbox click) ...
  if (projectId) {
    range.setValue(false);
    triggerDataGeneration(projectId);
  }
}

function triggerDataGeneration(projectId) {
  const WEB_APP_URL = '...'; // Correct URL is in place
  const url = `${WEB_APP_URL}?generate=${projectId}`;
  try {
    const params = {
      'method': 'GET',
      'headers': { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
      'muteHttpExceptions': true
    };
    const response = UrlFetchApp.fetch(url, params); // This is the line that fails
  } catch (e) {
    console.error('Error: ' + e.toString());
  }
}
```

The issue seems to be a stubborn caching or configuration problem on the Google side that is preventing the updated OAuth scopes in the manifest from being recognized by the authorization flow for the script's trigger.
