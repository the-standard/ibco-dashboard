/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// @ts-ignore
import { chartArray } from '../../../../public/data/chartData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
);

export const options = {
  responsive: true,
  scales: {
      x: {
        ticks: {
            display: false
        }
    }
  },
  elements: {
    line: {
      tension: 0.4,
    }
  }
};

const labels = new Array(chartArray.length).fill('Current sEuro Price');
const ArrayElem = chartArray.splice(0, Math.ceil(chartArray.length))

export const data = {
  labels,
  datasets: [
    {
      data: ArrayElem.map((dataPoint:string) => (parseFloat(dataPoint) / 1000000000000000000)),
      borderColor: 'rgb(153, 249, 255)',
      backgroundColor: 'rgb(153, 249, 255)',
    },
  ],
};

export const BondingCurveInterface = () => {
  return <Line options={options} data={data} />;
}
