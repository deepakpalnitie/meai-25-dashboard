# Impact Number & Metric Management

This document explains the dynamic system for managing and displaying impact numbers and other key metrics on the dashboard. The system is designed for flexibility, allowing project-specific control over which data points are shown.

For a detailed breakdown of how each impact number formula was derived, please see the [Projected Impact Number Calculations](./imactNumbers.md) document.

---

## 1. Permanent Metrics

Two key metrics are permanently displayed for every project and cannot be disabled:

*   **Total UDP Acreage**
*   **Villages Impacted**

---

## 2. Configurable Metrics & Impact Numbers

All other metrics and impact numbers can be configured on a per-project basis in the `projects.json` file.

### 2.1. Configuring Additional Metrics

To display additional, non-calculated metrics, add a `metrics` array to the project's configuration object.

**Available `metrics` Keys:**

*   `farmersServed`
*   `plotsCovered`

### 2.2. Configuring Impact Numbers

To display projected impact numbers, add an `impactNumbers` array to the project's configuration object. The order of the keys in this array determines the order in which the cards appear on the dashboard.

**Available `impactNumbers` Keys:**

*   `waterSaved`
*   `emissionReduced`
*   `fertilizerSaved`
*   `ureaSubsidySaved`
*   `paddyYieldIncrease`
*   `farmerIncomeIncrease`

---

## 3. Example Configuration

Below is an example of how to use these arrays in `projects.json`.

```json
{
  "csr-meai.distincthorizon.net": {
    "name": "MEAI CSR Project, 2025",
    "...": "...",
    "metrics": [
      "farmersServed",
      "plotsCovered"
    ],
    "impactNumbers": [
      "waterSaved",
      "emissionReduced",
      "farmerIncomeIncrease"
    ]
  },
  "csr-aai.distincthorizon.net": {
    "name": "AAI CSR Project, 2025",
    "...": "...",
    "metrics": [
      "farmersServed"
    ],
    "impactNumbers": [
      "paddyYieldIncrease",
      "farmerIncomeIncrease"
    ]
  },
  "csr-evalueserve.distincthorizon.net": {
    "name": "Evalueserve CSR Project, 2025",
    "...": "...",
    "impactNumbers": [
      "waterSaved"
    ]
  }
}
```

*   If the `metrics` array is omitted, no additional metrics will be shown.
*   If the `impactNumbers` array is omitted, no projected impact numbers will be shown.