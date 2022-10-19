/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3Context } from '../../../context'
import React, { 
  useEffect, 
  useState } from 'react'
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
  const { address, web3Provider, network } = useWeb3Context();
  const [seuroAddress, setSeuroAddress] = useState();
  const [showHistoryInterface, setShowHistoryInterface] = useState(false);
  const [contractAddresses, setContractAddresses] = useState({});
  const [otherTokenAddress, setOtherTokenAddress] = useState(null);
  const [otherTokenSymbol, setOtherTokenSymbol] = useState('');
  const [otherTokenDecimal, setOtherTokenDecimal] = useState(0);
  const [mainTokenDecimal, setmainTokenDecimal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState('0');
  const [toDisplay, setToDisplay] = useState(0);
  const [rates, setRates] = useState([]);
  const [balance, setBalance] = useState({main: '0', other: '0'});
  const [allowance, setAllowance] = useState({main: 0, other: 0});
  const [bondingLength, setBondingLength] = useState<Rate>();
  const [disabledSend, setDisabledSend] = useState(true);
  const [assetApproved, setAssetApproved] = useState({main: false, other: false});
  const [disabledApprovalButton, setDisabledApprovalButton] = useState({main: true, other: true});
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  // CONTRACT MANAGER INIT
  const _network = network?.name === 'homestead' ? 'main' : network?.name || 'goerli';
  const OperatorStage2Contract = SmartContractManager('OperatorStage2' as Contract).then((data) =>  data);
  const SmartContract = SmartContractManager('BondingEvent' as Contract).then((data) =>  data);
  //@ts-ignore
  const TokenContract_other = otherTokenAddress !== null && TokenContractManager(otherTokenAddress).then((data) =>  data);
  const StandardTokenGatewayContract = SmartContractManager('SEuroOffering').then((data) => data);
    //@ts-ignore
  const TokenContract_main = seuroAddress !== undefined && TokenContractManager(seuroAddress).then((data) => data);
  const otherTokenInfo = {
    otherTokenSymbol, 
    otherTokenDecimal
  };

  // MAIN UPDATE FUNCTIONS
  useEffect(() => {
    getSeuroAddress();
  }, []);

  useEffect(() => {
    getBondingLengths();
    getContractAddresses();
    getOtherTokenAddress();
  }, [seuroAddress])

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
  }, [from, to, assetApproved, bondingLength]);

  useEffect(() => {
    getTokenBalance('main');
    getTokenBalance('other');
    
  }, [address, otherTokenAddress, otherTokenSymbol, otherTokenDecimal]);

  const getSeuroAddress = async () => {
    const standardTokenGatewayContract = await StandardTokenGatewayContract;
    console.log('standardTokenGatewayContract', standardTokenGatewayContract);
    //@ts-ignore
    standardTokenGatewayContract.methods.Seuro().call().then((data:never) => {
      setSeuroAddress(data);
    });
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
    setLoading(true);
    const _depositAmount = token === TOKENS.HUMAN_READABLE.SEURO ? ConvertTo(from, mainTokenDecimal).raw() : ConvertTo(to, otherTokenDecimal).raw();
    //@ts-ignore
    const bondingEventAddress = contractAddresses[network['name']]['CONTRACT_ADDRESSES']['BondingEvent'];
    const TokenContract = token === TOKENS.HUMAN_READABLE.SEURO ? await (await TokenContract_main) : await (await TokenContract_other);

    // @ts-ignore
    token === TOKENS.HUMAN_READABLE.SEURO ? (
      //@ts-ignore
      TokenContract.methods.approve(bondingEventAddress, _depositAmount).send({from: address}).then(() => {
      setLoading(false);

      setAssetApproved(prevState => ({
        ...prevState,
        main: true
      }))
    }).catch((error:never) => {
      setLoading(false);
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
      setLoading(false);
      setAssetApproved(prevState => ({
        ...prevState,
        other: true
      }))
    }).catch((error:never) => {
      setLoading(false);
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
      console.log('TokenContractMain', TokenContractMain);
      // @ts-ignore
      await OperatorStage2.methods.showRates().call()
      .then((data:Rate[]) => {
        const ArrayCopy = [...data];
        const sortedRates = ArrayCopy.sort((a,b) => (parseInt(a.duration) > parseInt(b.duration)) ? 1 : ((parseInt(b.duration) > parseInt(a.duration)) ? -1 : 0))
        //@ts-ignore
        setRates(sortedRates);
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
    setLoading(true);
    const _formatValue = ConvertTo(from, mainTokenDecimal).raw();
    // @ts-ignores
    const _bondingRate = bondingLength['rate'] || 0;
    console.log()
    // @ts-ignore
    await (await OperatorStage2Contract).methods.newBond(_formatValue, _bondingRate).send({from:address})
      .then((data:never) => {
        setLoading(false);
        setTransactionData(data);
        setFrom(0);
        setTo('');
        setToDisplay(0);
        setBondingLength(undefined);
        setDisabledSend(true);
        // @ts-ignore
        toast.success(`Transaction success: ${data['transactionHash']}`);
      }).catch((error:never) => {
        setLoading(false);
        toast.error(`Error creating new bond: ${ error}`);
      });
  }

  const bondingHistoryClickHandler = () => {
      setShowHistoryInterface(!showHistoryInterface)
  }

  return !showHistoryInterface ? (
    <StyledMainContainer>
    <DescriptionContainer>
      <b>What is sEURO bonding?</b> Earn TST when you bond your {TOKENS.DISPLAY.SEURO} and {otherTokenSymbol}. When your bond expires, you will receive the total EURO value of your bonded assets (paid in TST). Plus a generous reward (also in TST)!
    </DescriptionContainer>

    <StyledBondingHistoryButtonContainer>
      <StyledBondingHistoryButton onClick={bondingHistoryClickHandler}>View History</StyledBondingHistoryButton>
    </StyledBondingHistoryButtonContainer>

    <StyledBondingInterfaceContainer>
      { web3Provider ? (
        <>
        <span>
          <StyledPContainer>Bonding asset 1 - <span>(available: {balance.main !== '0' ? `${ConvertFrom(balance.main.toString(), mainTokenDecimal).toFloat().toFixed(2)} ${TOKENS.DISPLAY.SEURO}`: `Warning: you do not have enough ${TOKENS.DISPLAY.SEURO}`})</span></StyledPContainer>
          <div>
            <StyledInputContainers>
              <input type='number' step="any" min={0} maxLength={8} onInput={checkMaxLength} placeholder={`${TOKENS.DISPLAY.SEURO} amount`} onChange={(e) => setTokenValues(parseFloat(e.currentTarget.value))} onFocus={(event) => event.target.select()} value={from > 0 ? from : ''} />
              <div className="dropdownSelect">
                <StyledNoFormatP>{TOKENS.DISPLAY.SEURO}</StyledNoFormatP>
              </div>
            </StyledInputContainers>
          </div>

          <StyledPContainer>Bonding asset 2 - (available: {balance.other !== '0' ? `${ConvertFrom(balance.other.toString(), parseInt(otherTokenDecimal.toString())).toFloat().toFixed(2)} ${otherTokenSymbol}` : `Warning: you do not have enough ${otherTokenSymbol}`})</StyledPContainer>
          <div>
            <StyledInputContainers>
              <input className="w-9/12" type='number' step="any" readOnly={true} placeholder={`${otherTokenSymbol} amount`} value={to !== '0' ? toDisplay : ''} />
              <div className="dropdownSelect readOnly">
                <StyledNoFormatP>{otherTokenSymbol ? otherTokenSymbol : 'Loading...'}</StyledNoFormatP>
              </div>
            </StyledInputContainers>
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
            {
              <StyledTransactionButtonContainer>
                {
                  <>
                  <StyledTransactionButton className="halfWidth" disabled={disabledApprovalButton.main} onClick={() => approveCurrency(TOKENS.HUMAN_READABLE.SEURO)}>{assetApproved.main ? `${TOKENS.DISPLAY.SEURO} Approved` : loading ? 'loading...' : `Approve ${TOKENS.DISPLAY.SEURO}`}</StyledTransactionButton>
                  <StyledTransactionButton className="halfWidth noRightMargin" disabled={disabledApprovalButton.other} onClick={() => approveCurrency(otherTokenSymbol)}>{assetApproved.other ? `${otherTokenSymbol} Approved` : loading ? 'loading...' : `Approve ${otherTokenSymbol}`}</StyledTransactionButton>
                  </>
                }
              </StyledTransactionButtonContainer>
            }
            
            {            
            <StyledTransactionButton disabled={disabledSend} onClick={() => SendBondTransaction()}>{loading ? 'loading...' : transactionData ? 'Start Another Bond' : 'Start Bond'}</StyledTransactionButton>
            }
            {// @ts-ignore
            transactionData && <button className="flex px-2 py-1 font-light justify-center" onClick={() => window.open(`https://${network['name']}.etherscan.io/tx/${transactionData['transactionHash']}`,"_blank")}>Show Transaction</button>
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
                <BondingHistoryInterface backButton={bondingHistoryClickHandler} otherTokenData={otherTokenInfo} />
            }
      </div>
    )
}

export default Web3BondInterface;
