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
  ConvertFrom, 
  ConvertTo, 
  StakingContractManager,
  TokenContractManager, 
} from '../../../../Utils';
import moment from 'moment';
import { StyledStakingContainer, StyledStakingInterfaceContainer, StyledBackButtonContainer, StyledBackButton, StyledInputContainer, StyledInput, StyledDropdownContainer, StyledStakingPeriodInfo, StyledStakingPeriodP, StyledButton, StyledWarning, StyledWarningP, StyledWarningIconSpan } from '../styles/StakingInterfaceStyles';

type StakingInterfaceType = {
  contractAddress: string,
  backButton: React.MouseEventHandler<string>,
}

export const StakingInterface = ({contractAddress, backButton}:StakingInterfaceType) => {
  const { address, web3Provider, network } = useWeb3Context();
  const [from, setFrom] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [stakeTerms, setStakeTerms] = useState('');
  const [stakeTermsEnd, setStakeTermsEnd] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimal, setTokenDecimal] = useState('');
  const [disabledSend, setDisabledSend] = useState(true);
  const [assetApproved, setAssetApproved] = useState(false);
  const [disabledApprovalButton, setDisabledApprovalButton] = useState(true);
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [etherscanUrl, setEtherscanUrl] = useState<string>();

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
    const allowanceFormatted = ConvertFrom(allowance, parseInt(tokenDecimal)).toInt();
    from > 0 && from >= allowanceFormatted ? setAssetApproved(true) : setAssetApproved(false);
  }, [allowance])

  useEffect(() => {
    //get token symbol
    getTokenInformation();
  }, [tokenAddress])

  useEffect(() => {
    getStake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEtherscanUrl(network?.name === 'homestead' ? 'https://etherscan.io' : `https://${network?.name}.etherscan.io`);
  }, [network]);

  //MAIN FUNCTIONS
  const getTokenInformation = async () => {
    const TokenContract =  await TokenContract_TST;
    
    if(tokenAddress && TokenContract && Object.keys(TokenContract).length !== 0) {
      //@ts-ignore
      TokenContract.methods.symbol().call()
      .then((data:never) => setTokenSymbol(data));
      //@ts-ignore
      TokenContract.methods.decimals().call()
      .then((data:never) => setTokenDecimal(data));
      //@ts-ignore
      TokenContract.methods.allowance(address, contractAddress).call().then((data:never) => setAllowance(parseInt(data)));
      //@ts-ignore
      TokenContract.methods.balanceOf(address).call().then((data:never) => {
        const formattedBalance = ConvertFrom(data, parseInt(tokenDecimal)).toFloat().toFixed(2);
        setBalance(parseFloat(formattedBalance));
      });
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
    setLoadingApproval(true);
    const _tokenDecimal = parseInt(tokenDecimal.toString())
    const _depositAmount = ConvertTo(from, _tokenDecimal).raw();

    // @ts-ignore
    await (await TokenContract).methods.approve(contractAddress, _depositAmount).send({from: address}).then(() => {
      setLoadingApproval(false);
      setAssetApproved(true);
    }).catch((error:never) => {
      setLoadingApproval(false);
      setAssetApproved(false);
      toast.error('Approval error', error);
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
        toast.success(`Transaction success: ${data['transactionHash']}`);
      }).catch((error:never) => {
        setLoading(false);
        toast.error(`Error when staking: ${ error}`);
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
          <p className="text-sm">Staking Period:</p>
          <StyledStakingPeriodP>{`${moment(parseInt(stakeTerms)*1000).format('ll')} - ${moment(parseInt(stakeTermsEnd)*1000).format('ll')}`}</StyledStakingPeriodP>
        </StyledStakingPeriodInfo>
        <span>
          <StyledInputContainer>
            <StyledInput type='number' step="any" min={0} maxLength={8} onInput={checkMaxLength} placeholder={`${tokenSymbol} Amount`} onChange={(e) => setTokenValues(parseFloat(e.currentTarget.value))} onFocus={(event) => event.target.select()} value={from > 0 ? from : ''} />
            <StyledDropdownContainer className="dropdownSelect">
              <p className="mx-auto">{tokenSymbol}</p>
            </StyledDropdownContainer>
        </StyledInputContainer>
        
        <p style={balance > 0 ? {color: '#99f9ff', margin: '15px 0 0 0', fontSize: '12px'} : {color: '#cb4464', margin: '15px 0 0 0', fontSize: '12px'}}>{balance > 0 ? `Available: ${balance} ${tokenSymbol}` : `Warning: you do not have enough ${tokenSymbol}`}</p>

          <StyledWarning>
            <StyledWarningIconSpan><AlertTriangle size={20} /></StyledWarningIconSpan><StyledWarningP>Warning: once you have staked your Standard Token ({tokenSymbol}) you can not unstake them until {moment(parseInt(stakeTermsEnd)*1000).format('lll')}</StyledWarningP>
          </StyledWarning>
        </span>
            <StyledButton disabled={loadingApproval || loading || disabledApprovalButton} onClick={() => approveCurrency()}>{assetApproved && from > 0 ? `${from} ${tokenSymbol} Approved` : loadingApproval ? `Approving ${from} ${tokenSymbol}... `: `Approve ${from} ${tokenSymbol}`}</StyledButton>
            
            {            
            <StyledButton disabled={loadingApproval || loading || disabledSend} onClick={() => SendStakeTransaction()}>{loading ? 'Confirming Stake in MetaMask...' : transactionData ? 'Confirm Another Stake on Metamask' : 'Confirm Stake on Metamask'}</StyledButton>
            }
            {// @ts-ignore
            transactionData && <StyledButton className="flex px-2 py-1 font-light justify-center" onClick={() => window.open(`${etherscanUrl}/tx/${transactionData['transactionHash']}`,"_blank")}>Show Transaction</StyledButton>
            }
            </>
      ) : <div>Please Connect Wallet...</div>
      }
    </StyledStakingInterfaceContainer>
  </StyledStakingContainer>
  )
}
