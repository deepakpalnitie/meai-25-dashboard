import fs from 'fs';
import path from 'path';

// The backend URL is stored in an environment variable for security
const BACKEND_URL = process.env.BACKEND_URL;

/**
 * Deeply merges two objects. It's used to combine default and project-specific configurations.
 * Note: This is a simple deep merge that works for plain objects and arrays.
 * @param {object} target - The target object to merge into.
 * @param {object} source - The source object to merge from.
 * @returns {object} The merged object.
 */
function mergeDeep(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default async function handler(req, res) {
  const { projectHostname } = req.query;

  if (!projectHostname) {
    return res.status(400).json({ error: 'Missing projectHostname parameter' });
  }

  try {
    // Step 1: Read projects.json to find the projectId
    const projectsFilePath = path.join(process.cwd(), 'projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsFilePath, 'utf-8'));
    
    const project = projects[projectHostname];
    if (!project) {
      return res.status(404).json({ error: `Project not found for hostname: ${projectHostname}` });
    }
    
    const projectId = project.projectId;
    const fetchUrl = `${BACKEND_URL}?projectId=${projectId}`;

    // Step 2: Fetch raw data from the Google Apps Script backend
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch project data. Status: ${response.status}`);
    }
    
    const rawData = await response.json();

    // Step 3: Read impact.json to get metric configurations
    const impactFilePath = path.join(process.cwd(), 'impact.json');
    const impactConfig = JSON.parse(fs.readFileSync(impactFilePath, 'utf-8'));

    const defaultConfig = impactConfig.defaults;
    const projectSpecificConfig = impactConfig.projects[projectId] || {};

    // Step 4: Combine default and project-specific configs
    const finalMetrics = {};
    const allMetricKeys = Object.keys(defaultConfig);

    for (const key of allMetricKeys) {
      finalMetrics[key] = mergeDeep(defaultConfig[key], projectSpecificConfig[key] || {});
    }

    // Step 5: Calculate impact numbers and select direct metrics
    const calculatedMetrics = {};
    const directMetrics = {};
    const totalAcreage = rawData?.impactData?.acreage?.total || 0;

    for (const metricKey in finalMetrics) {
      const metric = finalMetrics[metricKey];
      if (metric.enabled) {
        const metricData = {
          label: metric.label,
          value: 0,
          unit: metric.unit || '',
        };

        if (metric.type === 'calculated') {
          metricData.value = totalAcreage * metric.multiplier;
          calculatedMetrics[metricKey] = metricData;
        } else if (metric.type === 'direct') {
          // Helper to get a value from a nested path
          const getValueByPath = (obj, path) => path.split('.').reduce((res, key) => res?.[key], obj);
          metricData.value = metric.dataPath ? getValueByPath(rawData, metric.dataPath) : (rawData[metricKey] || 0);
          directMetrics[metricKey] = metricData;
        }
      }
    }

    // Step 6: Combine original data with the new metrics
    const responseData = {
      ...rawData,
      calculatedMetrics,
      directMetrics,
    };
    
    // Send the data back to the frontend
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in project-data API route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}