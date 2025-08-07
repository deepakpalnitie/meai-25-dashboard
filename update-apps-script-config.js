
const fs = require('fs').promises;
const path = require('path');

const PROJECTS_FILE = path.join(__dirname, 'projects.json');
const APPS_SCRIPT_FILE = path.join(__dirname, 'clasp', 'unified-dashboard-script', 'Code.js');

async function main() {
  // 1. Read the new projects.json config
  const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, 'utf-8'));

  // 2. Prepare the new PROJECT_CONFIG object for Apps Script
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

  // 3. Read the existing Apps Script file
  let appsScriptContent = await fs.readFile(APPS_SCRIPT_FILE, 'utf-8');

  // 4. Replace the old PROJECT_CONFIG object with the new one
  const configString = JSON.stringify(appsScriptConfig, null, 2);
  const newAppsScriptContent = appsScriptContent.replace(
    /const PROJECT_CONFIG = {[\s\S]*?};/,
    `const PROJECT_CONFIG = ${configString};`
  );

  // 5. Write the updated content back to the Apps Script file
  await fs.writeFile(APPS_SCRIPT_FILE, newAppsScriptContent);

  console.log('Successfully updated the PROJECT_CONFIG in clasp/unified-dashboard-script/Code.js');
  console.log('You can now run `clasp push` to deploy the changes.');
}

main().catch(console.error);
