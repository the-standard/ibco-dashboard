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
import { StyledStakingContainer, StyledStakingInterfaceContainer, StyledBackButtonContainer, StyledBackButton, StyledInputContainer, StyledInput, StyledDropdownContainer, StyledStakingPeriodInfo, StyledP, StyledStakingPeriodP, StyledButton, StyledWarning, StyledWarningP, StyledWarningIconSpan } from '../styles/StakingInterfaceStyles';

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
  const TokenContract = StakingContractManager(tokenAddress as Contract).then((data) => data);
  const stakingContract = StakingContractManager(contractAddress as Contract).then((data) => data);
  const TokenContract_TST = TokenContractManager(tokenAddress).then((data) => data);

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
    <StyledStakingContainer>
    {
      // @ts-ignore
      <StyledBackButtonContainer><StyledBackButton href="#" onClick={backButton}><span className="flex w-5"><ChevronLeft /></span> Back</StyledBackButton></StyledBackButtonContainer>
    }
    
    <StyledStakingInterfaceContainer>
      { web3Provider ? (
        <>
        <StyledStakingPeriodInfo>
          <p className="text-sm">Staking Period</p>
          <StyledStakingPeriodP>{`${moment(parseInt(stakeTerms)*1000).format('ll')} - ${moment(parseInt(stakeTermsEnd)*1000).format('ll')}`}</StyledStakingPeriodP>
        </StyledStakingPeriodInfo>
        <span>
          <StyledP className="p-0 m-0 text-sm">Staking...</StyledP>

          <StyledInputContainer>
            <StyledInput type='number' step="any" min={0} maxLength={8} onInput={checkMaxLength} placeholder={`${tokenSymbol} Staking Amount`} onChange={(e) => setTokenValues(parseFloat(e.currentTarget.value))} onFocus={(event) => event.target.select()} value={from > 0 ? from : ''} />
            <StyledDropdownContainer className="dropdownSelect">
              <p className="mx-auto">{tokenSymbol}</p>
            </StyledDropdownContainer>
          </StyledInputContainer>

          <StyledWarning>
            <StyledWarningIconSpan><AlertTriangle size={30} /></StyledWarningIconSpan><StyledWarningP>Warning: once you have staked your Standard Token ({tokenSymbol}) you can not unstake them until {moment(parseInt(stakeTermsEnd)*1000).format('lll')}</StyledWarningP>
          </StyledWarning>
        </span>
            <StyledButton className="flex px-2 py-1 mb-4 font-light justify-center" disabled={disabledApprovalButton} onClick={() => approveCurrency()}>{assetApproved ? `${tokenSymbol} Approved` : loading ? 'loading...' : `Approve ${tokenSymbol}`}</StyledButton>
            
            {            
            <StyledButton className="flex px-2 py-1 mb-4 font-light justify-center" disabled={disabledSend} onClick={() => SendStakeTransaction()}>{loading ? 'loading...' : 'Start Staking'}</StyledButton>
            }
            {// @ts-ignore
            transactionData && <StyledButton className="flex px-2 py-1 font-light justify-center" onClick={() => window.open(`https://${network['name']}.etherscan.io/tx/${transactionData['transactionHash']}`,"_blank")}>Show Transaction</StyledButton>
            }
            </>
      ) : <div>Please Connect Wallet...</div>
}
    </StyledStakingInterfaceContainer>
    </StyledStakingContainer>
  )
}
