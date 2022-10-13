import React from 'react'
import { useWeb3Context } from '../../../context/'
import { Web3Address } from './Web3Address';
import { CreditCard } from 'react-feather';
import { StyledWeb3ButtonContainer, StyledDisconnectButton } from './styles/Web3ButtonStyles';

interface ConnectProps {
  connect: (() => Promise<void>) | null
}
const ConnectButton = ({ connect }: ConnectProps) => {
  return connect ? (
    <button className="px-3 py-2 connectButton flex" onClick={connect}><span className="pr-2 w-1.5/12"><CreditCard /></span> Connect Wallet</button>
  ) : (
    <button className="px-3 py-2">Loading...</button>
  )
}

interface DisconnectProps {
  disconnect: (() => Promise<void>) | null
}

const DisconnectButton = ({ disconnect }: DisconnectProps) => {
  return disconnect ? (
    <StyledWeb3ButtonContainer>
      <Web3Address />
      <StyledDisconnectButton onClick={disconnect}>Disconnect</StyledDisconnectButton>
    </StyledWeb3ButtonContainer>
    
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
