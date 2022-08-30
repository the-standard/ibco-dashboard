/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import ConnectNav from '../components/shared/navigation/ConnectNav';
import SubNavigation from '../components/shared/navigation/SubNavigation';
import NextHeadComponent from '../components/shared/NextHeadComponent';
import { Web3SwapInterface } from '../components';
import { TokenInformationInterface, BondingCurveInterface } from '../components';
import { Contract, SmartContractManager } from '../Utils';
import Footer from '../components/shared/footer';
import { useWeb3Context } from '../context';
import { GetJsonAddresses } from '../Utils/ContractManager';
import { useEffect, useState } from 'react';

const Stage1: NextPage = () => {
  const [seuroAddress, setSeuroAddress] = useState('');
  const { web3Provider, network } = useWeb3Context();
  const _network = network?.name || 'goerli';
  const BondingCurveContract = SmartContractManager('BondingCurve' as Contract, _network).then((data) => { return data });

  useEffect(() => {
    getTokenAddress();
  }, [network]);

  const getTokenAddress = async() => {
    //@ts-ignore
    return seuroAddress === '' ? await GetJsonAddresses().then((data:never) => {
      setSeuroAddress(data[_network]['TOKEN_ADDRESSES']['SEURO']);
      return seuroAddress;
    })
    :
    seuroAddress
  }

  return (
    <div>
      <NextHeadComponent title="The Standard | Get sEURO" description='Get sEURO' />
      
      <ConnectNav />
      <SubNavigation />

      <main className="flex flex-row justify-between p-4">
        <div className="container w-9/12">
          <div className="supplyContainer mb-4 mr-6 px-5 py-3 flex flex-cols">
            <h2>sEURO Address:</h2> <p className="ml-20">{seuroAddress}</p>
          </div>
          {
            <>
              { web3Provider && <TokenInformationInterface bondingCurveContract={BondingCurveContract} /> }
              <BondingCurveInterface />
            </>
          }
        </div>
        <div className="container w-3/12">
          <Web3SwapInterface />
        </div>
        
      </main>

      <Footer />
    </div>
  )
}

export default Stage1
