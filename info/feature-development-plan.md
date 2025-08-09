# Feature Development Plan

This document tracks the implementation of new features.

---

### Granular Impact Number Control

**Objective:** To provide granular control over which impact numbers are displayed for each project, defined directly in `projects.json`.

**Status:** ✅ Completed

| Step | Status | Details |
| :--- | :--- | :--- |
| **1. Centralize Impact Definitions** | ✅ Completed | Create `impact.json` to define all available impact numbers, including `label`, `unit`, and `formula`. This will act as the single source of truth for calculations. |
| **2. Update `projects.json` Schema** | ✅ Completed | Add a new `impactNumbers` array to each project in `projects.json`. This array will list the keys (from `impact.json`) of the numbers to display for that project. |
| **3. Refactor Frontend Component** | ✅ Completed | Modify the frontend to read the `impactNumbers` array from the project's config, look up the details in `impact.json`, perform the calculation, and render the components dynamically. |
| **4. Update Documentation** | ✅ Completed | Create `info/impact-number-management.md` and link it to the main `README.md` and `info/imactNumbers.md` to reflect the new system. |
