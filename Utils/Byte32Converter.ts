import { ethers } from "ethers";

/**
 * Converts string to a BYTE32 string
 * @constructor
 * @param {string} value - The value to convert to BYTE32
 * @returns {string} Hex code of the converted string | represented with 0x0
 */
export const ToByte32 = (value:string) => {
    return ethers.utils.formatBytes32String(value);
}

/**
 * Converts BYTE32 string to a human readable string
 * @constructor
 * @param {string} hex - The hex value to convert from BYTE32
 * @returns {string} converted human readable string
 */
 export const FromByte32 = (hex:string) => {
    return ethers.utils.parseBytes32String(hex);
}