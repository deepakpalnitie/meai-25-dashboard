/**
 * Unified Google Apps Script for Multi-Tenant Dashboard
 * 
 * This script serves pre-generated JSON data and combines KML files for multiple projects.
 * It is designed to be triggered by a central "Control Panel" Google Sheet.
 */

// --- MASTER CONFIGURATION ---
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

function doGet(e) {
  const generateProjectId = e.parameter.generate;
  const serveProjectId = e.parameter.projectId;
  const combineKmlProjectId = e.parameter.combineKml;

  // Handle a request to generate dashboard data
  if (generateProjectId) {
    return handleGeneration(generateProjectId, generateProjectData);
  }

  // Handle a request to combine KML files
  if (combineKmlProjectId) {
    return handleGeneration(combineKmlProjectId, combineProjectKml);
  }

  // Handle a request to serve dashboard data
  if (serveProjectId) {
    if (PROJECT_CONFIG[serveProjectId]) {
      const jsonFileId = PROJECT_CONFIG[serveProjectId].jsonFileId;
      try {
        const jsonFile = DriveApp.getFileById(jsonFileId);
        const jsonData = jsonFile.getBlob().getDataAsString();
        return ContentService.createTextOutput(jsonData).setMimeType(ContentService.MimeType.JSON);
      } catch (error) {
        console.error(`Could not retrieve data for projectId '${serveProjectId}'. Error: ${error.message}`);
        return createErrorResponse(`Could not retrieve data for projectId '${serveProjectId}'. Error: ${error.message}`);
      }
    } else {
      return createErrorResponse(`Invalid projectId for serving: ${serveProjectId}`);
    }
  }

  return createErrorResponse("Missing 'projectId', 'generate', or 'combineKml' parameter.");
}

function handleGeneration(projectId, generationFunction) {
  if (PROJECT_CONFIG[projectId]) {
    try {
      generationFunction(projectId);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: `Process started for ${projectId}.` })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return createErrorResponse(`Error during process for ${projectId}: ${err.message}`);
    }
  } else {
    return createErrorResponse(`Invalid project ID for generation: ${projectId}`);
  }
}

function createErrorResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({ error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- CORE DATA PROCESSING LOGIC ---

function generateProjectData(projectId) {
  if (Array.isArray(projectId)) projectId = projectId[0];
  const config = PROJECT_CONFIG[projectId];
  if (!config) throw new Error(`Invalid projectId: ${projectId}`);

  console.log(`Starting data generation for ${projectId.toUpperCase()}.`);
  const ss = SpreadsheetApp.openById(config.sheetId);
  const shGrndData = ss.getSheetByName("Ground Data");
  const shDshbrd = ss.getSheetByName("Dashboard");
  if (!shGrndData || !shDshbrd) throw new Error(`Required sheets not found for project ${projectId}.`);

  const groundDataValues = shGrndData.getDataRange().getValues();
  const groundDataDisplayValues = shGrndData.getDataRange().getDisplayValues();
  const impactData = getImpactNumbers(shDshbrd);
  const mapData = getUDPData(shGrndData, groundDataValues, groundDataDisplayValues);
  const chartData = getChartData(shGrndData, groundDataValues);

  const finalJson = {
    "impactData": impactData,
    'mapData': { 'type': 'FeatureCollection', 'features': mapData },
    "chartData": chartData
  };

  DriveApp.getFileById(config.jsonFileId).setContent(JSON.stringify(finalJson, null, 2));
  console.log(`Successfully generated and saved data for ${projectId.toUpperCase()}.`);
}

// --- KML COMBINATION LOGIC ---

function combineProjectKml(projectId) {
  if (Array.isArray(projectId)) projectId = projectId[0];
  const config = PROJECT_CONFIG[projectId];
  if (!config) throw new Error(`Invalid projectId: ${projectId}`);

  console.log(`Starting KML combination for ${projectId.toUpperCase()}.`);
  const ss = SpreadsheetApp.openById(config.sheetId);
  const sh = ss.getSheetByName("Ground Data");
  if (!sh) throw new Error(`'Ground Data' sheet not found for project ${projectId}.`);

  const data_strt_rw = 3;
  const idRow = getIdRow(sh);
  const edtKmlCmbndCol = getColumn(idRow, "KML_CMBND");
  const colKmlFile = getColumn(idRow, "KML_FILE");
  const lRow = sh.getLastRow();

  const kmlCombinedValues = sh.getRange(data_strt_rw, edtKmlCmbndCol, lRow - data_strt_rw + 1, 1).getValues();
  const kmlFileRichTextValues = sh.getRange(data_strt_rw, colKmlFile, lRow - data_strt_rw + 1, 1).getRichTextValues();
  const placemarkRegex = /<Placemark\b[^>]*>[\s\S]*?<\/Placemark>/g;

  const combinedFile = DriveApp.getFileById(config.kmlFileId);
  let combinedData = combinedFile.getBlob().getDataAsString();
  let placemarksToAdd = [];

  for (let i = 0; i < kmlCombinedValues.length; i++) {
    if (kmlCombinedValues[i][0] == false) {
      const currentRow = data_strt_rw + i;
      const kmlUrl = kmlFileRichTextValues[i][0].getLinkUrl();
      if (kmlUrl) {
        try {
          const fileId = kmlUrl.match(/[-\w]{25,}/);
          if (fileId && fileId[0]) {
            console.log(`Processing KML for row ${currentRow}`);
            const kmlContent = DriveApp.getFileById(fileId[0]).getBlob().getDataAsString();
            const placemarks = kmlContent.match(placemarkRegex);
            if (placemarks) {
              placemarksToAdd.push(...placemarks);
              sh.getRange(currentRow, edtKmlCmbndCol).setValue(true); // Mark as combined
            }
          }
        } catch (e) {
          console.error(`Error on row ${currentRow}: ${e.toString()}`);
        }
      }
    }
  }

  if (placemarksToAdd.length > 0) {
    const insertionPoint = combinedData.lastIndexOf("</Document>");
    if (insertionPoint !== -1) {
      const newContent = combinedData.substring(0, insertionPoint) + placemarksToAdd.join('\n') + '\n</Document>\n</kml>';
      combinedFile.setContent(newContent);
      console.log(`Appended ${placemarksToAdd.length} new placemarks to combined KML for ${projectId}.`);
    }
  } else {
    console.log(`No new KML files to combine for ${projectId}.`);
  }
}


// --- HELPER & UTILITY FUNCTIONS ---

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
  op["vill_count"] = { 'total': parseInt(shDshbrd.getRange(rows["VL_CVRD"], cols["DATA_TTL"] + 1).getValue()) || 0 };
  op["frmr_count"] = { 'total': parseInt(shDshbrd.getRange(rows["FRMRS_CVRD"], cols["DATA_TTL"] + 1).getValue()) || 0 };
  op["plot_count"] = { 'total': parseInt(shDshbrd.getRange(rows["PLTS_CVRD"], cols["DATA_TTL"] + 1).getValue()) || 0 };
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
      op[villNm] = { "acreage": 0, "plotCount": 0, "farmerCount": 0, "farmerName": [] };
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

function getIdRow(sh, id_rw = 2) {
  return sh.getRange(id_rw, 1, 1, sh.getLastColumn());
}
function getIdCol(sh, id_col = 1) {
  return sh.getRange(1, id_col, sh.getLastRow(), 1);
}
function getColumn(idRow, colId) {
  const idArr = idRow.getValues()[0];
  for (let i = 0; i < idArr.length; i++) {
    if (idArr[i] == colId) return i + 1;
  }
  return -1;
}
function getRow(idCol, rowId) {
  const idArr = idCol.getValues();
  for (let i = 0; i < idArr.length; i++) {
    if (idArr[i][0] == rowId) return i + 1;
  }
  return -1;
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