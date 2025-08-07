# DH CSR Projects Dashboard: Single Source of Truth

This document serves as the central hub for all information related to the DH CSR Projects Dashboard. It outlines the project's objectives, architecture, backend functionality, and business logic to provide a complete context for developers and stakeholders.

## 1. Project Overview

The DH CSR Projects Dashboard is a web-based platform designed to monitor and visualize data for various agricultural CSR projects. The application provides a comprehensive view of project metrics, including environmental impact data, geographical plot information via KML maps, and financial statistics.

The project is built with a **multi-tenant architecture**, allowing a single, unified codebase to serve multiple distinct projects, each with its own data source and subdomain.

**Core Technologies:**
*   **Frontend:** Next.js, Material-UI, Mapbox GL JS
*   **Backend:** Google Apps Script, Google Sheets, Google Drive
*   **Deployment:** Vercel

---

## 2. System Architecture

The application uses a multi-tenant architecture where a single codebase serves multiple distinct projects. The configuration for all projects is managed in a central file, acting as the single source of truth.

### 2.1. Single Source of Truth: `projects.json`

The `projects.json` file in the project root is the master configuration file. It contains a JSON object where each key is a project's hostname (e.g., `csr-meai.distincthorizon.net`) and the value is an object containing all configuration details for that project, including:
*   `name`: The display name of the project.
*   `projectId`: A short identifier used by the backend.
*   `sheetId`: The Google Sheet ID for the project's data.
*   `jsonFileId`: The Google Drive file ID for the generated JSON data.
*   `mediaFolderId`: The Google Drive folder ID for farmer media.
*   `kmlFileId`: The Google Drive file ID for the combined KML file.
*   `kmlUrl`: The public download URL for the combined KML file.

### 2.2. Frontend (Next.js)

The frontend is a Next.js application deployed on Vercel.
*   **`middleware.js`**: On every request, this middleware reads the hostname, finds the corresponding project in `projects.json`, and rewrites the URL to the generic `/project` page, passing the hostname as a query parameter.
*   **`pages/project.js`**: This page uses the hostname to fetch and display the correct project's data.

### 2.3. Backend (Google Apps Script)

The backend is a Google Apps Script web app (`clasp/unified-dashboard-script/`) that acts as a RESTful API. It is deployed via `clasp`.
*   **Configuration:** The script's `PROJECT_CONFIG` variable is **not** edited directly. Instead, it is updated programmatically by a local Node.js script before deployment (see Developer Workflow).
*   **Endpoints:**
    *   `?projectId=<id>`: Serves the pre-generated JSON data.
    *   `?generate=<id>`: Triggers data generation for a project.
    *   `?combineKml=<id>`: Triggers KML combination for a project.

---

## 3. Developer Workflow

### 3.1. Adding or Updating a Project

To add a new project or update an existing one:

1.  **Update `projects.json`**: Add or modify the entry for the project in the root `projects.json` file. Ensure all IDs and URLs are correct.
2.  **Update Apps Script Config**: Run the helper script from the project root to sync the changes with the Google Apps Script file:
    ```bash
    node update-apps-script-config.js
    ```
3.  **Deploy the Backend**: Push the updated configuration to Google Apps Script. This command updates the code, but does **not** make the changes live on the web app URL.
    ```bash
    cd clasp/unified-dashboard-script && clasp push
    ```
4.  **Create a New Deployment (If Required)**: If you have changed the behavior of the `doGet(e)` function (e.g., added a new URL parameter like `resetKml`), you **must** create a new deployment to make the changes live.
    *   Open the [Unified Backend Script](https://script.google.com/d/1bwJ5mrmdgWyuJZqqn_Eru6W7LDM7f0Plr6EKrGj_uv-XjkzC4Hri5DFx/edit) in the editor.
    *   Click **Deploy > New deployment**.
    *   Give it a description (e.g., "Added KML reset feature").
    *   Click **Deploy**.
5.  **Deploy the Frontend**: Commit and push your changes to Git. Vercel will automatically build and deploy the frontend.

### 3.2. Local Testing

To test a project locally, run `npm run dev` and open a project-specific URL:
*   `http://localhost:3000/project?projectHostname=csr-meai.distincthorizon.net`

---

## 4. Managing Project Data

All routine data updates, such as generating the JSON file or combining KMLs, are performed using the **[Unified Dashboard Control Panel](https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit)** Google Sheet. <!-- FIXME: Add the correct link -->

### 4.1. How to Trigger Actions

The sheet has a simple checkbox interface. To perform an action for a specific project, simply check the box in the corresponding row and column:

*   **Generate JSON Data (Column B):** Check this box to regenerate the main JSON data file from the project's "Ground Data" sheet.
*   **Combine KML Files (Column C):** Check this box to process any new KML files and add them to the combined KML file for the map. If the script times out, you can simply check the box again to continue where it left off.
*   **Reset KML File (Column D):** Check this box to completely reset the combined KML file. This will clear all existing plot data from the map and un-check all the "processed" checkboxes in the "Ground Data" sheet, allowing you to rebuild the KML from scratch.

### 4.2. Viewing Action Status and Logs

When you check a box, the action is sent to the backend script. To see the status, progress, or any potential errors:

1.  Open the **[Unified Backend Script](https://script.google.com/d/1bwJ5mrmdgWyuJZqqn_Eru6W7LDM7f0Plr6EKrGj_uv-XjkzC4Hri5DFx/edit)** in the Apps Script editor.
2.  In the left-hand menu, click on **Executions**.
3.  This will show you a list of all the times the script has been run. You can click on any execution to see the detailed logs, which will show you which files are being processed and if any errors occurred.

---

## 5. Validation Utilities

To debug issues with KML or JSON files, two validation scripts are available. They download the respective files for each project, save them locally, and report any parsing errors.

*   **KML Validator**: `node kml_validator/validate.js`
*   **JSON Validator**: `node json_validator/validate.js`

The downloaded files are saved in the `kml_validator/downloads/` and `json_validator/downloads/` directories.

---

## 5. Key Project Links


*   **Primary Account:** All assets are managed under **distincthorizon1@gmail.com**.

### Scripts & Deployment
*   **Unified Backend Script:** [Open in Editor](https://script.google.com/d/1bwJ5mrmdgWyuJZqqn_Eru6W7LDM7f0Plr6EKrGj_uv-XjkzC4Hri5DFx/edit)
*   **Control Panel Sheet:** [Link to Sheet](https://docs.google.com/spreadsheets/d/1TOc97duIT-jOYN7jkxqX_3alT2TEGuBxUJSWN2S5dCg/edit) <!-- FIXME: Add the correct link to the Control Panel Google Sheet -->
*   **Control Panel Shim Script:** [Open in Editor](https://script.google.com/d/1r9rdXbYbF-Cj3ZDEmw93mXa5t5OVDBTVS7JfWbJPTnPLQwTsYBCl1-5x/edit)
*   **Backend Web App URL:** `https://script.google.com/macros/s/AKfycbz_RT3XRhkgntax0Mdkjf6EgPpLd0Cvej9xEjWfKk14C44xqL61llLgHI5P2r1UoZ58nQ/exec`

### Project Data Files (Google Drive)
*   **MEAI Project:**
    *   Sheet: [1V--Zg14tB9SNCNfbK8uGUOAXypQStyeCKs9MOrWuzAA](https://docs.google.com/spreadsheets/d/1V--Zg14tB9SNCNfbK8uGUOAXypQStyeCKs9MOrWuzAA/edit)
    *   JSON: [1Ebykn1coBUHWdSalJzloyrFDiqnzqQaL](https://drive.google.com/file/d/1Ebykn1coBUHWdSalJzloyrFDiqnzqQaL/view)
    *   KML: [1glLFP_YF4c30odgdMjYBc___D_9KA_Zv](https://drive.google.com/file/d/1glLFP_YF4c30odgdMjYBc___D_9KA_Zv/view)
*   **AAI Project:**
    *   Sheet: [1vhM3VfaoaA5DQNTgwP8tLC5tCNGtfY0jKMiFVHgasdg](https://docs.google.com/spreadsheets/d/1vhM3VfaoaA5DQNTgwP8tLC5tCNGtfY0jKMiFVHgasdg/edit)
    *   JSON: [195R6E23ob_y5_B16NdVabfaXz_01_TJB](https://drive.google.com/file/d/195R6E23ob_y5_B16NdVabfaXz_01_TJB/view)
    *   KML: [1K1vM4yc6TcTSJQ1NGU5jwTpFiIfzO88-](https://drive.google.com/file/d/1K1vM4yc6TcTSJQ1NGU5jwTpFiIfzO88-/view)
*   **IRCTC Project:**
    *   Sheet: [19AVjHE0fBngjwgyYKZY6PEQSbnyZhVMWGba-c06D6V0](https://docs.google.com/spreadsheets/d/19AVjHE0fBngjwgyYKZY6PEQSbnyZhVMWGba-c06D6V0/edit)
    *   JSON: [1z9rpOjjzAhNcDl4TcIoxCndUdJRR4dTx](https://drive.google.com/file/d/1z9rpOjjzAhNcDl4TcIoxCndUdJRR4dTx/view)
    *   KML: [1RIqqm_QCkrX10DE9UpQdS3tcHfUuOXrI](https://drive.google.com/file/d/1RIqqm_QCkrX10DE9UpQdS3tcHfUuOXrI/view)
*   **Evalueserve Project:**
    *   Sheet: [1VrE7kmhcYVS4NkjDFHQ3snMmaPY47ONEU4Zr3ym69WQ](https://docs.google.com/spreadsheets/d/1VrE7kmhcYVS4NkjDFHQ3snMmaPY47ONEU4Zr3ym69WQ/edit)
    *   JSON: [1Hrwhu3MZ8HrpnTccwPMOZs1m6pTbsM0A](https://drive.google.com/file/d/1Hrwhu3MZ8HrpnTccwPMOZs1m6pTbsM0A/view)
    *   KML: [120qvpFy4yjhG-1oG0cr-O-R4vEiCY23X](https://drive.google.com/file/d/120qvpFy4yjhG-1oG0cr-O-R4vEiCY23X/view)

---

## 5. Local Testing

Because the application is multi-tenant, you cannot test different projects by simply visiting `http://localhost:3000`. You must simulate the behavior of the production middleware by manually adding the `projectHostname` query parameter to the URL.

1.  **Start the local development server:** `npm run dev`
2.  **Test a specific project in your browser:**
    *   **MEAI:** `http://localhost:3000/project?projectHostname=csr-meai.distincthorizon.net`
    *   **AAI:** `http://localhost:3000/project?projectHostname=csr-aai.distincthorizon.net`

---

## 6. Impact Number Calculation

The environmental and economic impact numbers displayed on the dashboard are calculated based on the **Total UDP Acreage**. For a detailed breakdown of the formulas and data sources used, please refer to the [`info/imactNumbers.md`](./imactNumbers.md) file.

---

## 7. Project Structure & Key Files

*   **`pages/project.js`**: The dynamic page that renders individual project dashboards. It uses `getServerSideProps` to fetch data based on the `projectHostname` query parameter provided by the middleware.
*   **`components/DMap.js`**: The core Mapbox GL JS component for rendering interactive maps, KML boundaries, and location markers.
*   **`lib/`**: Contains helper functions, primarily for user authentication.
*   **`info/`**: A dedicated folder for project documentation and artifacts. It contains this `README.md`, historical plans (`unified-script-plan.md`), issue logs (`issue.md`), sample data (`.kml` files), and calculation logic (`imactNumbers.md`) that chart the project's evolution.
*   **`sample-KML/`**: Contains sample KML files used for testing and development.

---

## 8. KML Validation Utility

To debug issues related to KML parsing, a validation script is available at `kml_validator/validate.js`. This utility helps diagnose problems with the combined KML files for each project.

### How it Works
The script reads the `projects.json` file, fetches the combined KML file for each project from its specified `kmlUrl`, and performs the following actions:
1.  **Downloads** the KML file from Google Drive.
2.  **Saves** a local copy to the `kml_validator/downloads/` directory.
3.  **Validates** the file by attempting to parse it as XML.
4.  **Reports** a `SUCCESS` or `FAILED` status for each project in the console.

This process allows developers to quickly identify which project's KML is malformed and inspect the downloaded file to find the source of the error.

### How to Run
To execute the validator, run the following command from the project root:
```bash
node kml_validator/validate.js
```
