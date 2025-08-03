# Projected Impact Number Calculations

This document outlines how the projected environmental and economic impact numbers on the dashboard are calculated. The calculations are based on per-acre savings derived from previous project data.

The primary input for these calculations is the **Total UDP Acreage**.

---

### 1. Water Saved

- **Formula:** `Total UDP Acreage` * `3004`
- **Unit:** cubic meters (m³)
- **Description:** Each acre under the UDP program is projected to save 3,004 m³ of water per season.

### 2. Emission Reduced

- **Formula:** `Total UDP Acreage` * `1366`
- **Unit:** kilograms of CO₂ equivalent (kg CO₂eq)
- **Description:** The total projected reduction in carbon emissions is 1366 kg CO₂eq per acre. This projection is based on data from a previous project of 930 acres. The reduction is composed of four parts:
  - **From Urea Reduction (333 kg CO₂eq per acre):** This is calculated using a Life Cycle Energy Analysis (LCEA) basis. The formula is `3.7 kg CO₂eq per kg of Urea` * `90 kg of Urea saved per acre`.
  - **From Water Savings (1000 kg CO₂eq per acre):** This is a projected saving based on previous project data.
  - **From Ground CO₂ Reduction (21.5 kg CO₂eq per acre):** Measured by a Testo 435-2 device on the ground, comparing UDP and Non-UDP plots.
  - **From Ground CH₄ Reduction (11.1 kg CO₂eq per acre):** Measured by a GC-FID instrument on the ground, comparing UDP and Non-UDP plots.

### 3. Fertilizer Saved

- **Formula:** `Total UDP Acreage` * `90`
- **Unit:** kilograms (kg)
- **Description:** Each acre is projected to save 2 bags of fertilizer, which is equivalent to 90 kg.

### 4. Urea Subsidy Saved

- **Formula:** `Total UDP Acreage` * `4600`
- **Unit:** Indian Rupees (₹)
- **Description:** The savings in urea subsidy is projected to be ₹4,600 per acre.
