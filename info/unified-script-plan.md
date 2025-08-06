# Unified Apps Script Implementation Plan

This document outlines the step-by-step plan to create a single, unified Google Apps Script that can serve data from multiple Google Sheets to the multi-tenant Next.js application.

**Last Updated:** August 6, 2025

---

### Implementation Progress

| Step | Description | Status | Details |
| :--- | :--- | :--- | :--- |
| 1 | **Analyze Existing MEAI Script** | Completed | Reviewed `info/apps-script.js` to understand its pre-generation logic and the required JSON output structure. The plan has been updated based on these findings. |
| 2 | **Create Unified Apps Script** | Completed | Created `info/unified-script.js` with the combined logic and configuration for all four projects (MEAI, AAI, IRCTC, Evalueserve). |
| 3 | **Deploy New Script** | In Progress | The user needs to deploy the new script as a Web App and provide the new base URL. Instructions have been provided in `deployment-steps.md`. |
| 4 | **Update Next.js Project** | Not Started | Refactor `projects.json` and `pages/project.js` to use the new unified API endpoint. |

---

### Detailed Steps

#### Step 1: Analyze Existing MEAI Script
- **Status:** Completed
- **Findings:**
  - The script uses a **pre-generation** model. A trigger function (`createWebJsonFile`) reads the sheet, processes the data, and saves it to a static JSON file in Google Drive.
  - The `doGet(e)` function simply serves this pre-generated file. This is a performance-oriented approach that the unified script must also follow.
  - The JSON output has a specific structure (`impactData`, `mapData`, `chartData`) that must be maintained for compatibility with the frontend.
- **Conclusion:** The implementation plan has been revised to incorporate this pre-generation pattern.

#### Step 2: Create Unified Apps Script
- **Status:** Completed
- **To-Do:**
  - Create a new file: `unified-script.js`.
  - The script will have a central configuration object mapping a `projectId` to its corresponding `sheetId` and a unique `jsonFileId`.
  - It will contain two main functions:
    1.  `doGet(e)`: This will read the `projectId` from the request, find the corresponding `jsonFileId` from the config, and serve the content of that JSON file.
    2.  `generateProjectData(projectId)`: A master function that can be triggered to generate the data for a specific project. It will read the correct sheet, perform all calculations, and update the correct JSON file in Drive.
- **Action Items for User:**
  - **Please provide the Google Sheet ID for the AAI project.** - **Done**
  - **Please provide the Google Sheet ID for the IRCTC project.** - **Done**
  - **For EACH new project (AAI, IRCTC), please create a new, blank text file in Google Drive, name it appropriately (e.g., `aai_dashboard_data.json`), and provide the File ID for each one.** - **Done**

#### Step 3: Deploy New Script
- **Status:** In Progress
- **To-Do (for User):**
  - Once `unified-script.js` is complete, create a new Google Apps Script project.
  - Paste the code from the completed `unified-script.js` into it.
  - Deploy the script as a Web App, ensuring "Who has access" is set to "Anyone".
- **Action Item for User:**
  - **Deploy the script and provide the new Web App URL.**

#### Step 4: Update Next.js Project
- **Status:** Not Started
- **To-Do:**
  - Modify `projects.json` to use a `projectId` and a `kmlUrl`.
  - Update `getServerSideProps` in `pages/project.js` to construct the API request using the new base URL and the `projectId`. The KML fetching logic will remain the same.
