/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import ConnectNav from '../components/shared/navigation/ConnectNav';
import SubNavigation from '../components/shared/navigation/SubNavigation';
import NextHeadComponent from '../components/shared/NextHeadComponent';
import { Web3SwapInterface } from '../components';
import { TokenInformationInterface, BondingCurveInterface } from '../components';
import { Contract, SmartContractManager, TOKENS, Web3Manager } from '../Utils';
import Footer from '../components/shared/footer';
import { GetJsonAddresses } from '../Utils/ContractManager';
import { useEffect, useState } from 'react';

const Stage1: NextPage = () => {
  const web3Interface = Web3Manager();
  const [seuroAddress, setSeuroAddress] = useState('');
  const [network, setNetwork] = useState<string>();
  const BondingCurveContract = SmartContractManager('BondingCurve' as Contract).then((data) => { return data });

  useEffect(() => {
    networkRetrieval();
  }, []);

  useEffect(() => {
    network !== undefined && getTokenAddress();
  }, [network]);

  const getTokenAddress = async() => {
    console.log('network', network)
    //@ts-ignore
    return seuroAddress === '' ? await GetJsonAddresses().then((data:never) => {
      //@ts-ignore
      setSeuroAddress(data[network]['TOKEN_ADDRESSES']['SEURO']);
      return seuroAddress;
    })
    :
    seuroAddress
  }

  const networkRetrieval = async() => {
    await web3Interface.eth.net.getNetworkType().then((network) => setNetwork(network));
  }

  return (
    <div>
      <NextHeadComponent title="The Standard | Get sEURO" description='Get sEURO' />
      
      <ConnectNav />
      <SubNavigation />

      <main>
        <div className="md:flex flex-row justify-between p-4 w-full">
          <div className="convertInput mx-auto text-center p-5">
            <p className="descriptionCopy"><b>What is Stage 1?</b> The Bonding Curve allows users to swap their collateral for sEURO. Initially, sEURO is discounted by 20% meaning 1 EURO of ETH will be exchanged for 1.2 sEURO. This discount declines until the total supply has been exhausted. </p>
          </div>
        </div>

        <div className="md:flex flex-row justify-between p-4 pt-0 w-full">
          <div className="container md:w-9/12">
            <div className="supplyContainer mb-4 md:mr-6 px-5 py-3 flex flex-cols">
              <h2>{TOKENS.DISPLAY.SEURO} Address:</h2> <p className="ml-20 addressHolder">{seuroAddress}</p>
            </div>
            {
              <>
                <TokenInformationInterface bondingCurveContract={BondingCurveContract} />
                <BondingCurveInterface />
              </>
            }
          </div>
          <div className="container md:w-3/12">
            <Web3SwapInterface />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Stage1
