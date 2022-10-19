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
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// @ts-ignore
import { chartArray } from '../../../../public/data/chartData';
import { BigNumber } from 'ethers';
import { StyledBondingCurveContainer } from '../Styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const currentPrice = BigNumber.from('886005893718244220');
const currentPriceFloat = parseFloat(currentPrice.toString()) / 1000000000000000000;

const customRadius = (context:any) => {
  const index = context.dataIndex;
  const value = context.dataset.data[ index ];
  return value === currentPriceFloat ? 5 : 0;
}

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
    },
    point: {
      radius : customRadius,
      display: true,
      backgroundColor: 'rgb(153, 249, 255)'
    }
  },
  events: []
};

const labels = new Array(chartArray.length).fill('Current sEuro Price');
const ArrayElem = chartArray.splice(0, Math.ceil(chartArray.length));

export const data = {
  labels,
  datasets: [
    {
      data: ArrayElem.map((dataPoint:string) => (parseFloat(dataPoint) / 1000000000000000000)),
      borderColor: 'rgb(153, 249, 255)',
      fill: false
    },
    {
      data: ArrayElem.filter((dataPoint:string) => BigNumber.from(dataPoint).lte(currentPrice)).map((dataPoint:string) => (parseFloat(dataPoint) / 1000000000000000000)),
      backgroundColor: 'rgb(153, 249, 255, 0.6)',
      fill: true,
      point: {
        display: false
      }
    }
  ],
};

export const BondingCurveInterface = () => {
  return <StyledBondingCurveContainer><Line options={options} data={data} /></StyledBondingCurveContainer>;
}
