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
import { toLocaleFixed } from '../../../Utils/IntegerConverter';

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
  const [toDisplay, setToDisplay] = useState('0');
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
    setNetwork(network?.name === 'homestead' ? 'mainnet' : network?.name);
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
    const convertFrom = ConvertTo(from, mainTokenDecimal).toInt();
    const convertTo = ConvertTo(to, otherTokenDecimal).toInt();

    from > 0 && allowance.main >= convertFrom ?
      setAssetApproved(prevState => ({...prevState, main: true}))
      :
      setAssetApproved(prevState => ({...prevState, main: false}));

      convertTo > 0 && allowance.other >= convertTo ?
      setAssetApproved(prevState => ({...prevState, other: true}))
      :
      setAssetApproved(prevState => ({...prevState, other: false}))

  }, [allowance, from, to])

  useEffect(() => {
    getOtherContractAddress();
    checkAllowances();
  }, [otherTokenAddress])

  useEffect(() => {
    checkAllowances();
  }, [from, to])

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
    console.log('updatefrom', from)
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
    const number = data && data < 0 ? 0 : data;
    const setNumber = number !== NaN ? number : 0;
    setFrom(setNumber);
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
    const _depositAmount = token === TOKENS.HUMAN_READABLE.SEURO ? ConvertTo(from, mainTokenDecimal).raw() : to;
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
      const _rate = bondingLength?.rate || 9000;

      // @ts-ignore
      storage && await storage.methods.calculateBondYield(_formatFrom, to, _rate).call()
      .then((data:never) => {
        const payoutConvert = ConvertFrom(data['payout'], 18).raw();
        const convertedReward = from > 0 ? payoutConvert : 0;
        //@ts-ignore
        setReward(toLocaleFixed(convertedReward, 2));
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

      const displayToConvert = from && from > 0 ? ConvertFrom(data['amountOther'], _otherTokenDecimal).raw() : 0 ;
      //@ts-ignore
      setToDisplay(toLocaleFixed(displayToConvert, 2) || 0);
      setTo(data['amountOther']);

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
        setToDisplay('0');
        setBondingLength(rates[defaultBondIndex]);
        setDisabledSend(true);
        // @ts-ignore
        toast.success(`Transaction success: ${data['transactionHash']}`);
      }).catch(() => {
        setLoadingTransaction(false);
        toast.error(`Error creating new bond, please try again`);
      });
  }

  const checkApprovals = parseInt(ConvertTo(from, mainTokenDecimal).raw()) > parseInt(balance.main) || parseInt(to) > parseInt(balance.other);

  const bondingHistoryClickHandler = () => router.push({query: {'history': 'true'}});
  console.log('main token balance', parseInt(ConvertTo(from, mainTokenDecimal).raw()) > parseInt(balance.main), 'other token balance', parseInt(ConvertTo(to, mainTokenDecimal).raw()) > parseInt(balance.other), 'other balance', parseInt(to), parseInt(balance.other))
  return !showHistoryInterface ? (
    <StyledMainContainer>
    <DescriptionContainer>
    Stage 2: Liquidity Bonding for sEURO<br />Realise the full EURO value by setting up a liquidity bond with sEURO. You can commit the sEURO received in stage 1 with an equal amount of USDC to get a high yield payout in The Standard Token (TST). Note: The sEURO and USDC will remain in the pool and all payouts are done in The Standard Token (TST), our governance token that can be used for staking in Stage 3.<br /> <br /> Note: Percentage yields below are calculated in ROI. For example: 11.22% ROI = 45% APY
    </DescriptionContainer>

    <StyledBondingHistoryButtonContainer>
      <StyledBondingHistoryButton onClick={bondingHistoryClickHandler}>Rewards</StyledBondingHistoryButton>
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

              <p style={balance.main !== '0' ? {margin: '-20px 0 25px 0', color: '#99f9ff', fontSize: '12px'} : {margin: '-20px 0 25px 0', color: '#cb4464', fontSize: '12px'}}>{balance.main !== '0' ? `Available: ${ConvertFrom(balance.main.toString(), mainTokenDecimal).toFloat().toFixed(2)} ${TOKENS.DISPLAY.SEURO}`: `Warning: you do not have enough ${TOKENS.DISPLAY.SEURO}`}</p>

          </div>
        

          <StyledPContainer>Bonding Asset 2</StyledPContainer>
          <div>
            <StyledInputContainers>
              <input className="w-9/12" type='string' step="any" readOnly={true} placeholder={`${otherTokenSymbol} amount`} value={to !== '0' ? toDisplay : ''} />
              <div className="dropdownSelect readOnly">
                <StyledNoFormatP>{otherTokenSymbol ? otherTokenSymbol : 'Loading...'}</StyledNoFormatP>
              </div>
            </StyledInputContainers>
        
            <p style={balance.other !== '0' ? {margin: '-20px 0 25px 0', color: '#99f9ff', fontSize: '12px'} : {margin: '-20px 0 25px 0', color: '#cb4464', fontSize: '12px'}}>{balance.other !== '0' ? `Available: ${ConvertFrom(balance.other.toString(), parseInt(otherTokenDecimal.toString())).toFloat().toFixed(2)} ${otherTokenSymbol}` : `Warning: you do not have enough ${otherTokenSymbol}`}</p>
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

        <p style={{margin: 'px 0 25px 0', color: '#99f9ff', fontSize: '12px'}}>Reward: {reward || 0} {tstTokenInfo.symbol} </p>

            {
              <StyledTransactionButtonContainer>
                {
                  <>
                  <StyledTransactionButton className="halfWidth" disabled={checkApprovals || loadingOther || loadingMain || loading || disabledApprovalButton.main} onClick={() => approveCurrency(TOKENS.HUMAN_READABLE.SEURO)}>{assetApproved.main ? `${from} ${TOKENS.DISPLAY.SEURO} Approved` : loadingMain ? `Approving ${from} ${TOKENS.DISPLAY.SEURO}...` : `Approve ${from || 0} ${TOKENS.DISPLAY.SEURO}`}</StyledTransactionButton>
                  <StyledTransactionButton className="halfWidth noRightMargin" disabled={checkApprovals || loadingMain || loadingOther || loading || disabledApprovalButton.other} onClick={() => approveCurrency(otherTokenSymbol)}>{assetApproved.other ? `${toDisplay} ${otherTokenSymbol} Approved` : loadingOther ? `Approving ${toDisplay} ${otherTokenSymbol}...` : `Approve ${from > 0 ? toDisplay : 0} ${otherTokenSymbol}`}</StyledTransactionButton>
                  </>
                }
              </StyledTransactionButtonContainer>
            }
            
            {            
            <StyledTransactionButton disabled={checkApprovals || loading || loadingTransaction || disabledSend} onClick={() => SendBondTransaction()}>{loadingTransaction ? 'Processing bond...' : transactionData ? 'Start Another Bond' : 'Start Bond'}</StyledTransactionButton>
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
