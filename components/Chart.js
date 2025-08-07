import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const optionsDate = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    // legend: {
    //   position: 'top' as const,
    // },
    title: {
      display: true,
      text: 'Area covered vs Date ',
    },
  },
};

const labelsDate = ['17/07/23', '18/07/23', '19/07/23', '20/07/23', '21/07/23', '22/07/23', '23/07/23', '24/07/23', '25/07/23', '26/07/23'];

export const dataDate = {
  labels: labelsDate,
  datasets: [
    {
      label: 'Acreage',
      data: [1.5, 2, 2, 5, 5.5, 6, 3.5, 7, 13, 15],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};

export const optionsVillage = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    // legend: {
    //   position: 'top' as const,
    // },
    title: {
      display: true,
      text: 'Village-wise (Acreage, Farmers & Plots)',
    },
  },
};

const labelsVillage = ['Atohan', 'Bamni Khera', 'Bhupgarh', 'Deeghot', 'Hosangabad', 'Likhi', 'Maachhipura', 'Mohammadpur', 'Palri', 'Phoolwari', 'Pingore', 'Siya'];
export const dataVillage = {
  labels: labelsVillage,
  datasets: [
    {
      label: 'Acreage',
      data: [10.5, 5.5, 5.0, 3.0, 3.0, 5.0, 4.5, 4.0, 4.0, 5.0, 7.0, 4.0],
      backgroundColor: 'rgba(55, 99, 132, 0.5)',
    },
    {
      label: 'Total Farmers',
      data: [2, 5, 2, 1, 3, 5, 3, 3, 1, 2, 3, 1],
      backgroundColor: 'rgba(55, 199, 132, 0.5)',
    },
    {
      label: 'Total Plots',
      data: [10, 5, 3, 3, 3, 5, 5, 3, 3, 3, 4, 3],
      backgroundColor: 'rgba(55, 99, 232, 0.5)',
    }
  ],
};
const Chart = ({ chartData }) => {
  // Check if chartData and its nested properties are available and not empty.
  const hasData = chartData && 
                  chartData.chartData && 
                  chartData.chartData.labelsVillage && 
                  chartData.chartData.labelsVillage.length > 0;

  if (!hasData) {
    return (
      <div style={{ height: "350px", margin: "1em 0", textAlign: "center", paddingTop: "50px" }}>
        <p>No chart data available for this project.</p>
      </div>
    );
  }

  const labelsVillage = chartData.chartData.labelsVillage;
  const dataVillage = {
    labels: labelsVillage,
    datasets: [
      {
        label: 'Acreage',
        data: chartData.chartData.acreage,
        backgroundColor: 'rgba(55, 99, 132, 0.5)',
      },
      {
        label: 'Total Farmers',
        data: chartData.chartData.farmerCount,
        backgroundColor: 'rgba(55, 199, 132, 0.5)',
      },
      {
        label: 'Total Plots',
        data: chartData.chartData.plotCount,
        backgroundColor: 'rgba(55, 99, 232, 0.5)',
      }
    ],
  };

  return (
    <>
      <div style={{ height: "350px", margin: "1em 0" }} >
        <Bar options={optionsVillage} data={dataVillage} />
      </div>
    </>
  );
}

export default Chart