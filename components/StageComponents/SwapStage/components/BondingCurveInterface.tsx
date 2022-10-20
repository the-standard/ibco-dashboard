/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
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

const stringToFloat = (bnString:string) => {
  return parseFloat(bnString) / 1000000000000000000
}

const customRadius = (context:any, currentPrice:BigNumber) => {
  const index = context.dataIndex;
  const value = context.dataset.data[ index ];
  return value === stringToFloat(currentPrice.toString()) ? 5 : 0;
}

export const options = (currentPrice:BigNumber) => {
  return {
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
        radius : (context:any) => customRadius(context, currentPrice),
        display: true,
        backgroundColor: 'rgb(153, 249, 255)'
      }
    },
    events: []
  }
};

const labels = new Array(chartArray.length).fill('Current sEuro Price');
const ArrayElem = chartArray.splice(0, Math.ceil(chartArray.length));

export const data = (currentPrice:BigNumber) => {
  return {
    labels,
    datasets: [
      {
        data: ArrayElem.map(stringToFloat),
        borderColor: 'rgb(153, 249, 255)',
        fill: false
      },
      {
        data: ArrayElem.filter((dataPoint:string) => BigNumber.from(dataPoint).lte(currentPrice)).map(stringToFloat),
        backgroundColor: 'rgb(153, 249, 255, 0.6)',
        fill: true,
        point: {
          display: false
        }
      }
    ],
  };
}

// @ts-ignore
export const BondingCurveInterface = ({bondingCurveContract}) => {
  const [currentPrice, setCurrentPrice] = useState<BigNumber>(BigNumber.from(0));

  const setPriceFromBondingCurve = async () => {
    await(await bondingCurveContract).methods.currentBucket().call()
        .then((data:never) => {
            setCurrentPrice(BigNumber.from(data['price']));
        }).catch((error:never) => {
            toast.error(`Unable to obtain current price: ${error}`);
        });
  }

  useEffect(() => {
    setPriceFromBondingCurve();
  }, []);

  return <StyledBondingCurveContainer><Line options={options(currentPrice)} data={data(currentPrice)} /></StyledBondingCurveContainer>;
}
