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

### 2.3. Displaying Percentages

For any calculated impact number, you can choose to display a percentage value instead of the calculated value. To do this, add a `"percentage"` key to the metric's configuration within a specific project in your `impact.json` file.

**Example:**

To show `fertilizerSaved` as 66% and `waterSaved` as 38.3% for the `aai` project, you would modify the `aai` project configuration in `impact.json` like this:

```json
"aai": {
  "fertilizerSaved": {
    "enabled": true,
    "percentage": 66
  },
  "waterSaved": {
    "multiplier": 3.254,
    "percentage": 38.3
  }
}
```

When the `"percentage"` key is present, the dashboard will display the percentage value with a '%' sign and hide the unit. If the key is not present, it will fall back to showing the calculated value and its unit.

### 2.4. Overriding Calculated Values

For metrics where you want to display a fixed, pre-determined value instead of a dynamically calculated one, you can use the `value` key. This is useful for constants or pre-calculated metrics.

When the `value` key is present in a metric's configuration for a project, the system will display that value directly and will ignore the `multiplier`. You should also provide a `unit` to ensure the label is accurate.

**Example:**

To set "Farmer Income Increase" to a fixed value of "10000 Rs per acre", you would modify the configuration in `impact.json` as follows:

```json
"aai": {
  "farmerIncomeIncrease": {
    "label": "Farmer Income Increase (projected)",
    "value": 10000,
    "unit": "Rs per acre"
  }
}
```

This gives you the flexibility to mix dynamically calculated metrics and fixed-value metrics within the same project.

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
