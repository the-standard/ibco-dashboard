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
  Tokens, 
} from '../../../Utils';
import { GetJsonAddresses } from '../../../Utils/ContractManager';
import { RateSelectionButton } from './components/RateSelectionButton/RateSelectionButton';
import { BondingHistoryInterface } from './components/BondingHistoryInterface/BondingHistoryInterface';

type Rate = {
  duration: string, 
  rate: string
}

function Web3BondInterface() {
  const { address, web3Provider, network } = useWeb3Context();
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
  const _network = network?.name || 'goerli';
  const OperatorStage2Contract = SmartContractManager('OperatorStage2' as Contract).then((data) => { return data });
  const SmartContract = SmartContractManager('BondingEvent' as Contract).then((data) => { return data });
  //@ts-ignore
  const TokenContract_other = TokenContractManager(otherTokenAddress, _network).then((data) => { return data });
    //@ts-ignore
  const TokenContract_main = TokenContractManager(TOKENS.HUMAN_READABLE.SEURO as Tokens, network).then((data) => { return data });
  const otherTokenInfo = {
    otherTokenSymbol, 
    otherTokenDecimal
  };


  // MAIN UPDATE FUNCTIONS
  useEffect(() => {
    getBondingLengths();
    getContractAddresses();
    getOtherTokenAddress();
    checkAllowances();
  }, [web3Provider]);

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
    
  }, [otherTokenAddress, otherTokenSymbol, otherTokenDecimal]);

  const checkAllowances = async () => {
    const MainToken = await TokenContract_main;
    const OtherToken = await TokenContract_other;

    if (MainToken && OtherToken && address && Object.keys(contractAddresses).length !== 0) {
      //@ts-ignore
      const BondingEventContractAddress = contractAddresses[_network]['CONTRACT_ADDRESSES']['BondingEvent'];
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

    if(address && tokenContract) {
      //@ts-ignore
      tokenContract.methods.balanceOf(address).call().then((data:never) => {
        console.log('balanceOf', data);
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
      toast.error('approval error', error);
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
      toast.error('approval error', error);
    })
    )
  }

  const getBondingLengths = async() => {
    // @ts-ignore
    web3Provider && await (await OperatorStage2Contract).methods.showRates().call()
    .then((data:Rate[]) => {
      const ArrayCopy = [...data];
      const sortedRates = ArrayCopy.sort((a,b) => (parseInt(a.duration) > parseInt(b.duration)) ? 1 : ((parseInt(b.duration) > parseInt(a.duration)) ? -1 : 0))
      //@ts-ignore
      setRates(sortedRates);
    });
    // @ts-ignore
    await (await TokenContract_main).methods.decimals().call()
    .then((data:never) => {
      setmainTokenDecimal(data);
    }).catch((error:never) => {
      console.log('error retrieving main token symbol', error);
    });
  }

  const getOtherTokenAddress = async () => {
    const smartContract = await (await SmartContract);
    // @ts-ignore
    smartContract && await (await SmartContract).methods.OTHER_ADDRESS().call()
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
        toast.success(`transaction success: ${data['transactionHash']}`);
      }).catch((error:never) => {
        setLoading(false);
        toast.error(`Problem with bonding event: ${ error}`);
      });
  }

  const bondingHistoryClickHandler = () => {
      setShowHistoryInterface(!showHistoryInterface)
  }

  return !showHistoryInterface ? (
    <>
    <div className="convertInput mx-auto text-center p-5 mb-4 md:w-6/12">
      <p className="descriptionCopy mb-6 px-10"><b>What is sEURO bonding?</b> Earn TST when you bond your {TOKENS.DISPLAY.SEURO} and {otherTokenSymbol}. When your bond expires, you will receive the total EURO value of your bonded assets (paid in TST). Plus a generous reward (also in TST)!</p>
      <button className="mx-auto py-2 px-16 bondingHistoryButton" onClick={bondingHistoryClickHandler}>View History</button>
    </div>

    <div className="convertInput mx-auto grid grid-flow-row auto-rows-max p-5 py-8 md:w-6/12">
      { web3Provider ? (
        <>
        <span>
          <p className="p-0 m-0 text-sm">Bonding asset 1 - <span>(available: {balance.main !== '0' ? `${ConvertFrom(balance.main.toString(), parseInt(mainTokenDecimal.toString())).toFloat().toFixed(2)} ${TOKENS.DISPLAY.SEURO}`: `Warning: you do not have enough ${TOKENS.DISPLAY.SEURO}`})</span></p>
          <div className="container w-full">
            <div className="mb-8 mt-1 mx-auto flex flex-cols w-full">
              <input className="w-9/12" type='number' step="any" min={0} maxLength={8} onInput={checkMaxLength} placeholder={`${TOKENS.DISPLAY.SEURO} amount`} onChange={(e) => setTokenValues(parseFloat(e.currentTarget.value))} onFocus={(event) => event.target.select()} value={from > 0 ? from : ''} />
              <div className="dropdownSelect py-2 text-center w-3/12">
              <p className="mx-auto">{TOKENS.DISPLAY.SEURO}</p>
              </div>
            </div>
          </div>

          <p className="p-0 m-0 text-sm">Bonding asset 2 - (available: {balance.other !== '0' ? `${ConvertFrom(balance.other.toString(), parseInt(otherTokenDecimal.toString())).toFloat().toFixed(2)} ${otherTokenSymbol}` : `Warning: you do not have enough ${otherTokenSymbol}`})</p>
          <div className="container w-full">
            <div className="mb-8 mt-1 mx-auto flex flex-cols w-full">
              <input className="w-9/12" type='number' step="any" readOnly={true} placeholder={`${otherTokenSymbol} amount`} value={to !== '0' ? toDisplay : ''} />
              <div className="dropdownSelect py-2 text-center w-3/12">
                <p className="mx-auto">{otherTokenSymbol ? otherTokenSymbol : 'Loading...'}</p>
              </div>
            </div>
          </div>
        </span>
        
        <div className="mb-8 mt-1 flex flex-cols justify-between">
          {
            rates.length > 0 ? rates.map((rate:Rate, index) => {
              return (
                <RateSelectionButton rate={rate} key={index} isSelected={bondingLength?.duration === rate.duration} clickHandler={(event) => setBondingLengthClickHandler(event)}/>
              )
            })
            :
            'Loading Rates...'
          }
        </div>
            {
              <div className="mb-8 mt-1 flex flex-rows w-full justify between">
                {
                  <>
                  <button className="w-6/12 px-2 py-1 mr-4 font-light" disabled={disabledApprovalButton.main} onClick={() => approveCurrency(TOKENS.HUMAN_READABLE.SEURO)}>{assetApproved.main ? `${TOKENS.DISPLAY.SEURO} Approved` : loading ? 'loading...' : `Approve ${TOKENS.DISPLAY.SEURO}`}</button>
                  <button className="w-6/12 px-2 py-1 font-light" disabled={disabledApprovalButton.other} onClick={() => approveCurrency(otherTokenSymbol)}>{assetApproved.other ? `${otherTokenSymbol} Approved` : loading ? 'loading...' : `Approve ${otherTokenSymbol}`}</button>
                  </>
                }
              </div>
            }
            
            {            
            <button className="flex px-2 py-1 mb-4 font-light justify-center" disabled={disabledSend} onClick={() => SendBondTransaction()}>{loading ? 'loading...' : transactionData ? 'Start Another Bond' : 'Start Bond'}</button>
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
