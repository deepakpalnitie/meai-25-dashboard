/**
 * This is the "shim" script for the "Unified Dashboard Control Panel" Google Sheet.
 * Its purpose is to provide a reliable, INSTALLABLE trigger that can call the
 * main standalone backend script with the correct permissions.
 */

// -----------------------------------------------------------------------------
// --- PLEASE RUN THIS FUNCTION MANUALLY ONE TIME TO SET UP THE TRIGGER ---
// -----------------------------------------------------------------------------
/**
 * Deletes all old triggers and creates a new, installable onEdit trigger.
 * Running this function will force the correct authorization prompt to appear.
 */
function setupTriggers() {
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
  console.log('Old triggers deleted.');

  ScriptApp.newTrigger('handleEditTrigger')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  console.log('New installable onEdit trigger created for handleEditTrigger.');
  
  SpreadsheetApp.getActiveSpreadsheet().toast('Trigger setup complete!');
}
// -----------------------------------------------------------------------------


/**
 * The function that will be run by our INSTALLABLE onEdit trigger.
 * @param {object} e The event object from the edit.
 */
function handleEditTrigger(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const cell = range.getA1Notation();
  const value = range.getValue();
  const column = range.getColumn();

  if (sheet.getName() !== "Control Panel" || value !== true) {
    return;
  }

  // Map of cell ROWS to project IDs
  const projectRows = {
    '2': 'meai',
    '3': 'aai',
    '4': 'irctc',
    '5': 'evalueserve'
  };

  const projectId = projectRows[range.getRow()];
  if (!projectId) return;

  // Uncheck the box immediately
  range.setValue(false);

  // Check which column was clicked to decide which action to take
  if (column === 2) { // Column B is for Data Generation
    console.log(`Triggering Data Generation for ${projectId}`);
    triggerBackend(projectId, 'generate');
  } else if (column === 3) { // Column C is for KML Combination
    console.log(`Triggering KML Combination for ${projectId}`);
    triggerBackend(projectId, 'combineKml');
  } else if (column === 4) { // Column D is for KML Reset
    console.log(`Triggering KML Reset for ${projectId}`);
    triggerBackend(projectId, 'resetKml');
  }
}

/**
 * Calls the deployed Web App URL of the main script to trigger a process.
 * @param {string} projectId The project to process.
 * @param {string} action The action to perform ('generate', 'combineKml', or 'resetKml').
 */
function triggerBackend(projectId, action) {
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz_RT3XRhkgntax0Mdkjf6EgPpLd0Cvej9xEjWfKk14C44xqL61llLgHI5P2r1UoZ58nQ/exec';
  const url = `${WEB_APP_URL}?${action}=${projectId}`;
  
  try {
    const params = {
      'method': 'GET',
      'headers': { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
      'muteHttpExceptions': true
    };
    
    console.log(`Calling URL: ${url}`);
    const response = UrlFetchApp.fetch(url, params);
    console.log(`Response code: ${response.getResponseCode()}`);
    console.log(`Response body: ${response.getContentText()}`);
    
    SpreadsheetApp.getActiveSpreadsheet().toast(`Triggered ${action} for ${projectId}.`);

  } catch (e) {
    console.error(`Error triggering ${action} for ${projectId}: ${e.toString()}`);
    SpreadsheetApp.getActiveSpreadsheet().toast(`Error for ${projectId}: ${e.message}`);
  }
}