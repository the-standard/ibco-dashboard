/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3Context } from '../../../context'
import React, { 
  useEffect, 
  useState } from 'react'
import { useRouter } from "next/router";
import { toast } from 'react-toastify';

//Util Helpers
import { 
  Contract, 
  ConvertFrom, 
  ConvertTo, 
  SmartContractManager, 
  TokenContractManager, 
  TOKENS,
} from '../../../Utils';
import { GetJsonAddresses } from '../../../Utils/ContractManager';
import { RateSelectionButton } from './components/RateSelectionButton/RateSelectionButton';
import { BondingHistoryInterface } from './components/BondingHistoryInterface/BondingHistoryInterface';
import DescriptionContainer from '../../shared/uiElements/DescriptionContainer/DescriptionContainer';
import { StyledBondingHistoryButton, StyledBondingHistoryButtonContainer, StyledBondingInterfaceContainer, StyledInputContainers, StyledMainContainer, StyledNoFormatP, StyledPContainer, StyledRateSelectionContainer, StyledTransactionButton, StyledTransactionButtonContainer } from './Styles';

type Rate = {
  duration: string, 
  rate: string
}

function Web3BondInterface() {
  const router = useRouter();
  const { address, web3Provider, network } = useWeb3Context();
  const [seuroAddress, setSeuroAddress] = useState();
  const showHistory = () => router.query.history === 'true';
  const [showHistoryInterface, setShowHistoryInterface] = useState(showHistory());
  const [contractAddresses, setContractAddresses] = useState({});
  const [otherTokenAddress, setOtherTokenAddress] = useState(null);
  const [otherTokenSymbol, setOtherTokenSymbol] = useState('');
  const [otherTokenDecimal, setOtherTokenDecimal] = useState(0);
  const [mainTokenDecimal, setmainTokenDecimal] = useState(0);
  const [tstTokenInfo, setTstTokenInfo] = useState({
    address: '',
    decimal: 0,
    symbol: '',
  });
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState('0');
  const [reward, setReward] = useState('0');
  const [toDisplay, setToDisplay] = useState(0);
  const [rates, setRates] = useState([]);
  const [balance, setBalance] = useState({main: '0', other: '0'});
  const [allowance, setAllowance] = useState({main: 0, other: 0});
  const [bondingLength, setBondingLength] = useState<Rate>();
  const [disabledSend, setDisabledSend] = useState(true);
  const [assetApproved, setAssetApproved] = useState({main: false, other: false});
  const [disabledApprovalButton, setDisabledApprovalButton] = useState({main: true, other: true});
  const [loading, setLoading] = useState(false);
  const [loadingOther, setLoadingOther] = useState(false);
  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [_network, setNetwork] = useState<string>();
  const [etherscanUrl, setEtherscanUrl] = useState<string>();
  // CONTRACT MANAGER INIT
  const OperatorStage2Contract = SmartContractManager('OperatorStage2' as Contract).then((data) =>  data);
  const SmartContract = SmartContractManager('BondingEvent' as Contract).then((data) =>  data);
  const Storage = SmartContractManager('BondStorage' as Contract).then((data) => data);
  const TstTokenInfo = SmartContractManager('StandardTokenGateway' as Contract).then((data) => data);
  //@ts-ignore
  const TokenContract_other = otherTokenAddress !== null && TokenContractManager(otherTokenAddress).then((data) =>  data);
  const StandardTokenGatewayContract = SmartContractManager('SEuroOffering').then((data) => data);
  const TokenContract_TST = tstTokenInfo.address !== '' && TokenContractManager(tstTokenInfo.address).then((data) => data);
    //@ts-ignore
  const TokenContract_main = seuroAddress !== undefined && TokenContractManager(seuroAddress).then((data) => data);
  const otherTokenInfo = {
    otherTokenSymbol, 
    otherTokenDecimal
  };

  // MAIN UPDATE FUNCTIONS
  useEffect(() => {
    setNetwork(network?.name === 'homestead' ? 'main' : network?.name);
    setEtherscanUrl(network?.name === 'homestead' ? 'https://etherscan.io' : `https://${network?.name}.etherscan.io`);
    getContractAddresses();
  }, [network]);

  useEffect(() => {
    getSeuroAddress();
  }, []);

  useEffect(() => {
    getBondingLengths();
    getContractAddresses();
    getOtherTokenAddress();
    getTstTokenInfo();
  }, [seuroAddress]);

  useEffect(() => {
    getRewardAmount();
  }, [tstTokenInfo])

  useEffect(() => {
    const allowanceOther = ConvertFrom(allowance.other, otherTokenDecimal).toFloat();
    const allowanceMain = ConvertFrom(allowance.main, mainTokenDecimal).toFloat();

    from > 0 && allowanceMain >= from ?
      setAssetApproved(prevState => ({...prevState, main: true}))
      :
      setAssetApproved(prevState => ({...prevState, main: false}));

    parseFloat(to) > 0 && allowanceOther >= parseFloat(to) ?
      setAssetApproved(prevState => ({...prevState, other: true}))
      :
      setAssetApproved(prevState => ({...prevState, other: false}))

  }, [allowance, from, to])

  useEffect(() => {
    getOtherContractAddress();
    checkAllowances();
  }, [otherTokenAddress])

  // tokens are currently fixed to SEURO and USDT
  useEffect(() => {
    //disable approval buttons
    from > 0 ? setDisabledApprovalButton(prevState => ({
      ...prevState,
      main: false
    })) 
    : setDisabledApprovalButton(prevState => ({
      ...prevState,
      main: true
    }));

    to !== '0'  ? setDisabledApprovalButton(prevState => ({
      ...prevState,
      other: false
    })) 
    : setDisabledApprovalButton(prevState => ({
      ...prevState,
      other: true
    }));

    // disable approval buttons after token is approved
    assetApproved.main && setDisabledApprovalButton(prevState => ({
      ...prevState,
      main: true
    }));
    assetApproved.other && setDisabledApprovalButton(prevState => ({
      ...prevState,
      other: true
    }));

    // enable bonding button if both assets are approved
    assetApproved.main && assetApproved.other && bondingLength !== undefined && setDisabledSend(false);

    from > 0 ? getTokenAmount() : setTo('0');
    //@ts-ignore
    getRewardAmount();
  }, [from, to, assetApproved, bondingLength]);

  useEffect(() => {
    getTokenBalance('main');
    getTokenBalance('other');
    getTokenAmount();
  }, [address, otherTokenAddress, otherTokenSymbol, otherTokenDecimal]);

  useEffect(() => {
    setShowHistoryInterface(showHistory());
  }, [router.query]);

  const getSeuroAddress = async () => {
    const standardTokenGatewayContract = await StandardTokenGatewayContract;
    const tstTokenInfoContract = await TstTokenInfo;

    //@ts-ignore
    tstTokenInfoContract.methods.TOKEN().call()
    .then(async (data: never) => {
      setTstTokenInfo(prevState => ({
        ...prevState,
        address: data
    }));
    });

    //@ts-ignore
    standardTokenGatewayContract.methods.Seuro().call().then((data:never) => {
      setSeuroAddress(data);
    });
  }

  const getTstTokenInfo = async () => {
    const tokenContract = await TokenContract_TST;

    if(tokenContract) {
      // @ts-ignore
           tokenContract.methods.symbol().call().then((data:never) => {
           setTstTokenInfo(prevState => ({
               ...prevState,
               symbol: data
           }))
       });

       // @ts-ignore
       tokenContract.methods.decimals().call().then((data:never) => {
           setTstTokenInfo(prevState => ({
               ...prevState,
               decimal: parseInt(data)
           }))
       });
   }
  }

  const checkAllowances = async () => {
    const MainToken = await TokenContract_main;
    const OtherToken = await TokenContract_other;

    if (otherTokenAddress !== null && MainToken && OtherToken && address && Object.keys(contractAddresses).length !== 0) {
      //@ts-ignore
      const BondingEventContractAddress = await contractAddresses[_network]['CONTRACT_ADDRESSES']['BondingEvent'];
      //@ts-ignore
      MainToken.methods.allowance(address, BondingEventContractAddress).call().then((data:never) => {
        setAllowance(prevState => ({...prevState, main: parseInt(data)}));
      });

      //@ts-ignore
      OtherToken.methods.allowance(address, BondingEventContractAddress).call().then((data:never) => {
        setAllowance(prevState => ({...prevState, other: parseInt(data)}));
      });
    }
  }

  const getOtherContractAddress = async () => {
    if (otherTokenAddress !== null) {
      //@ts-ignore
      await (await TokenContract_other).methods.decimals().call()
      .then((data:never) => {
        setOtherTokenDecimal(data);
      }).catch((error:never) => {
        console.log('error retrieving other token decimal', error);
      });
      //@ts-ignore
      await (await TokenContract_other).methods.symbol().call()
      .then((data:never) => {
        setOtherTokenSymbol(data);
      }).catch((error:never) => {
        console.log('error retrieving other token symbol', error);
      });
    }
  }

  const getContractAddresses = async () => {
    Object.keys(contractAddresses).length === 0 && await GetJsonAddresses().then((data) => {
      setContractAddresses(data);
    })
  }

  //MAIN FUNCTIONS
  const setTokenValues = (data:number) => {
    setFrom(data);
  }

  const getTokenBalance = async (token:string) => {
    const tokenContract = token === 'other' ? await TokenContract_other : await TokenContract_main;

    if(address !== null && tokenContract) {
      //@ts-ignore
      tokenContract.methods.balanceOf(address).call().then((data:never) => {
        token === 'other' ? setBalance(prevState => ({...prevState, other: data})) : setBalance(prevState => ({...prevState, main: data}));
      });
    }
  }

  const checkMaxLength = (inputData: { currentTarget: { value: string | never[]; };}) => {
    if(inputData.currentTarget.value.slice(0,1) === '-')
      inputData.currentTarget.value = '0'

    if(inputData.currentTarget.value.length > 8) 
      inputData.currentTarget.value = inputData.currentTarget.value.slice(0, 8);
  }

  const approveCurrency = async (token:string) => {
    setTransactionData(null);
    token === TOKENS.HUMAN_READABLE.SEURO ? setLoadingMain(true) : setLoadingOther(true);
    const _depositAmount = token === TOKENS.HUMAN_READABLE.SEURO ? ConvertTo(from, mainTokenDecimal).raw() : ConvertTo(to, otherTokenDecimal).raw();
    //@ts-ignore
    const bondingEventAddress = contractAddresses[_network]['CONTRACT_ADDRESSES']['BondingEvent'];
    const TokenContract = token === TOKENS.HUMAN_READABLE.SEURO ? await (await TokenContract_main) : await (await TokenContract_other);

    // @ts-ignore
    token === TOKENS.HUMAN_READABLE.SEURO ? (
      //@ts-ignore
      TokenContract.methods.approve(bondingEventAddress, _depositAmount).send({from: address}).then(() => {
        token === TOKENS.HUMAN_READABLE.SEURO ? setLoadingMain(false) : setLoadingOther(false);

      setAssetApproved(prevState => ({
        ...prevState,
        main: true
      }))
    }).catch((error:never) => {
      token === TOKENS.HUMAN_READABLE.SEURO ? setLoadingMain(false) : setLoadingOther(false);
      setAssetApproved(prevState => ({
        ...prevState,
        main: false
      }))
      toast.error('Approval error', error);
    })
    )
    :
    (
      //@ts-ignore
    TokenContract.methods.approve(bondingEventAddress, _depositAmount).send({from: address}).then(() => {
      token === TOKENS.HUMAN_READABLE.SEURO ? setLoadingMain(false) : setLoadingOther(false);
      setAssetApproved(prevState => ({
        ...prevState,
        other: true
      }))
    }).catch((error:never) => {
      token === TOKENS.HUMAN_READABLE.SEURO ? setLoadingMain(false) : setLoadingOther(false);
      setAssetApproved(prevState => ({
        ...prevState,
        other: false
      }))
      toast.error('Approval error', error);
    })
    )
  }

  const getBondingLengths = async() => {
    const TokenContractMain = await TokenContract_main;
    const OperatorStage2 = await OperatorStage2Contract;

    if (TokenContractMain) {
      // @ts-ignore
      await OperatorStage2.methods.showRates().call()
      .then((data:Rate[]) => {
        const ArrayCopy = [...data];
        const sortedRates = ArrayCopy.sort((a,b) => (parseInt(a.duration) > parseInt(b.duration)) ? 1 : ((parseInt(b.duration) > parseInt(a.duration)) ? -1 : 0));
        const defaultBondIndex = Math.floor(sortedRates.length/2);
        //@ts-ignore
        setRates(sortedRates);
        setBondingLength(sortedRates[defaultBondIndex])
      });

      // @ts-ignore
      await TokenContractMain.methods.decimals().call()
      .then((data:never) => {
        setmainTokenDecimal(data);
      }).catch((error:never) => {
        console.log('error retrieving main token decimal', error);
      });
    }
  }

  const getRewardAmount = async () => {
      const storage = await Storage;
      //@ts-ignore
      const _formatFrom = from > 0 ? ConvertTo(from, mainTokenDecimal).raw() : 0;
      const _formatTo = ConvertTo(to, otherTokenDecimal).raw() || 0;
      const _rate = bondingLength?.rate || 9000;

      // @ts-ignore
      storage && await storage.methods.calculateBondYield(_formatFrom, _formatTo, _rate).call()
      .then((data:never) => {
        const convertedReward = from > 0 ? ConvertFrom(data['payout'], tstTokenInfo.decimal).toFloat().toFixed(2) : 0;
        //@ts-ignore
        setReward(convertedReward);
      }).catch((error:never) => {
        console.log('error fetching yield', error);
      });
  }

  const getOtherTokenAddress = async () => {
    const smartContract = await SmartContract;
    // @ts-ignore
    smartContract && await smartContract.methods.OTHER_ADDRESS().call()
    .then(async (data:never) => {
      setOtherTokenAddress(data);
    }).catch((error:never) => {
      console.log('error retrieving other address', error);
    });
  }

  const setBondingLengthClickHandler = (rateObj:object) => {
    //@ts-ignore
    setBondingLength(rateObj);
  }

  const getTokenAmount = async () => {
    // get the token conversion from seuro to USDT
    const formatSeuro = ConvertTo(from, mainTokenDecimal).raw();
    //console.log('seuro amount', from, 'mainTokenDecimal', mainTokenDecimal);
    setLoading(true);
    // @ts-ignore
    await(await SmartContract).methods.getOtherAmount(formatSeuro).call()
    .then((data:never) => {
      setLoading(false);
      const _otherTokenDecimal = parseInt(otherTokenDecimal.toString());

      const bigNumberTo = ConvertFrom(data['amountOther'], otherTokenDecimal).raw();
      const convertDisplayTo = ConvertFrom(data['amountOther'], _otherTokenDecimal).toFloat();

      setToDisplay(convertDisplayTo);
      setTo(bigNumberTo);

    }).catch((error:never) => {
      setLoading(false);
      toast.error(`Get ${otherTokenSymbol} amount error`, error);
    });
  }

  const SendBondTransaction = async () => {
    setLoadingTransaction(true);
    const _formatValue = ConvertTo(from, mainTokenDecimal).raw();
    // @ts-ignore
    const _bondingRate = bondingLength['rate'] || 0;
    const defaultBondIndex = Math.floor(rates.length/2);
    // @ts-ignore
    await (await OperatorStage2Contract).methods.newBond(_formatValue, _bondingRate).send({from:address})
      .then((data:never) => {
        setLoading(false);
        setLoadingTransaction(false);
        setTransactionData(data);
        setFrom(0);
        setTo('');
        setToDisplay(0);
        setBondingLength(rates[defaultBondIndex]);
        setDisabledSend(true);
        // @ts-ignore
        toast.success(`Transaction success: ${data['transactionHash']}`);
      }).catch((error:never) => {
        setLoadingTransaction(false);
        toast.error(`Error creating new bond: ${ error}`);
      });
  }

  const bondingHistoryClickHandler = () => router.push({query: {'history': 'true'}});

  return !showHistoryInterface ? (
    <StyledMainContainer>
    <DescriptionContainer>
      <b>What is sEURO bonding?</b> Receive TST when you add your {TOKENS.DISPLAY.SEURO} and {otherTokenSymbol} to the liquidity pool. Lock up your assets, wait the bond period, and claim the reward. You will receive an amount of TST corresponding to the value of the bonded assets plus an interest rate reward of it. Your TST can then be used for protocol governance and staking in Stage 3!
    </DescriptionContainer>

    <StyledBondingHistoryButtonContainer>
      <StyledBondingHistoryButton onClick={bondingHistoryClickHandler}>View History</StyledBondingHistoryButton>
    </StyledBondingHistoryButtonContainer>

    <StyledBondingInterfaceContainer>
      { web3Provider ? (
        <>
        <span>
          <StyledPContainer>Bonding Asset 1</StyledPContainer>

        

          <div>
            <StyledInputContainers>
              <input type='number' step="any" min={0} maxLength={8} onInput={checkMaxLength} placeholder={`${TOKENS.DISPLAY.SEURO} amount`} onChange={(e) => setTokenValues(parseFloat(e.currentTarget.value))} onFocus={(event) => event.target.select()} value={from > 0 ? from : ''} />
              <div className="dropdownSelect">
                <StyledNoFormatP>{TOKENS.DISPLAY.SEURO}</StyledNoFormatP>
              </div>
        </StyledInputContainers>

              <p style={{margin: '-20px 0 25px 0', color: '#99f9ff', fontSize: '12px'}}>Available: {balance.main !== '0' ? `${ConvertFrom(balance.main.toString(), mainTokenDecimal).toFloat().toFixed(2)} ${TOKENS.DISPLAY.SEURO}`: `Warning: you do not have enough ${TOKENS.DISPLAY.SEURO}`}</p>

          </div>
        

          <StyledPContainer>Bonding Asset 2</StyledPContainer>
          <div>
            <StyledInputContainers>
              <input className="w-9/12" type='number' step="any" readOnly={true} placeholder={`${otherTokenSymbol} amount`} value={to !== '0' ? toDisplay : ''} />
              <div className="dropdownSelect readOnly">
                <StyledNoFormatP>{otherTokenSymbol ? otherTokenSymbol : 'Loading...'}</StyledNoFormatP>
              </div>
            </StyledInputContainers>
        
            <p style={{margin: '-20px 0 25px 0', color: '#99f9ff', fontSize: '12px'}}>Available: {balance.other !== '0' ? `${ConvertFrom(balance.other.toString(), parseInt(otherTokenDecimal.toString())).toFloat().toFixed(2)} ${otherTokenSymbol}` : `Warning: you do not have enough ${otherTokenSymbol}`}</p>
          </div>
        </span>
        
        <StyledPContainer>Select Bond Period</StyledPContainer>
        <StyledRateSelectionContainer>
          {
            rates.length > 0 ? rates.map((rate:Rate, index) => {
              return (
                <RateSelectionButton rate={rate} key={index} isSelected={bondingLength?.duration === rate.duration} clickHandler={(event) => setBondingLengthClickHandler(event)}/>
              )
            })
            :
            'Loading Rates...'
          }
        </StyledRateSelectionContainer>

        <p style={{margin: 'px 0 25px 0', color: '#99f9ff', fontSize: '12px'}}>Reward: {reward} {tstTokenInfo.symbol} </p>

            {
              <StyledTransactionButtonContainer>
                {
                  <>
                  <StyledTransactionButton className="halfWidth" disabled={loadingOther || loadingMain || loading || disabledApprovalButton.main} onClick={() => approveCurrency(TOKENS.HUMAN_READABLE.SEURO)}>{assetApproved.main ? `${from} ${TOKENS.DISPLAY.SEURO} Approved` : loadingMain ? `Approving ${from} ${TOKENS.DISPLAY.SEURO}...` : `Approve ${from} ${TOKENS.DISPLAY.SEURO}`}</StyledTransactionButton>
                  <StyledTransactionButton className="halfWidth noRightMargin" disabled={loadingMain || loadingOther || loading || disabledApprovalButton.other} onClick={() => approveCurrency(otherTokenSymbol)}>{assetApproved.other ? `${toDisplay} ${otherTokenSymbol} Approved` : loadingOther ? `Approving ${toDisplay} ${otherTokenSymbol}...` : `Approve ${toDisplay} ${otherTokenSymbol}`}</StyledTransactionButton>
                  </>
                }
              </StyledTransactionButtonContainer>
            }
            
            {            
            <StyledTransactionButton disabled={loading || loadingTransaction || disabledSend} onClick={() => SendBondTransaction()}>{loadingTransaction ? 'Processing bond...' : transactionData ? 'Start Another Bond' : 'Start Bond'}</StyledTransactionButton>
            }
            {// @ts-ignore
            transactionData && <StyledTransactionButton className='marginTop' onClick={() => window.open(`${etherscanUrl}/tx/${transactionData['transactionHash']}`,"_blank")}>Show Transaction</StyledTransactionButton>
            }
            </>
      ) : <div>Please Connect Wallet...</div>
      }
    </StyledBondingInterfaceContainer>
    </StyledMainContainer>
    )
    :
    (
      <div className="container mx-auto w-full">
            {
                // @ts-ignore
                <BondingHistoryInterface otherTokenData={otherTokenInfo} />
            }
      </div>
    )
}

export default Web3BondInterface;
