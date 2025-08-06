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
  // Delete all existing triggers for this script to avoid duplicates.
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
  console.log('Old triggers deleted.');

  // Create the new, installable trigger.
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

  if (sheet.getName() !== "Control Panel" || range.getColumn() !== 2 || value !== true) {
    return;
  }

  const triggerCells = {
    'B2': 'meai',
    'B3': 'aai',
    'B4': 'irctc',
    'B5': 'evalueserve'
  };

  const projectId = triggerCells[cell];

  if (projectId) {
    range.setValue(false);
    triggerDataGeneration(projectId);
  }
}

/**
 * Calls the deployed Web App URL of the main script to trigger data generation.
 * @param {string} projectId The project to generate data for.
 */
function triggerDataGeneration(projectId) {
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz_RT3XRhkgntax0Mdkjf6EgPpLd0Cvej9xEjWfKk14C44xqL61llLgHI5P2r1UoZ58nQ/exec';
  const url = `${WEB_APP_URL}?generate=${projectId}`;
  
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
    
    SpreadsheetApp.getActiveSpreadsheet().toast(`Triggered generation for ${projectId}.`);

  } catch (e) {
    console.error(`Error triggering generation for ${projectId}: ${e.toString()}`);
    SpreadsheetApp.getActiveSpreadsheet().toast(`Error for ${projectId}: ${e.message}`);
  }
}
