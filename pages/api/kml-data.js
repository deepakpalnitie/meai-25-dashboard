
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { projectHostname } = req.query;

  if (!projectHostname) {
    return res.status(400).send('Missing projectHostname parameter');
  }

  try {
    // Read the projects.json file to find the kmlUrl
    const projectsFilePath = path.join(process.cwd(), 'projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsFilePath, 'utf-8'));
    
    const project = projects[projectHostname];
    if (!project || !project.kmlUrl) {
      return res.status(404).send(`KML URL not found for hostname: ${projectHostname}`);
    }
    
    // Fetch KML data from the Google Drive URL
    const response = await fetch(project.kmlUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch KML file. Status: ${response.status}`);
    }
    
    const kmlText = await response.text();

    // Basic validation to ensure we received KML, not an HTML error page
    if (kmlText.trim().toLowerCase().startsWith('<!doctype html')) {
      throw new Error('Received an HTML login page instead of KML. Check file permissions.');
    }
    
    // Send the KML data back to the frontend as plain text
    res.setHeader('Content-Type', 'application/vnd.google-earth.kml+xml');
    res.status(200).send(kmlText);

  } catch (error) {
    console.error(`Error in kml-data API route for ${projectHostname}:`, error);
    res.status(500).send('Internal Server Error');
  }
}
