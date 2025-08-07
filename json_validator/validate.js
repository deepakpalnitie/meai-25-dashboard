

const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

const PROJECTS_FILE = path.join(__dirname, '..', 'projects.json');
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

async function main() {
  // Ensure download directory exists
  await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

  // Read project configurations
  const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, 'utf-8'));
  const projectHostnames = Object.keys(projects);

  console.log(`Found ${projectHostnames.length} projects. Starting JSON validation...`);

  for (const hostname of projectHostnames) {
    const project = projects[hostname];
    const jsonFileId = project.jsonFileId;
    const projectName = project.name.replace(/\s+/g, '_'); // Sanitize name for filename
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${jsonFileId}`;
    const localJsonPath = path.join(DOWNLOAD_DIR, `${projectName}.json`);

    console.log(`\n[${project.name}]`);
    console.log(` - JSON File ID: ${jsonFileId}`);

    try {
      // 1. Fetch JSON file
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON file. Status: ${response.status} ${response.statusText}`);
      }
      const jsonContent = await response.text();
      console.log(` - Successfully downloaded JSON file.`);

      // 2. Save JSON file locally
      await fs.writeFile(localJsonPath, jsonContent);
      console.log(` - Saved JSON to: ${path.relative(process.cwd(), localJsonPath)}`);

      // 3. Validate JSON file
      if (jsonContent.trim().toLowerCase().startsWith('<!doctype html')) {
        console.error(` - JSON Validation: FAILED. The downloaded file is an HTML page, not a JSON file.`);
        console.error(`   This usually means the Google Drive file is not shared publicly.`);
      } else {
        try {
          JSON.parse(jsonContent);
          console.log(` - JSON Validation: SUCCESS. Parsed successfully.`);
        } catch (parseError) {
          console.error(` - JSON Validation: FAILED. The file is not valid JSON.`);
          console.error(`   Parser Error: ${parseError.message}`);
        }
      }
    } catch (error) {
      console.error(` - JSON Validation: FAILED. An error occurred.`);
      console.error(`   Error: ${error.message}`);
      if (error.code) {
        console.error(`   Code: ${error.code}`);
      }
    }
  }
}

main().catch(console.error);

