/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import { useWeb3Context } from '../../../context'

export function Web3Address() {
  const { address, network } = useWeb3Context();

  return (
    <div className="flex items-center justify-center">
          <span className="walletNetwork-container pl-4 text-right text-sm font-light">
          {
            // @ts-ignore
          network['name']
          }
          </span>
          <span className="walletAddress-container pl-4 text-right text-sm font-light">
          {
            // @ts-ignore
          address.substring(0, 5)
          }...{
            // @ts-ignore
          address.slice(-4)
          }
          </span>
    </div>
  )
}
