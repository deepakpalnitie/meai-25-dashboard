# Projected Impact Number Calculations

This document outlines how the projected environmental and economic impact numbers on the dashboard are calculated. The calculations are based on per-acre savings derived from previous project data.

The primary input for these calculations is the **Total UDP Acreage**.

---

### 1. Water Saved

- **Formula:** `Total UDP Acreage` * `3.004`
- **Unit:** Thousand Cubic Meters (TCM)
- **Description:** Each acre under the UDP program is projected to save 3,004 m³ of water per season, which is equivalent to 3.004 TCM.

### 2. Emission Reduced

- **Formula:** `Total UDP Acreage` * `1.366`
- **Unit:** metric tonne
- **Description:** The total projected reduction in carbon emissions is 1.366 metric tonne per acre. This is composed of four parts:
  - **From Urea Reduction (0.333 metric tonne per acre):** This is calculated using a Life Cycle Energy Analysis (LCEA) basis. The formula is `3.7 kg CO₂eq per kg of Urea` * `90 kg of Urea saved per acre`.
  - **From Water Savings (1 metric tonne per acre):** This is a projected saving based on previous project data.
  - **From Ground CO₂ Reduction (0.0215 metric tonne per acre):** Measured by a Testo 435-2 device on the ground, comparing UDP and Non-UDP plots.
  - **From Ground CH₄ Reduction (0.0111 metric tonne per acre):** Measured by a GC-FID instrument on the ground, comparing UDP and Non-UDP plots.

### 3. Fertilizer Saved

- **Formula:** `Total UDP Acreage` * `0.09`
- **Unit:** metric ton
- **Description:** Each acre is projected to save 2 bags of fertilizer, which is equivalent to 0.09 metric ton.

### 4. Urea Subsidy Saved

- **Formula:** `Total UDP Acreage` * `0.046`
- **Unit:** Lakh Rupees
- **Description:** The savings in urea subsidy is projected to be 0.046 Lakh Rupees per acre.


### 5. Paddy Yield Increase

- **Formula:** `Total UDP Acreage` * `0.76`
- **Unit:** metric ton
- **Description:** The projected increase in paddy yield is 0.76 metric tons per acre.
- **Calculation Breakdown:**
  - Average UDP Paddy Weight: 43.7 quintals/acre
  - Average Non-UDP Paddy Weight: 36.1 quintals/acre
  - Increase in quintals: `43.7 - 36.1 = 7.6` quintals/acre
  - Conversion to metric tons: `7.6 quintals / 10 = 0.76` metric tons/acre

### 6. Farmer Income Increase

- **Formula:** `Total UDP Acreage` * `0.38354`
- **Unit:** Lakh Rupees
- **Description:** The projected increase in farmer income is ₹0.38354 Lakh per acre.
- **Calculation Breakdown:**
  - **Increased Earnings from Paddy:**
    - UDP Earnings: `43.7 quintals * ₹2,600/quintal = ₹113,620`
    - Non-UDP Earnings: `36.1 quintals * ₹2,100/quintal = ₹75,810`
    - Increase: `₹113,620 - ₹75,810 = ₹37,810`
  - **Savings on Fertilizer:**
    - Fertilizer saved: 2 bags/acre
    - Cost per bag: ₹272
    - Savings: `2 * ₹272 = ₹544`
  - **Total Increase per Acre:**
    - Total: `₹37,810 + ₹544 = ₹38,354`
  - **Conversion to Lakh Rupees:** `₹38,354 / 100,000 = 0.38354`
