/* eslint-disable @typescript-eslint/ban-ts-comment */
import web3 from "web3";

type Unit =
    | 'noether'
    | 'wei'
    | 'kwei'
    | 'Kwei'
    | 'babbage'
    | 'femtoether'
    | 'mwei'
    | 'Mwei'
    | 'lovelace'
    | 'picoether'
    | 'gwei'
    | 'Gwei'
    | 'shannon'
    | 'nanoether'
    | 'nano'
    | 'szabo'
    | 'microether'
    | 'micro'
    | 'finney'
    | 'milliether'
    | 'milli'
    | 'ether'
    | 'kether'
    | 'grand'
    | 'mether'
    | 'gether'
    | 'tether';

/* eslint-disable @typescript-eslint/no-unused-vars */
const decimal2name = (decimal:number) => {
    //web3 unitMap https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html#unitmap
    const tokenUnits = web3.utils.unitMap;

    const unit = Object.entries(tokenUnits).map((item) => {
        // console.log('itemLength', (item[1].slice(1, item[1].length)).length, 'decimal2check', decimal);
        const itemLength = (item[1].slice(1, item[1].length)).length;
        return itemLength === decimal && item;
    }).filter((elem) => elem);

    return unit.length > 0 ? {...unit[0]}[0] : 'ether';
};

/**
 * Converts BigNumber to Javascript number
 * @constructor
 * @param {string} value - The value to convert to Javascript Number
 * @param {string} decimal - The decimal places to convert from
 */
export const ConvertFrom = (value:number|string, decimal:number) => {
    const decimalName = decimal2name(decimal) as Unit;
    let fromWei: string;

    try {
        fromWei = web3.utils.fromWei((value).toString(), decimalName)
    } catch (error) {
        fromWei = '0';
    } 

    return {
        toInt: () => parseInt(fromWei),
        toFloat: () => parseFloat(fromWei),
        raw: () => fromWei,
    }
}

/**
 * Converts Javascript number to BigNumber
 * @constructor
 * @param {number} value - The value to convert to BigNumber
 * @param {number} decimal - The decimal places to convert to
 */
export const ConvertTo = (value:number|string, decimal:number) => {
    const decimalName = decimal2name(decimal) as Unit;
    const toWei = value > 0 && value !== undefined && value !== NaN ? web3.utils.toWei((value).toString(), decimalName) : '0' ;

    return {
        toInt: () => parseInt(toWei),
        toFloat: () => parseFloat(toWei),
        raw: () => toWei,
    }
}

export const toLocaleFixed = (num: number, dec: number) => {
    let localeFixed;
    const number = num || 0;

    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (number && dec) {
      localeFixed = formatter.format(number);
    }
    
    return localeFixed;
  }
