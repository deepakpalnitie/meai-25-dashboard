# Unified Backend Implementation Plan

This document outlines the full plan to transition from multiple single-purpose scripts to a single, unified Google Apps Script backend. It includes verification steps for each stage to ensure functionality.

**Last Updated:** August 6, 2025

---
### **V4: Final Two-Script Architecture (Standalone + Bound)**

This version of the plan reflects the final, correct architecture. It uses a main **standalone script** for all logic and a small **bound script** on a "Control Panel" sheet to provide a reliable `onEdit` trigger. This is the most robust and professional solution.

| Step | Description | Status |
| :--- | :--- | :--- |
| 1 | **Initial Setup & Analysis** | Completed |
| 2 | **Cloned `clasp` Project** | Completed |
| 3 | **Final Standalone Script Creation** | Completed |
| 4 | **Bound "Shim" Script Creation** | In Progress |
| 5 | **Control Panel & Trigger Setup** | Not Started |
| 6 | **Frontend Integration** | Not Started |
| 7 | **Final Production Deployment** | Not Started |

---

### Detailed Steps & Verification

#### **Step 1-3: Initial Setup, `clasp` Clone, and Standalone Script**
- **Status:** Completed
- **Details:** All initial analysis, project setup, and the creation of the main `Code.js` file in the `unified-dashboard-script` directory are complete and correct.

---

#### **Step 4: Bound "Shim" Script Creation**
- **Status:** In Progress
- **My Action:**
  - I will create a new file, `info/control-panel-script.js`, containing the small `onEdit` and `callBackend` functions.
- **Your Action:**
  - You will copy the code from this new file into the bound script editor of your "Unified Dashboard Control Panel" sheet.

---

#### **Step 5: Control Panel & Trigger Setup**
- **Status:** Not Started
- **Your Action:**
  - Follow the updated instructions in `info/control-panel-setup.md` to create the sheet, paste the shim code, and set the `onEdit` trigger from the bound script editor.
- **✅ How to Verify This Step:**
  - Check a box in the "Control Panel" sheet.
  - Go to the **standalone** "Unified Dashboard Backend" project and check its "Executions" log.
  - **Expected Result:** You should see a successful execution triggered by the bound script, with logs showing the correct `projectId` being processed.

---

#### **Step 6: Frontend Integration**
- **Status:** Not Started
- **My Action (After you confirm Step 5 is working):**
  - I will update `pages/project.js` to call your unified Web App URL.
- **✅ How to Verify This Step:**
  - Run `npm run dev` and test the project URLs (`http://localhost:3000/project?projectHostname=...`).
  - **Expected Result:** The dashboard should load correctly for each project.

---

#### **Step 7: Final Production Deployment**
- **Status:** Not Started
- **Your Action:**
  - Commit all changed files to GitHub.
- **✅ How to Verify This Step:**
  - Navigate to your live project subdomains.
  - **Expected Result:** Each live domain should display the correct, fully functional dashboard.
