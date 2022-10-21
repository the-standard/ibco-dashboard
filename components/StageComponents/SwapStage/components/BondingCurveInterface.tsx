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
import { ConvertFrom } from '../../../../Utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

type PriceInfo = {
  currentPrice: BigNumber,
  maxSupply: BigNumber
}

const stringToFloat = (bnString:string) => {
  return parseFloat(bnString) / 1000000000000000000
}

const customRadius = (context:any, currentPrice:BigNumber) => {
  const index = context.dataIndex;
  const value = context.dataset.data[ index ];
  return value === stringToFloat(currentPrice.toString()) ? 5 : 0;
}

export const options = (priceInfo:PriceInfo) => {
  return {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Supply (sEURO)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (€)'
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: (context: any) => customRadius(context, priceInfo.currentPrice),
        display: true,
        backgroundColor: 'rgb(153, 249, 255)'
      }
    },
    events: []
  };
};

const ArrayElem = chartArray.splice(0, Math.ceil(chartArray.length));

export const data = (priceInfo:PriceInfo) => {
  const formatForLabel = (bn:BigNumber) => {
    return ConvertFrom(bn.toString(), 18).toInt().toLocaleString();
  }

  const bucketLabels = () => {
    const noBuckets = ArrayElem.length - 2;
    const bucketSize = priceInfo.maxSupply.div(noBuckets);
    const labels = new Array(noBuckets).fill(BigNumber.from(0)).map((element, index) => formatForLabel(bucketSize.mul(index).add(bucketSize.div(2))));
    return labels;
  }

  const labels = [0, ...bucketLabels(), formatForLabel(priceInfo.maxSupply)];

  return {
    labels,
    datasets: [
      {
        data: ArrayElem.map(stringToFloat),
        borderColor: 'rgb(153, 249, 255)',
        fill: false
      },
      {
        data: ArrayElem.filter((dataPoint:string) => BigNumber.from(dataPoint).lte(priceInfo.currentPrice)).map(stringToFloat),
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
  const defaultPriceInfo = { currentPrice: BigNumber.from(0), maxSupply: BigNumber.from(0) };
  const [priceInfo, setPriceInfo] = useState<PriceInfo>(defaultPriceInfo)

  const setPriceFromBondingCurve = async () => {

    await (await bondingCurveContract).methods.maxSupply().call()
      .then(async (maxSupply: never) => {
        await (await bondingCurveContract).methods.currentBucket().call()
          .then((priceData: never) => {
            setPriceInfo({ currentPrice: BigNumber.from(priceData['price']), maxSupply: BigNumber.from(maxSupply) });
          }).catch((error: never) => {
            toast.error(`Unable to obtain current price: ${error}`);
          });
      }).catch((error: never) => {
        toast.error(`Unable to obtain supply data: ${error}`);
      });
  }

  useEffect(() => {
    setPriceFromBondingCurve();
  }, []);

  if (priceInfo && priceInfo.currentPrice.gt(0)) {
    return <StyledBondingCurveContainer><Line options={options(priceInfo)} data={data(priceInfo)} /></StyledBondingCurveContainer>;
  } else {
    return 'Loading Bonding Curve chart ...'
  }

}
