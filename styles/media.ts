/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { css } from "styled-components";

const sizes = {
  uhd: 1980,
  widescreen: 1366,
  desktop: 768,
}

export default Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `
  return acc
}, {})