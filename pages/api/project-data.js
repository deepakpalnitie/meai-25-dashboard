
import fs from 'fs';
import path from 'path';

// The backend URL is stored in an environment variable for security
const BACKEND_URL = process.env.BACKEND_URL;

export default async function handler(req, res) {
  const { projectHostname } = req.query;

  if (!projectHostname) {
    return res.status(400).json({ error: 'Missing projectHostname parameter' });
  }

  try {
    // Read the projects.json file to find the projectId
    const projectsFilePath = path.join(process.cwd(), 'projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsFilePath, 'utf-8'));
    
    const project = projects[projectHostname];
    if (!project) {
      return res.status(404).json({ error: `Project not found for hostname: ${projectHostname}` });
    }
    
    const projectId = project.projectId;
    const fetchUrl = `${BACKEND_URL}?projectId=${projectId}`;

    // Fetch data from the Google Apps Script backend
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch project data. Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Send the data back to the frontend
    res.status(200).json(data);

  } catch (error) {
    console.error('Error in project-data API route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
