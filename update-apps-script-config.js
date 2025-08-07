
const fs = require('fs').promises;
const path = require('path');

const PROJECTS_FILE = path.join(__dirname, 'projects.json');
const UNIFIED_SCRIPT_FILE = path.join(__dirname, 'clasp', 'unified-dashboard-script', 'Code.js');
const CONTROL_PANEL_SCRIPT_FILE = path.join(__dirname, 'clasp', 'control-panel-script', 'Code.js');

async function main() {
  // 1. Read the new projects.json config
  const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, 'utf-8'));

  // --- Update Unified Backend Script ---
  const appsScriptConfig = {};
  for (const hostname in projects) {
    const project = projects[hostname];
    appsScriptConfig[project.projectId] = {
      sheetId: project.sheetId,
      jsonFileId: project.jsonFileId,
      mediaFolderId: project.mediaFolderId,
      kmlFileId: project.kmlFileId,
    };
  }
  let unifiedScriptContent = await fs.readFile(UNIFIED_SCRIPT_FILE, 'utf-8');
  const configString = JSON.stringify(appsScriptConfig, null, 2);
  const newUnifiedScriptContent = unifiedScriptContent.replace(
    /const PROJECT_CONFIG = {[\s\S]*?};/,
    `const PROJECT_CONFIG = ${configString};`
  );
  await fs.writeFile(UNIFIED_SCRIPT_FILE, newUnifiedScriptContent);
  console.log('Successfully updated PROJECT_CONFIG in clasp/unified-dashboard-script/Code.js');

  // --- Update Control Panel Script ---
  const projectRows = {};
  let rowIndex = 2; // Start from row 2 in the Google Sheet
  for (const hostname in projects) {
    const project = projects[hostname];
    projectRows[rowIndex.toString()] = project.projectId;
    rowIndex++;
  }
  let controlPanelScriptContent = await fs.readFile(CONTROL_PANEL_SCRIPT_FILE, 'utf-8');
  const projectRowsString = JSON.stringify(projectRows, null, 2).replace(/"(\d+)":/g, "'$1':"); // Use single quotes for keys as in original
  const newControlPanelScriptContent = controlPanelScriptContent.replace(
    /const projectRows = {[\s\S]*?};/,
    `const projectRows = ${projectRowsString};`
  );
  await fs.writeFile(CONTROL_PANEL_SCRIPT_FILE, newControlPanelScriptContent);
  console.log('Successfully updated projectRows in clasp/control-panel-script/Code.js');

  console.log('\nBoth scripts are now in sync with projects.json.');
  console.log('You can now run `clasp push` in both script directories to deploy the changes.');
}

main().catch(console.error);
