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

## 2. Multi-Tenant Architecture & Deployment

The application uses a single Next.js codebase deployed on one Vercel project to serve multiple subdomains (e.g., `csr-meai.distincthorizon.net`, `csr-aai.distincthorizon.net`).

*   **`projects.json`**: This file at the project root is the configuration hub for the multi-tenant setup. It maps each project's unique hostname to its specific backend details, such as Google Sheet IDs and KML file IDs.

*   **`middleware.js`**: This Next.js middleware runs on every incoming request. It inspects the request's hostname, looks it up in `projects.json`, and rewrites the URL to a generic `/project` page. The original hostname is passed as a query parameter, allowing the page to dynamically fetch and display the correct project's data.

*   **Vercel Deployment**: All project subdomains are configured on Vercel with CNAME records pointing to `771242483e90c739.vercel-dns-017.com`. This routes all traffic to the single deployment. For detailed setup instructions, see [`info/vercel.md`](./vercel.md).

---

## 3. Backend Architecture & Functionality

The backend is powered by a sophisticated two-script Google Apps Script system that automates data processing and serves data to the frontend. All backend assets are controlled by the **distincthorizon1@gmail.com** Google account.

### 3.1. Core Components

1.  **`clasp/unified-dashboard-script/`**: The main, standalone backend script deployed as a Google Web App. It acts as a centralized RESTful API. Its `doGet(e)` function can perform three main actions based on URL parameters:
    *   `?projectId=<id>`: Serves the pre-generated JSON data for the specified project.
    *   `?generate=<id>`: Triggers the data generation process for a project.
    *   `?combineKml=<id>`: Triggers the KML combination process for a project.

2.  **`clasp/control-panel-script/`**: A "shim" script bound to a "Unified Dashboard Control Panel" Google Sheet. This sheet provides a simple UI for non-technical users. By checking a box, an `onEdit` trigger fires, which calls the main script's Web App URL via `UrlFetchApp.fetch()` to initiate data generation or KML combination.

### 3.2. Key Automated Features

The backend scripts contain logic for a high degree of automation:

*   **Automated Data Processing**: An `onEdit` trigger in the master "Ground Data" Google Sheet can process a row automatically. This script can:
    *   Find a corresponding farmer folder in Google Drive.
    *   Extract and link to multimedia files and Aadhaar PDFs within that folder.
    *   Find the correct KML file based on a plot number.
    *   Calculate the plot area in acres from the KML coordinates.
    *   Extract the plot's central GPS coordinates from the KML.

*   **KML Processing**: The backend can combine thousands of individual farmer KML files into a single, optimized file for the map. It automatically validates and fixes common issues, such as unclosed polygons, before appending them. A reset function also exists to rebuild this combined file from scratch.

*   **Utility Functions**: The script includes helper functions for data validation, such as `findKMLDuplicates`, which identifies potentially duplicate plots by calculating the geographic distance between their GPS coordinates.

---

## 4. Key Project Links

*   **Primary Account:** All assets are managed under **distincthorizon1@gmail.com**.

### Scripts & Deployment
*   **Unified Backend Script:** [Open in Editor](https://script.google.com/d/1bwJ5mrmdgWyuJZqqn_Eru6W7LDM7f0Plr6EKrGj_uv-XjkzC4Hri5DFx/edit)
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
