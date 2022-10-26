import React from 'react'
import { useWeb3Context } from '../../../context/'
import { Web3Address } from './Web3Address';
import { CreditCard } from 'react-feather';
import { StyledWeb3ButtonContainer, StyledDisconnectButton, StyledMainConnectButton } from './styles/Web3ButtonStyles';

interface ConnectProps {
  connect: (() => Promise<void>) | null
}
const ConnectButton = ({ connect }: ConnectProps) => {
  return connect ? (
    <StyledMainConnectButton className="connectButton" onClick={connect}><span><CreditCard size={20} /></span> Connect Wallet</StyledMainConnectButton>
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
