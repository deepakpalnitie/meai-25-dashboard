/**
 * This is the "shim" script for the "Unified Dashboard Control Panel" Google Sheet.
 * Its only purpose is to detect an edit on the sheet and call the main,
 * standalone "Unified Dashboard Backend" script's Web App URL to trigger generation.
 */

/**
 * The installable onEdit trigger function.
 * @param {object} e The event object from the edit.
 */
function onEdit(e) {
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
    // Uncheck the box immediately
    range.setValue(false);
    // Call the Web App URL to trigger the generation
    triggerDataGeneration(projectId);
  }
}

/**
 * Calls the deployed Web App URL of the main script to trigger data generation.
 * @param {string} projectId The project to generate data for.
 */
function triggerDataGeneration(projectId) {
  // This is the Web App URL of your main "Unified Dashboard Backend" script.
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz_RT3XRhkgntax0Mdkjf6EgPpLd0Cvej9xEjWfKk14C44xqL61llLgHI5P2r1UoZ58nQ/exec';
  
  const url = `${WEB_APP_URL}?generate=${projectId}`;
  
  try {
    // We need to add a header for authorization
    const params = {
      'method': 'GET',
      'headers': {
        'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
      },
      'muteHttpExceptions': true // Prevents script from stopping on HTTP errors
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