# Google Apps Script Deployment Instructions

This guide provides the steps to deploy the `unified-script.js` file as a new Google Web App. Since you have `clasp` set up, these instructions will focus on using it for a clean and repeatable workflow.

---

### Step 1: Create a New Project Directory

On your local machine, create a new, empty folder for your Apps Script project. This keeps it separate from your Next.js project.

```bash
mkdir unified-dashboard-script
cd unified-dashboard-script
```

### Step 2: Create a New Apps Script Project using `clasp`

1.  **Log in to `clasp` (if you haven't already):**
    ```bash
    clasp login
    ```

2.  **Create a new, standalone Apps Script project:**
    ```bash
    clasp create --type standalone --title "Unified Dashboard Backend"
    ```
    This will create a `.clasp.json` file and an `appsscript.json` file in your new directory.

### Step 3: Add Your Code

1.  **Copy the Unified Script:**
    Copy the file `D:\Deepak\DH_D\dashboard\meai-25\info\unified-script.js` into the new `unified-dashboard-script` directory you just created.

2.  **Rename the file to `Code.js`:**
    Google Apps Script requires the main script file to be named `Code.js`. Rename the file you just copied.
    *   In Windows: `ren unified-script.js Code.js`
    *   In macOS/Linux: `mv unified-script.js Code.js`

### Step 4: Push the Code to Google

Use `clasp` to upload your local `Code.js` file to the Google Apps Script project you created online.

```bash
clasp push
```
This will overwrite the default blank file on Google with your new, unified code.

### Step 5: Deploy the Web App

1.  **Open the project on Google:**
    ```bash
    clasp open
    ```
    This will open the script editor in your web browser.

2.  **Run a First-Time Manual Generation (Recommended):**
    Before deploying, it's a good idea to generate the data for at least one project to ensure the script has the necessary permissions.
    *   In the script editor, find the "Select function" dropdown at the top.
    *   Choose `generateMeaiData` and click **"Run"**.
    *   A popup will appear asking for **"Authorization required"**. Click **"Review permissions"**.
    *   Choose your Google account.
    *   You will see a "Google hasn’t verified this app" warning. This is normal. Click **"Advanced"**, and then click **"Go to Unified Dashboard Backend (unsafe)"**.
    *   Review the permissions (it will need to manage your Spreadsheets and Drive files) and click **"Allow"**.
    *   The script will run. You can check the "Executions" log to see its progress.

3.  **Create the Deployment:**
    *   At the top right, click the **"Deploy"** button and select **"New deployment"**.
    *   Click the gear icon next to "Select type" and choose **"Web app"**.
    *   Fill in the details:
        *   **Description:** `Unified API for Dashboards`
        *   **Execute as:** `Me`
        *   **Who has access:** `Anyone` (This is critical for Vercel to be able to call it)
    *   Click **"Deploy"**.

### Step 6: Get the Web App URL

After deployment, a modal will appear with your new **Web app URL**. It will look like:
`https://script.google.com/macros/s/A_VERY_LONG_ID/exec`

**This URL is the final piece of information I need.**

---

### Next Steps

Once you have successfully deployed the script and have the new Web App URL, please provide it to me. I will then proceed with **Step 4** of our plan: updating the Next.js project to use your new, unified backend.
