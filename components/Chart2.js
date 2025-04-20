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





const Chart = ({ data }) => {
  console.log("chart data", data)

  const optionsChart = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      // legend: {
      //   position: 'top' as const,
      // },
      title: {
        display: true,
        text: data["chartTitle"],
      },
    },
  };
  


  const dataChart = {
    labels: data['date'],
    datasets: [
      {
        label: 'Amount',
        data: data['amount'],
        backgroundColor: data['bg']?data['bg']:"rgba(55, 99, 132, 0.5)",
      }
    ],
  };

  return (
    <>
      <div style={{ height: "350px",margin:"1em 0" }} >
        <Bar options={optionsChart} data={dataChart} />
      </div>

    </>
  )
}

export default Chart