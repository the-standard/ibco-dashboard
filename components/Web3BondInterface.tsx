/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3Context } from '../context/'
import React, { 
  useEffect, 
  useState } from 'react'
import { toast } from 'react-toastify';
//import Web3 from 'web3';

//Util Helpers
import { 
  Contract, 
  ConvertFrom, 
  ConvertTo, 
  SmartContractManager, 
  TokenContractManager, 
  TOKENS,
  Tokens, 
} from '../Utils';
import { GetJsonAddresses } from '../Utils/ContractManager';

type Rate = {
  durationInWeeks: string, 
  rate: string
}

function Web3BondInterface() {
  const { address, web3Provider, network } = useWeb3Context();
  const [contractAddresses, setContractAddresses] = useState({});
  const [otherTokenAddress, setOtherTokenAddress] = useState(null);
  const [otherTokenSymbol, setOtherTokenSymbol] = useState('');
  const [otherTokenDecimal, setOtherTokenDecimal] = useState(0);
  const [mainTokenDecimal, setmainTokenDecimal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [rates, setRates] = useState([]);
  const [balance, setBalance] = useState({SEURO: 0, USDT: 0});
  const [bondingLength, setBondingLength] = useState({});
  const [disabledSend, setDisabledSend] = useState(true);
  const [assetApproved, setAssetApproved] = useState({SEURO: false, USDT: false});
  const [disabledApprovalButton, setDisabledApprovalButton] = useState({SEURO: true, USDT: true});
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  // CONTRACT MANAGER INIT
  const _network = network?.name || 'goerli';
  const OperatorStage2Contract = SmartContractManager('OperatorStage2' as Contract, _network).then((data) => { return data });
  const SmartContract = SmartContractManager('BondingEvent' as Contract, _network).then((data) => { return data });
  //@ts-ignore
  const TokenContract_other = TokenContractManager(otherTokenAddress, _network).then((data) => { return data });
    //@ts-ignore
  const TokenContract_main = TokenContractManager(TOKENS.HUMAN_READABLE.SEURO as Tokens, network).then((data) => { return data });

  // PRIVATE HELPERS

  const week2year = (rate:string) => {
    const _rate = parseInt(rate);
    return Math.floor(_rate/52.14285714)
  }

  // MAIN UPDATE FUNCTIONS
  useEffect(() => {
    getBondingLengths();
    getContractAddresses();
    getOtherTokenAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Provider]);

  useEffect(() => {
    getOtherContractAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherTokenAddress])

  // tokens are currently fixed to SEURO and USDT
  useEffect(() => {
    //disable approval buttons
    from > 0 ? setDisabledApprovalButton({SEURO: false, USDT:assetApproved.USDT}) : setDisabledApprovalButton({SEURO: true, USDT:assetApproved.USDT});
    to > 0  ? setDisabledApprovalButton({USDT:false, SEURO:assetApproved.SEURO}) : setDisabledApprovalButton({USDT:true, SEURO:assetApproved.SEURO});

    // disable approval buttons after token is approved
    assetApproved.SEURO && setDisabledApprovalButton({SEURO: true, USDT:assetApproved.USDT});
    assetApproved.USDT && setDisabledApprovalButton({USDT: true, SEURO:assetApproved.SEURO});

    // enable bonding button if both assets are approved
    assetApproved.SEURO && assetApproved.USDT && bondingLength !== null && setDisabledSend(false);

    from > 0 ? getTokenAmount() : setTo(0);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, assetApproved]);

  useEffect(() => {
    getTokenBalance('main');
    getTokenBalance('other');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherTokenAddress, otherTokenSymbol, otherTokenDecimal]);

  const getOtherContractAddress = async () => {
    //@ts-ignore
    if (otherTokenAddress !== null) {
      await (await TokenContract_other).methods.decimals().call()
      .then((data:never) => {
        setOtherTokenDecimal(data);
      }).catch((error:never) => {
        console.log('error retrieving other token decimal', error);
      });
  
      // @ts-ignore
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
    const tokenContract = token === 'other' ? (await TokenContract_other) : (await TokenContract_main);

    if(address && tokenContract) {
      const balance = tokenContract.methods.balanceOf(address).call();
      const formatBalance = token === 'other' ? ConvertFrom(balance, otherTokenDecimal).toInt() : ConvertFrom(balance, mainTokenDecimal).toInt();

      setBalance(prevState => ({
        ...prevState,
        [token]: formatBalance
      }));
      setBalance(prevState => ({
        ...prevState
      }));
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
    const _depositAmount = token !== TOKENS.HUMAN_READABLE.SEURO ? ConvertTo(to, otherTokenDecimal).raw() : ConvertTo(from, mainTokenDecimal).raw();
    // Check the allowance of each of the currencies

    //set the approval if required!
    // @ts-ignore
    token === TOKENS.HUMAN_READABLE.USDT ? (
      //@ts-ignore
    await (await TokenContract_main).methods.approve(contractAddresses[network['name']]['CONTRACT_ADDRESSES']['BondingEvent'], _depositAmount).send({from: address}).then(() => {
      setLoading(false);
      setAssetApproved({USDT: true, SEURO: assetApproved.SEURO});
    }).catch((error:never) => {
      setLoading(false);
      setAssetApproved({USDT: false, SEURO: assetApproved.SEURO});
      toast.error('approval error', error);
    })
    )
    :
    (
      //@ts-ignore
    await (await TokenContract_other).methods.approve(contractAddresses[network['name']]['CONTRACT_ADDRESSES']['BondingEvent'], _depositAmount).send({from: address}).then(() => {
      setLoading(false);
      setAssetApproved({SEURO: true, USDT: assetApproved.USDT});
    }).catch((error:never) => {
      setLoading(false);
      setAssetApproved({SEURO: false, USDT: assetApproved.USDT});
      toast.error('approval error', error);
    })
    )
  }

  const getBondingLengths = async() => {
    // @ts-ignore
    await (await OperatorStage2Contract).methods.showRates().call()
    .then((data:never) => {
      setRates(data);
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
      const bigNumberFrom = ConvertFrom(data['amountOther'], 6).toFloat();
      setTo(bigNumberFrom);
    }).catch((error:never) => {
      setLoading(false);
      toast.error('Get USTD amount error', error);
    });
  }

  const SendBondTransaction = async () => {
    setLoading(true);
    const _formatSeuro = ConvertTo(from, mainTokenDecimal).raw();
    // @ts-ignores
    const _bondingRate = bondingLength['rate'] || 0;
    // @ts-ignore
    await (await OperatorStage2Contract).methods.newBond(_formatSeuro, _bondingRate).send({from:address})
      .then((data:never) => {
        setTransactionData(data);
        // @ts-ignore
        toast.success(`transaction success: ${data['transactionHash']}`);
      }).catch((error:never) => {
        toast.error(`Problem with bonding event: ${ error}`);
      });
  }

  return (
    //TODO: Finish styling for all devices
    <div className="convertInput grid grid-flow-row auto-rows-max p-5 py-8 w-full">
      { web3Provider ? (
        <>
        <span>
          <p className="p-0 m-0 text-sm">Bonding asset 1</p>
          <div className="container w-full">
            <div className="mb-8 mt-1 mx-auto flex flex-cols w-full">
              <input className="w-9/12" type='number' step="any" min={0} maxLength={8} onInput={checkMaxLength} onChange={(e) => setTokenValues(parseFloat(e.currentTarget.value))} onFocus={(event) => event.target.select()} value={from > 0 ? from : 0} />
              <div className="dropdownSelect py-2 text-center w-3/12">
              <p className="mx-auto">{TOKENS.HUMAN_READABLE.SEURO}</p>
              </div>
            </div>
          </div>
          <div className="mb-2">Available: {balance.SEURO > 0 ? (balance.SEURO).toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}</div>

          <p className="p-0 m-0 text-sm">Bonding asset 2</p>
          <div className="container w-full">
            <div className="mb-8 mt-1 mx-auto flex flex-cols w-full">
              <input className="w-9/12" type='number' step="any" min={0} readOnly={true} maxLength={8} onInput={checkMaxLength}  value={to > 0 ? to : 0} />
              <div className="dropdownSelect py-2 text-center w-3/12">
                <p className="mx-auto">{otherTokenSymbol}</p>
              </div>
            </div>
          </div>
          <div className="mb-2">Available: {balance.USDT > 0 ? (balance.USDT).toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}</div>
        </span>
        
        <div className="mb-8 mt-1 flex flex-cols justify-between">
          {
            rates.map((rate:Rate, index) => {
              return (
                <button onClick={() => {setBondingLengthClickHandler(rate);}} className="rateContainer flex flex-cols justify-between font-light m-1 p-2" key={index}>
                  {week2year(rate.durationInWeeks) < 1 ? `${rate.durationInWeeks} ${parseInt(rate.durationInWeeks) === 1 ? 'week' : 'weeks'}` : `${week2year(rate.durationInWeeks)} ${week2year(rate.durationInWeeks) === 1 ? 'year' : 'years'}`}
                </button>
              )
            })
          }
        </div>
        <div>
          {
            // @ts-ignore
            bondingLength && <p>Rate selected: {bondingLength['durationInWeeks'] || 0}</p>
          }
        </div>
            {
              <div className="mb-8 mt-1 flex flex-rows w-full justify between">
                {
                  <>
                  <button className="w-6/12 px-2 py-1 mr-4 font-light" disabled={disabledApprovalButton.SEURO} onClick={() => approveCurrency(TOKENS.HUMAN_READABLE.SEURO)}>{assetApproved.SEURO ? `${TOKENS.HUMAN_READABLE.SEURO} Approved` : loading ? 'loading...' : `Approve ${TOKENS.HUMAN_READABLE.SEURO}`}</button>
                  <button className="w-6/12 px-2 py-1 font-light" disabled={disabledApprovalButton.USDT} onClick={() => approveCurrency(TOKENS.HUMAN_READABLE.USDT)}>{assetApproved.USDT ? `${TOKENS.HUMAN_READABLE.USDT} Approved` : loading ? 'loading...' : `Approve ${TOKENS.HUMAN_READABLE.USDT}`}</button>
                  </>
                }
              </div>
            }
            
            {            
            <button className="flex px-2 py-1 mb-4 font-light justify-center" disabled={disabledSend} onClick={() => SendBondTransaction()}>{loading ? 'loading...' : 'Start Bond'}</button>
            }
            {// @ts-ignore
            transactionData && <button className="flex px-2 py-1 font-light justify-center" onClick={() => window.open(`https://${network['name']}.etherscan.io/tx/${transactionData['transactionHash']}`,"_blank")}>Show Transaction</button>
            }
            </>
      ) : <div>Please Connect Wallet...</div>
}
    </div>
  )
}

export default Web3BondInterface;
