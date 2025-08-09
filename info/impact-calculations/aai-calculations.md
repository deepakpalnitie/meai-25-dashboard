# AAI Project: Projected Impact Number Calculations

This document outlines how the projected environmental and economic impact numbers on the dashboard are calculated for the AAI CSR project. The calculations are based on per-acre savings derived from data specific to this project.

The primary input for these calculations is the **Total UDP Acreage** for the AAI project.

---

### 1. Water Saved

- **Formula:** `Total UDP Acreage` * `3.254`
- **Unit:** Thousand Cubic Meters (TCM)
- **Description:** Each acre under the AAI project is projected to save 3,254 m³ of water per season, which is equivalent to 3.254 TCM. This is based on an analysis of water usage data collected from farmers in the project area.

### 2. Paddy Yield Increase

- **Formula:** `Total UDP Acreage` * `0.72`
- **Unit:** metric ton
- **Description:** The projected increase in paddy yield is 0.72 metric tons per acre.
- **Calculation Breakdown:**
  - Average UDP Paddy Weight: 34.5 quintals/acre
  - Average Non-UDP Paddy Weight: 27.3 quintals/acre
  - Increase in quintals: `34.5 - 27.3 = 7.2` quintals/acre
  - Conversion to metric tons: `7.2 quintals / 10 = 0.72` metric tons/acre

### 3. Farmer Income Increase

- **Formula:** `Total UDP Acreage` * `0.11524`
- **Unit:** Lakh Rupees
- **Description:** The projected increase in farmer income is ₹0.11524 Lakh per acre.
- **Calculation Breakdown:**
  - **Increased Earnings from Paddy:**
    - UDP Earnings: `34.5 quintals * ₹1,525/quintal = ₹52,612.5`
    - Non-UDP Earnings: `27.3 quintals * ₹1,525/quintal = ₹41,632.5`
    - Increase: `₹52,612.5 - ₹41,632.5 = ₹10,980`
  - **Savings on Fertilizer:**
    - Fertilizer saved: 2 bags/acre
    - Cost per bag: ₹272
    - Savings: `2 * ₹272 = ₹544`
  - **Total Increase per Acre:**
    - Total: `₹10,980 + ₹544 = ₹11,524`
  - **Conversion to Lakh Rupees:** `₹11,524 / 100,000 = 0.11524`
