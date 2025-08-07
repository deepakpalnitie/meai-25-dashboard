

const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

const PROJECTS_FILE = path.join(__dirname, '..', 'projects.json');
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

async function main() {
  // Ensure download directory exists
  await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

  // Read project configurations
  const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, 'utf-8'));
  const projectHostnames = Object.keys(projects);

  console.log(`Found ${projectHostnames.length} projects. Starting KML validation...`);

  for (const hostname of projectHostnames) {
    const project = projects[hostname];
    const kmlUrl = project.kmlUrl;
    const kmlFileId = kmlUrl.split('id=')[1];
    const projectName = project.name.replace(/\s+/g, '_'); // Sanitize name for filename
    const downloadUrl = kmlUrl;
    const localKmlPath = path.join(DOWNLOAD_DIR, `${projectName}.kml`);

    console.log(`\n[${project.name}]`);
    console.log(` - KML File ID: ${kmlFileId}`);

    try {
      // 1. Fetch KML file
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch KML file. Status: ${response.status} ${response.statusText}`);
      }
      const kmlContent = await response.text();
      console.log(` - Successfully downloaded KML file.`);

      // 2. Save KML file locally
      await fs.writeFile(localKmlPath, kmlContent);
      console.log(` - Saved KML to: ${path.relative(process.cwd(), localKmlPath)}`);

      // 3. Validate KML file
      if (kmlContent.trim().toLowerCase().startsWith('<!doctype html')) {
        console.error(` - KML Validation: FAILED. The downloaded file is an HTML page, not a KML file.`);
        console.error(`   This usually means the Google Drive file is not shared publicly.`);
      } else {
        try {
          const parser = new XMLParser();
          const result = parser.parse(kmlContent);
          if (result && result.kml) {
            console.log(` - KML Validation: SUCCESS. Parsed successfully.`);
          } else {
            // This case might be rare if the XML is valid but not KML.
            console.warn(` - KML Validation: FAILED. The file is valid XML but does not appear to be a KML file.`);
          }
        } catch (parseError) {
          console.error(` - KML Validation: FAILED. The file is not valid XML.`);
          console.error(`   Parser Error: ${parseError.message}`);
        }
      }
    } catch (error) {
      console.error(` - KML Validation: FAILED. An error occurred.`);
      console.error(`   Error: ${error.message}`);
      if (error.code) {
        console.error(`   Code: ${error.code}`);
      }
    }
  }
}

main().catch(console.error);

