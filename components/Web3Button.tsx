import React from 'react'
import { useWeb3Context } from '../context/'
import { Web3Address } from './Web3Address';
import { CreditCard } from 'react-feather';

interface ConnectProps {
  connect: (() => Promise<void>) | null
}
const ConnectButton = ({ connect }: ConnectProps) => {
  return connect ? (
    <button className="px-3 py-2 connectButton flex" onClick={connect}><span className="pr-2 w-2/12"><CreditCard /></span> Connect Wallet</button>
  ) : (
    <button className="px-3 py-2">Loading...</button>
  )
}

interface DisconnectProps {
  disconnect: (() => Promise<void>) | null
}

const DisconnectButton = ({ disconnect }: DisconnectProps) => {
  return disconnect ? (
    <div className="flex flex-row justify-between">
      <Web3Address />
      <button className="px-3 py-2 disconnectButton" onClick={disconnect}>Disconnect Wallet</button>
    </div>
    
  ) : (
    <button className="px-3 py-2">Loading...</button>
  )
}

export function Web3Button() {
  const { web3Provider, connect, disconnect } = useWeb3Context()

  return web3Provider ? (
    <DisconnectButton disconnect={disconnect} />
  ) : (
    <ConnectButton connect={connect} />
  )
}
