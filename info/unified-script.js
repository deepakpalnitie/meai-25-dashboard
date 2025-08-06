/**
 * Unified Google Apps Script for Multi-Tenant Dashboard
 * 
 * This script serves pre-generated JSON data for multiple projects.
 * It is designed to be deployed as a single Web App.
 * 
 * How it works:
 * 1. doGet(e): Handles GET requests. It expects a `projectId` in the URL 
 *    (e.g., .../exec?projectId=meai). It fetches the pre-generated JSON 
 *    file for that project from Google Drive and returns its content.
 * 
 * 2. generateProjectData(projectId): A manually triggered function to process
 *    a project's Google Sheet and save the output to its designated JSON file.
 * 
 * 3. onOpen(): Creates a custom menu in the Google Sheet UI to easily trigger
 *    the data generation for each project.
 */

// --- MASTER CONFIGURATION ---
// Holds all the unique IDs for each project.
const PROJECT_CONFIG = {
  'meai': {
    sheetId: '1V--Zg14tB9SNCNfbK8uGUOAXypQStyeCKs9MOrWuzAA',
    jsonFileId: '1Ebykn1coBUHWdSalJzloyrFDiqnzqQaL',
    mediaFolderId: '1NrCmuxUKyPZIWg0lHoBjkGKc4ox6LUaD',
    kmlFileId: '1glLFP_YF4c30odgdMjYBc___D_9KA_Zv'
  },
  'aai': {
    sheetId: '1vhM3VfaoaA5DQNTgwP8tLC5tCNGtfY0jKMiFVHgasdg',
    jsonFileId: '195R6E23ob_y5_B16NdVabfaXz_01_TJB',
    mediaFolderId: '1cDsaZ5RhJJGw7L7Jc2FNZfJpHhez8Jr0',
    kmlFileId: '1K1vM4yc6TcTSJQ1NGU5jwTpFiIfzO88-'
  },
  'irctc': {
    sheetId: '19AVjHE0fBngjwgyYKZY6PEQSbnyZhVMWGba-c06D6V0',
    jsonFileId: '1z9rpOjjzAhNcDl4TcIoxCndUdJRR4dTx',
    mediaFolderId: '1U7E43mskNXqiIYvmtCKQP7fqifH8MWJr',
    kmlFileId: '1RIqqm_QCkrX10DE9UpQdS3tcHfUuOXrI'
  },
  'evalueserve': {
    sheetId: '1VrE7kmhcYVS4NkjDFHQ3snMmaPY47ONEU4Zr3ym69WQ',
    jsonFileId: '1Hrwhu3MZ8HrpnTccwPMOZs1m6pTbsM0A',
    mediaFolderId: '1k12_1n2c3yV9pqeABWhwiFMfn9bqFttH',
    kmlFileId: '120qvpFy4yjhG-1oG0cr-O-R4vEiCY23X'
  }
};

// --- WEB APP ENTRY POINT ---

/**
 * Handles HTTP GET requests for the Web App.
 * @param {object} e - The event parameter containing request details.
 * @returns {ContentService.TextOutput} The JSON data for the requested project.
 */
function doGet(e) {
  const projectId = e.parameter.projectId;

  if (!projectId || !PROJECT_CONFIG[projectId]) {
    return createErrorResponse("Missing or invalid 'projectId' parameter.");
  }

  const jsonFileId = PROJECT_CONFIG[projectId].jsonFileId;

  try {
    const jsonFile = DriveApp.getFileById(jsonFileId);
    const jsonData = jsonFile.getBlob().getDataAsString();
    return ContentService.createTextOutput(jsonData).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return createErrorResponse(`Could not retrieve data for projectId '${projectId}'. Error: ${error.message}`);
  }
}

/**
 * Helper to create a standardized JSON error response.
 */
function createErrorResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({ error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}


// --- UI & MANUAL TRIGGERS ---

/**
 * Adds a custom menu to the spreadsheet UI for easy data generation.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Dashboard Actions')
    .addItem('Generate MEAI Data', 'generateMeaiData')
    .addItem('Generate AAI Data', 'generateAaiData')
    .addItem('Generate IRCTC Data', 'generateIrctcData')
    .addItem('Generate Evalueserve Data', 'generateEvalueserveData')
    .addToUi();
}

// Wrapper functions for the menu items
function generateMeaiData() {
  generateProjectData('meai');
}

function generateAaiData() {
  generateProjectData('aai');
}

function generateIrctcData() {
  generateProjectData('irctc');
}

function generateEvalueserveData() {
  generateProjectData('evalueserve');
}


// --- CORE DATA PROCESSING LOGIC ---

/**
 * Main function to generate and save the JSON data for a specific project.
 * @param {string} projectId - The ID of the project to process (e.g., 'meai').
 */
function generateProjectData(projectId) {
  const config = PROJECT_CONFIG[projectId];
  if (!config) {
    SpreadsheetApp.getUi().alert(`Invalid projectId: ${projectId}`);
    return;
  }

  SpreadsheetApp.getUi().alert(`Starting data generation for ${projectId.toUpperCase()}. This may take a moment...`);

  try {
    const ss = SpreadsheetApp.openById(config.sheetId);
    const shGrndData = ss.getSheetByName("Ground Data");
    const shDshbrd = ss.getSheetByName("Dashboard");

    const groundDataValues = shGrndData.getDataRange().getValues();
    const groundDataDisplayValues = shGrndData.getDataRange().getDisplayValues();

    const impactData = getImpactNumbers(shDshbrd);
    const mapData = getUDPData(shGrndData, groundDataValues, groundDataDisplayValues);
    const chartData = getChartData(shGrndData, groundDataValues);

    const finalJson = {
      "impactData": impactData,
      'mapData': {
        'type': 'FeatureCollection',
        'features': mapData
      },
      "chartData": chartData
    };

    const jsonFile = DriveApp.getFileById(config.jsonFileId);
    jsonFile.setContent(JSON.stringify(finalJson, null, 2));

    SpreadsheetApp.getUi().alert(`Successfully generated and saved data for ${projectId.toUpperCase()}.`);

  } catch (error) {
    SpreadsheetApp.getUi().alert(`An error occurred while generating data for ${projectId}: ${error.message}`);
    console.error(`Error generating data for ${projectId}:`, error);
  }
}


// --- HELPER FUNCTIONS (Adapted from original script) ---
// These functions are modified to accept a sheet object as a parameter.

function getImpactNumbers(shDshbrd) {
  let op = {};
  const idCol = getIdCol(shDshbrd, 1);
  const idRow = getIdRow(shDshbrd, 1);
  const cols = getCols(idRow, ["DATA_TTL", "DATA_OLD", "DATA_NW"]);
  const rows = getRows(idCol, ["TTL_ACRG", "VL_CVRD", "FRMRS_CVRD", "PLTS_CVRD"]);

  op["acreage"] = {
    'total': parseInt(shDshbrd.getRange(rows["TTL_ACRG"], cols["DATA_TTL"] + 1).getValue()) || 0,
    'old_vill': parseInt(shDshbrd.getRange(rows["TTL_ACRG"], cols["DATA_OLD"] + 1).getValue()) || 0,
    'new_vill': parseInt(shDshbrd.getRange(rows["TTL_ACRG"], cols["DATA_NW"] + 1).getValue()) || 0
  };
  op["vill_count"] = {
    'total': parseInt(shDshbrd.getRange(rows["VL_CVRD"], cols["DATA_TTL"] + 1).getValue()) || 0
  };
  op["frmr_count"] = {
    'total': parseInt(shDshbrd.getRange(rows["FRMRS_CVRD"], cols["DATA_TTL"] + 1).getValue()) || 0
  };
  op["plot_count"] = {
    'total': parseInt(shDshbrd.getRange(rows["PLTS_CVRD"], cols["DATA_TTL"] + 1).getValue()) || 0
  };
  return op;
}

function getUDPData(sh, values, valuesD) {
  const idRow = getIdRow(sh);
  const cols = getCols(idRow, ["F_NM_FRMTD", "VLG_NM", "GPS_CRDNTS", "FRMR_CNTCT", "PLOT_NO", "ADHR_NO", "PDY_VRTY", "UDP_ACRG", "DT_FRMTD", "STRT_DTTM"]);
  let op = [];

  for (let i = 2; i < values.length; i++) {
    const crdnts = values[i][cols["GPS_CRDNTS"]].toString();
    if (!crdnts) continue;

    const [lat, long] = crdnts.split(",");
    if (isNaN(parseFloat(long)) || isNaN(parseFloat(lat))) continue;

    let rw = { 'type': 'Feature' };
    rw["geometry"] = { "type": "Point", "coordinates": [parseFloat(long), parseFloat(lat)] };
    rw['village'] = values[i][cols["VLG_NM"]];

    let ppts = {
      "name": `${values[i][cols["F_NM_FRMTD"]].toString().trim()}, ${values[i][cols["PLOT_NO"]].toString().trim()}`,
      'phoneFormatted': valuesD[i][cols["FRMR_CNTCT"]],
      'phone': values[i][cols["FRMR_CNTCT"]],
      'aadhaar': values[i][cols["ADHR_NO"]] ? values[i][cols["ADHR_NO"]].toString() : "NA",
      'address': values[i][cols["VLG_NM"]],
      'paddyVariety': values[i][cols["PDY_VRTY"]],
      'UDPAcreage': values[i][cols["UDP_ACRG"]],
      'date': valuesD[i][cols["DT_FRMTD"]],
      'dateTime': valuesD[i][cols["STRT_DTTM"]]
    };
    rw["properties"] = ppts;
    op.push(rw);
  }
  return op;
}

function getChartData(sh, values) {
  const idRow = getIdRow(sh);
  const cols = getCols(idRow, ["F_NM_FRMTD", "VLG_NM", "UDP_ACRG"]);
  let op = {};

  for (let i = 2; i < values.length; i++) {
    const villNm = values[i][cols["VLG_NM"]];
    if (!villNm || villNm.trim() === "") continue;

    const frmrNmFrmtd = values[i][cols["F_NM_FRMTD"]].toString().trim();
    if (!op[villNm]) {
      op[villNm] = {
        "acreage": 0,
        "plotCount": 0,
        "farmerCount": 0,
        "farmerName": []
      };
    }
    op[villNm]["acreage"] += parseFloat(values[i][cols["UDP_ACRG"]]) || 0;
    op[villNm]["plotCount"] += 1;
    if (!op[villNm]["farmerName"].includes(frmrNmFrmtd)) {
      op[villNm]["farmerName"].push(frmrNmFrmtd);
      op[villNm]["farmerCount"] += 1;
    }
  }

  const labelsVillage = Object.keys(op).sort();
  const acreage = labelsVillage.map(v => op[v]["acreage"]);
  const farmerCount = labelsVillage.map(v => op[v]["farmerCount"]);
  const plotCount = labelsVillage.map(v => op[v]["plotCount"]);

  return { labelsVillage, acreage, farmerCount, plotCount };
}

// --- GENERIC UTILITY FUNCTIONS ---

function getIdRow(sh, id_rw = 2) {
  const lColumn = sh.getLastColumn();
  return sh.getRange(id_rw, 1, 1, lColumn);
}

function getIdCol(sh, id_col = 1) {
  const lRow = sh.getLastRow();
  return sh.getRange(1, id_col, lRow, 1);
}

function getColumn(idRow, colId) {
  const idArr = idRow.getValues()[0];
  for (let i = 0; i < idArr.length; i++) {
    if (idArr[i] == colId) return i + 1;
  }
  return -1; // Return -1 if not found
}

function getRow(idCol, rowId) {
  const idArr = idCol.getValues();
  for (let i = 0; i < idArr.length; i++) {
    if (idArr[i][0] == rowId) return i + 1;
  }
  return -1; // Return -1 if not found
}

function getCols(idRow, Idntfrs) {
  let op = {};
  for (const idnfr of Idntfrs) {
    op[idnfr] = getColumn(idRow, idnfr) - 1;
  }
  return op;
}

function getRows(idCol, Idntfrs) {
  let op = {};
  for (const idnfr of Idntfrs) {
    op[idnfr] = getRow(idCol, idnfr);
  }
  return op;
}
