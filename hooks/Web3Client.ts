import { useEffect, useReducer, useCallback } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import {
  Web3ProviderState,
  Web3Action,
  web3InitialState,
  web3Reducer,
} from '../reducers'

import { toast } from 'react-toastify'

const providerOptions = {
}

let web3Modal: Web3Modal | null
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'goerli', // optional
    cacheProvider: true,
    providerOptions, // required
    theme: 'dark',
  })
}

export const useWeb3 = () => {
  const [state, dispatch] = useReducer(web3Reducer, web3InitialState)
  const { provider, web3Provider, address, network } = state

  const connect = useCallback(async () => {
    if (web3Modal) {
      try {
        const provider = await web3Modal.connect()
        const web3Provider = new ethers.providers.Web3Provider(provider)
        const signer = web3Provider.getSigner()
        const address = await signer.getAddress()
        const network = await web3Provider.getNetwork()
        if (network.name !== 'goerli') {
          throw `Unsupported Network ${network.name}`
        } else {
          toast.success(`Connected to Wallet: ${address.substring(0, 5)}...${address.slice(-4)}`)

        dispatch({
          type: 'SET_WEB3_PROVIDER',
          provider,
          web3Provider,
          address,
          network,
          signer,
        } as Web3Action)
        }
        
      } catch (e) {
        toast.error(`Wallet Connect Error: ${e}`)
      }
    } else {
      toast.error('No Web3Modal')
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider()
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect()
      }
      toast.error('Disconnected from Wallet')
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      } as Web3Action)
    } else {
      toast.error('No Web3Modal')
    }
  }, [provider])

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  // EIP-1193 events
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        toast.info('Changed wallet Account')
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        } as Web3Action)
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        if (typeof window !== 'undefined') {
          console.log('switched to chain...', _hexChainId)
          toast.info('Wallet Network Changed')
          window.location.reload()
        } else {
          console.log('window is undefined')
        }
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])

  return {
    provider,
    web3Provider,
    address,
    network,
    connect,
    disconnect,
  } as Web3ProviderState
}
