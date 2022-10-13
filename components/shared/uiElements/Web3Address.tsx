/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useWeb3Context } from '../../../context';
import { StyledWalletAddressContainer, StyledWalletNetworkContainer, StyledWeb3AddressContainer } from './styles/Web3ButtonStyles';

export function Web3Address() {
  const { address, network } = useWeb3Context();
  const _network = network?.name === 'homestead' ? 'main' : network?.name;

  return (
    <StyledWeb3AddressContainer>
          <StyledWalletNetworkContainer>
          {
            // @ts-ignore
            _network
          }
          </StyledWalletNetworkContainer>
          <StyledWalletAddressContainer>
          {
            // @ts-ignore
          address.substring(0, 5)
          }...{
            // @ts-ignore
          address.slice(-4)
          }
          </StyledWalletAddressContainer>
    </StyledWeb3AddressContainer>
  )
}
