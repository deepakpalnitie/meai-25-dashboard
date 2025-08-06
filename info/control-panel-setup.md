# Final Control Panel & Trigger Setup

This is the final set of instructions to get your backend working. This guide uses the new two-script architecture.

---

### Step 1: Create the "Control Panel" Google Sheet

1.  Go to [sheets.new](https://sheets.new) to create a new, blank Google Sheet.
2.  Rename the spreadsheet to **"Unified Dashboard Control Panel"**.
3.  Rename the first sheet (at the bottom) from `Sheet1` to **`Control Panel`**.
4.  Set up the cells exactly as follows:

| | **A** | **B** |
| :--- | :--- | :--- |
| **1** | **Project Name** | **Generate Data** |
| **2** | MEAI | |
| **3** | AAI | |
| **4** | IRCTC | |
| **5** | Evalueserve | |

5.  Select cells `B2` through `B5` and go to the menu **Insert > Checkbox**.

### Step 2: Add the "Shim" Script to the Sheet

1.  With your "Unified Dashboard Control Panel" sheet open, go to the menu **Extensions > Apps Script**. A new script editor window will open. This script is **bound** to your sheet.
2.  Delete any default code in the `Code.gs` file.
3.  I have created the necessary shim script for you at `D:\Deepak\DH_D\dashboard\meai-25\info\control-panel-script.js`. Please **open this file**, copy its entire contents.
4.  **Paste** the copied code into the bound script editor you just opened.
5.  Click the **Save project** icon.

### Step 3: Set Up the `onEdit` Trigger

1.  While still in the bound script editor for your sheet, click the **Triggers** icon (alarm clock) on the left sidebar.
2.  Click the **"+ Add Trigger"** button in the bottom right.
3.  Configure the trigger with the following settings:
    *   **Choose which function to run:** `onEdit`
    *   **Choose which deployment should run:** `Head`
    *   **Select event source:** `From spreadsheet`
    *   **Select event type:** `On edit`
4.  Click **"Save"**. You will be asked to grant permissions for this script to connect to the external standalone script. Please allow it.

### Step 4: Final Verification

Your system is now fully configured.

1.  Go to your **"Unified Dashboard Control Panel"** sheet.
2.  Click the checkbox in cell `B2` to generate the data for the **MEAI** project.
3.  Go to the **standalone** "Unified Dashboard Backend" project and click on its **"Executions"** log.
4.  You should see a new execution that was started by your control panel. It should complete successfully.

---

### Next Steps

Once you have completed and verified these steps, please tell me to **"continue"**. I will perform the final step of integrating the frontend with your new backend.