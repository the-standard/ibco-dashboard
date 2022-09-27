/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3Context } from '../../../../context'
import React, { 
  useEffect, 
  useState } from 'react'
import { toast } from 'react-toastify';
import { AlertTriangle, ChevronLeft } from 'react-feather';
//import Web3 from 'web3';

//Util Helpers
import { 
  Contract, 
  ConvertTo, 
  StakingContractManager,
  TokenContractManager, 
} from '../../../../Utils';
import moment from 'moment';

type StakingInterfaceType = {
  contractAddress: string,
  backButton: React.MouseEventHandler<string>,
}

export const StakingInterface = ({contractAddress, backButton}:StakingInterfaceType) => {
  const { address, web3Provider, network } = useWeb3Context();
  const [from, setFrom] = useState(0);
  const [stakeTerms, setStakeTerms] = useState('');
  const [stakeTermsEnd, setStakeTermsEnd] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimal, setTokenDecimal] = useState('');
  const [disabledSend, setDisabledSend] = useState(true);
  const [assetApproved, setAssetApproved] = useState(false);
  const [disabledApprovalButton, setDisabledApprovalButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // CONTRACT MANAGER INIT
  const _network = network?.name || 'goerli';
  const TokenContract = StakingContractManager(tokenAddress as Contract).then((data) => data);
  const stakingContract = StakingContractManager(contractAddress as Contract).then((data) => data);
  const TokenContract_TST = TokenContractManager(tokenAddress, _network).then((data) => data);

  // PRIVATE HELPERS

  // MAIN UPDATE FUNCTIONS
  // tokens are currently fixed to SEURO and USDT
  useEffect(() => {
    //disable approval buttons
    from > 0 ? setDisabledApprovalButton(false) : setDisabledApprovalButton(true);

    assetApproved && setDisabledApprovalButton(true);
    assetApproved && setDisabledSend(false);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, assetApproved, tokenAddress]);

  useEffect(() => {
    //get token symbol
    getTokenInformation();
  }, [tokenAddress])

  useEffect(() => {
    getStake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //MAIN FUNCTIONS
  const getTokenInformation = async () => {
    const TokenContract = await (await TokenContract_TST);

    if(TokenContract && Object.keys(TokenContract).length !== 0) {
      //@ts-ignore
      TokenContract.methods.symbol().call()
      .then((data:never) => setTokenSymbol(data));
      //@ts-ignore
      TokenContract.methods.decimals().call()
      .then((data:never) => setTokenDecimal(data));
    }
  }

  const setTokenValues = (data:number) => {
    setFrom(data);
  }

  const getStake = async () => {
    // @ts-ignore
    await(await stakingContract).methods.windowStart().call().then((data:string) => setStakeTerms(data));
    // @ts-ignore
    await(await stakingContract).methods.windowEnd().call().then((data:string) => setStakeTermsEnd(data));
    //@ts-ignore
    await (await stakingContract).methods.TST_ADDRESS().call().then((data:never) => setTokenAddress(data));
  }

  const checkMaxLength = (inputData: { currentTarget: { value: string | never[]; };}) => {
    if(inputData.currentTarget.value.slice(0,1) === '-')
      inputData.currentTarget.value = '0'

    if(inputData.currentTarget.value.length > 8) 
      inputData.currentTarget.value = inputData.currentTarget.value.slice(0, 8);
  }

  const approveCurrency = async () => {
    setLoading(true);
    const _tokenDecimal = parseInt(tokenDecimal.toString())
    const _depositAmount = ConvertTo(from, _tokenDecimal).raw();

    // @ts-ignore
    await (await TokenContract).methods.approve(contractAddress, _depositAmount).send({from: address}).then(() => {
      setLoading(false);
      setAssetApproved(true);
    }).catch((error:never) => {
      setLoading(false);
      setAssetApproved(false);
      toast.error('approval error', error);
    })
  }

  const SendStakeTransaction = async () => {
    setLoading(true);
    const _tokenDecimal = parseInt(tokenDecimal.toString())
    const _formatTST = ConvertTo(from, _tokenDecimal).raw();
    // @ts-ignore
    await (await stakingContract).methods.mint(_formatTST).send({from:address})
      .then((data:never) => {
        setLoading(false);
        setTransactionData(data);
        // @ts-ignore
        toast.success(`transaction success: ${data['transactionHash']}`);
      }).catch((error:never) => {
        setLoading(false);
        toast.error(`Problem with bonding event: ${ error}`);
      });
  }

  return (
    <>
    {
      // @ts-ignore
      <div className="mb-4 w-4/12"><a href="#" className="py-1 flex backButton" onClick={backButton}><span className="flex w-5"><ChevronLeft /></span> Back</a></div>
    }
    
    <div className="convertInput grid grid-flow-row auto-rows-max p-5 py-8 w-full">
      { web3Provider ? (
        <>
        <div className="mb-3">
          <p className="text-sm">Staking Period</p>
          <p className="stakingPeriod my-2">{`${moment(parseInt(stakeTerms)*1000).format('ll')} - ${moment(parseInt(stakeTermsEnd)*1000).format('ll')}`}</p>
        </div>
        <span>
          <p className="p-0 m-0 text-sm">Staking...</p>
          <div className="container w-full">
            <div className="mb-8 mt-1 mx-auto flex flex-cols w-full">
              <input className="w-9/12" type='number' step="any" min={0} maxLength={8} onInput={checkMaxLength} placeholder={`${tokenSymbol} Staking Amount`} onChange={(e) => setTokenValues(parseFloat(e.currentTarget.value))} onFocus={(event) => event.target.select()} value={from > 0 ? from : ''} />
              <div className="dropdownSelect py-2 text-center w-3/12">
              <p className="mx-auto">{tokenSymbol}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-cols m-2 mb-8 warning">
            <span className="w-2/12"><AlertTriangle /></span><p className="w-10/12">Warning: once you have staked your Standard Token ({tokenSymbol}) you can not unstake them until {moment(parseInt(stakeTermsEnd)*1000).format('lll')}</p>
          </div>
        </span>
            <button className="flex px-2 py-1 mb-4 font-light justify-center" disabled={disabledApprovalButton} onClick={() => approveCurrency()}>{assetApproved ? `${tokenSymbol} Approved` : loading ? 'loading...' : `Approve ${tokenSymbol}`}</button>
            
            {            
            <button className="flex px-2 py-1 mb-4 font-light justify-center" disabled={disabledSend} onClick={() => SendStakeTransaction()}>{loading ? 'loading...' : 'Start Staking'}</button>
            }
            {// @ts-ignore
            transactionData && <button className="flex px-2 py-1 font-light justify-center" onClick={() => window.open(`https://${network['name']}.etherscan.io/tx/${transactionData['transactionHash']}`,"_blank")}>Show Transaction</button>
            }
            </>
      ) : <div>Please Connect Wallet...</div>
}
    </div>
    </>
  )
}
