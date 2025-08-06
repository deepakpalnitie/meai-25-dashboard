# Multi-Tenant Implementation Plan

This document outlines the step-by-step plan to convert the single-project Next.js UI into a multi-tenant application.

---

### Implementation Progress

| Step | Description | Status | Details |
| :--- | :--- | :--- | :--- |
| 1 | **Create `projects.json`** | Completed | Create the configuration file at the project root to store project-specific details like `apiUrl` and `kmlUrl`. |
| 2 | **Create `middleware.js`** | Completed | Create the middleware file at the project root to inspect incoming requests and rewrite URLs based on the hostname. |
| 3 | **Refactor `pages/index.js` to `pages/project.js`** | Completed | Rename the main page, replace `getStaticProps` with `getServerSideProps` for dynamic data fetching, and update the component to render project data based on the new props structure. |
| 4 | **Update `info/multi-tenant.md`** | Completed | This file will be updated to reflect the current status of the implementation. |

---

### Detailed Steps

#### Step 1: Create `projects.json`
- **Status:** Completed
- **To-Do:**
  - Create a new file named `projects.json` in the project root.
  - Add the configuration for the MEAI project using the provided URLs.
  - Add placeholder configurations for other projects (e.g., AAI, IRCTC).
  - The structure for each project will include `name`, `location`, `apiUrl`, and `kmlUrl`.

#### Step 2: Create `middleware.js`
- **Status:** Completed
- **To-Do:**
  - Create a new file named `middleware.js` in the project root.
  - Implement the middleware function to read the hostname from the request.
  - Check if the hostname exists as a key in `projects.json`.
  - If it exists, rewrite the URL to `/project` and pass the hostname as a query parameter (`projectHostname`).
  - If not, let the request proceed without any changes.

#### Step 3: Refactor `pages/index.js` to `pages/project.js`
- **Status:** Completed
- **To-Do:**
  - Rename `pages/index.js` to `pages/project.js`.
  - Remove the existing `getStaticProps` function.
  - Implement `getServerSideProps` to:
    - Get the `projectHostname` from the query parameters.
    - Look up the project configuration in `projects.json`.
    - Fetch data from the project's `apiUrl`.
    - Fetch KML data from the project's `kmlUrl`.
    - Convert the KML data to GeoJSON.
    - Pass the project details, fetched data, and GeoJSON as props to the page component.
  - Update the `ProjectPage` component to receive the `project` prop and render the UI dynamically. This includes updating the page title, header, and all dashboard components (`DMap`, `Chart`, impact numbers) to use the new data structure.
